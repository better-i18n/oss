/**
 * Main analyzer module
 *
 * Parses TypeScript/JSX files and applies detection rules
 */

import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  checkDataStructure,
  checkJsxAttribute,
  checkJsxText,
  checkStringVariable,
  checkTernaryLocale,
  checkToastMessage,
  checkTranslationFunction,
} from "./rules/index.js";
import type { Issue, LintConfig, RuleContext } from "./types.js";

// Type for analysis statistics
interface AnalyzerStats {
  dynamicKeys: number;
  dynamicNamespaces: number;
  unboundTranslators: number;
  rootScopedTranslators: number;
  dataStructureKeys?: number;
  dataStructureScopes?: number;
}

// Type for namespace binding information
interface NamespaceBinding {
  type: "root-scoped" | "bound-scoped" | "unknown-scoped";
  namespace?: string;
  dynamic?: boolean;
}

/**
 * Analyze a single file for hardcoded strings
 */
export async function analyzeFile(
  filePath: string,
  config?: LintConfig,
  verbose?: boolean,
): Promise<{ issues: Issue[]; stats: AnalyzerStats }> {
  const sourceText = readFileSync(filePath, "utf-8");
  return analyzeSourceText(sourceText, filePath, config, verbose);
}

/**
 * Extract keys from @i18n-keys comments
 * Examples:
 *   // @i18n-keys: pricing.plans.free.name, pricing.plans.pro.name
 *   /* @i18n-keys: common.title, common.description *\/
 */
function extractAnnotatedKeys(sourceText: string): string[] {
  const keys: string[] = [];

  // Match single-line comments: // @i18n-keys: key1, key2
  const singleLineRegex = /\/\/\s*@i18n-keys:\s*([^\n]+)/g;
  let match;

  while ((match = singleLineRegex.exec(sourceText)) !== null) {
    const keyList = match[1].trim();
    const parsedKeys = keyList.split(',').map(k => k.trim()).filter(Boolean);
    keys.push(...parsedKeys);
  }

  // Match multi-line comments: /* @i18n-keys: key1, key2 */
  const multiLineRegex = /\/\*\s*@i18n-keys:\s*([^*]*)\*\//g;

  while ((match = multiLineRegex.exec(sourceText)) !== null) {
    const keyList = match[1].trim();
    // Handle both comma-separated and line-separated keys
    const parsedKeys = keyList
      .split(/[,\n]/)
      .map(k => k.trim().replace(/^-\s*/, '')) // Remove leading dashes for bullet lists
      .filter(Boolean);
    keys.push(...parsedKeys);
  }

  return keys;
}

/**
 * Analyze source text (useful for testing)
 */
export function analyzeSourceText(
  sourceText: string,
  filePath: string,
  config?: LintConfig,
  verbose?: boolean,
): { issues: Issue[]; stats: AnalyzerStats } {
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(filePath),
  );

  const issues: Issue[] = [];
  const stats: AnalyzerStats = {
    dynamicKeys: 0,
    dynamicNamespaces: 0,
    unboundTranslators: 0,
    rootScopedTranslators: 0,
    dataStructureKeys: 0,
    dataStructureScopes: 0,
  };

  // Extract annotated keys from comments
  const annotatedKeys = extractAnnotatedKeys(sourceText);
  if (annotatedKeys.length > 0 && verbose) {
    console.log(`[VERBOSE] Found ${annotatedKeys.length} annotated keys in ${filePath}`);
  }

  // Add annotated keys as static translation keys
  for (const key of annotatedKeys) {
    issues.push({
      file: filePath,
      line: 0, // We don't track exact line for annotations
      column: 0,
      text: key,
      type: "string-variable",
      severity: "info",
      message: `Annotated translation key: "${key}"`,
      key,
      bindingType: "unbound",
    });
  }

  // Helper function to detect binding from initializer (used in both pre-scan and main scan)
  function detectBinding(initializer: ts.Expression): NamespaceBinding | null {
    // Unwrap await
    const call = ts.isAwaitExpression(initializer)
      ? initializer.expression
      : initializer;

    if (!ts.isCallExpression(call)) return null;

    const funcName = getIdentifierName(call.expression);

    if (funcName === "useTranslations" || funcName === "useTranslation") {
      if (call.arguments.length === 0) {
        stats.rootScopedTranslators++;
        return { type: "root-scoped" };
      }
      const arg = call.arguments[0];
      if (ts.isStringLiteral(arg)) {
        return { type: "bound-scoped", namespace: arg.text };
      }
      stats.dynamicNamespaces++;
      return { type: "unknown-scoped", dynamic: true };
    }

    if (funcName === "getTranslations") {
      if (call.arguments.length === 0) {
        stats.rootScopedTranslators++;
        return { type: "root-scoped" };
      }
      const arg = call.arguments[0];

      // Check for string literal: getTranslations("namespace")
      if (ts.isStringLiteral(arg)) {
        return { type: "bound-scoped", namespace: arg.text };
      }

      // Check for object literal: getTranslations({ locale, namespace: "namespace" })
      if (ts.isObjectLiteralExpression(arg)) {
        const nsProp = arg.properties.find(
          (p) =>
            (ts.isPropertyAssignment(p) ||
              ts.isShorthandPropertyAssignment(p)) &&
            ts.isIdentifier(p.name) &&
            p.name.text === "namespace",
        );
        if (!nsProp) {
          stats.rootScopedTranslators++;
          return { type: "root-scoped" };
        }
        if (ts.isPropertyAssignment(nsProp)) {
          if (ts.isStringLiteral(nsProp.initializer)) {
            return {
              type: "bound-scoped",
              namespace: nsProp.initializer.text,
            };
          }
          stats.dynamicNamespaces++;
          return { type: "unknown-scoped", dynamic: true };
        }
        // Shorthand implies identifier, which is dynamic in this context
        stats.dynamicNamespaces++;
        return { type: "unknown-scoped", dynamic: true };
      }

      // All other cases are dynamic
      stats.dynamicNamespaces++;
      return { type: "unknown-scoped", dynamic: true };
    }

    return null;
  }

  // Pre-scan to find all useTranslations calls in the file
  // This enables file-level namespace inference for data structures
  const fileNamespaces: string[] = [];

  // Lightweight namespace extraction (doesn't modify stats)
  function extractNamespace(initializer: ts.Expression): string | null {
    const call = ts.isAwaitExpression(initializer)
      ? initializer.expression
      : initializer;

    if (!ts.isCallExpression(call)) return null;

    const funcName = getIdentifierName(call.expression);

    // Handle useTranslations/useTranslation
    if (funcName === "useTranslations" || funcName === "useTranslation") {
      if (call.arguments.length > 0 && ts.isStringLiteral(call.arguments[0])) {
        return call.arguments[0].text;
      }
    }

    // Handle getTranslations
    if (funcName === "getTranslations") {
      const arg = call.arguments[0];
      if (arg) {
        if (ts.isStringLiteral(arg)) {
          return arg.text;
        }
        if (ts.isObjectLiteralExpression(arg)) {
          const nsProp = arg.properties.find(
            (p) =>
              (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) &&
              ts.isIdentifier(p.name) &&
              p.name.text === "namespace",
          );
          if (nsProp && ts.isPropertyAssignment(nsProp) && ts.isStringLiteral(nsProp.initializer)) {
            return nsProp.initializer.text;
          }
        }
      }
    }

    return null;
  }

  function preScan(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const namespace = extractNamespace(node.initializer);
      if (namespace) {
        fileNamespaces.push(namespace);
        if (verbose) {
          console.log(`[VERBOSE] Pre-scan found namespace: "${namespace}"`);
        }
      }
    }
    ts.forEachChild(node, preScan);
  }

  preScan(sourceFile);

  if (fileNamespaces.length > 0 && verbose) {
    console.log(`[VERBOSE] File-level namespaces: [${fileNamespaces.join(", ")}]`);
  }

  // Lexical scope stack: each element is a map of identifier -> NamespaceBinding
  const scopeStack: Record<string, NamespaceBinding>[] = [{}];

  // Track if we're in a translation-aware function (has 't' parameter)
  let translationScopeDepth = 0;

  // Track if we're inside a data structure to avoid duplicate detection
  let insideDataStructure = false;

  function pushScope() {
    scopeStack.push({});
  }

  function popScope() {
    scopeStack.pop();
  }

  function getCurrentBindings(): Record<string, NamespaceBinding> {
    const combined: Record<string, NamespaceBinding> = {};
    for (const scope of scopeStack) {
      Object.assign(combined, scope);
    }
    return combined;
  }

  function registerBinding(name: string, binding: NamespaceBinding) {
    scopeStack[scopeStack.length - 1][name] = binding;
  }

  // Check if rules are enabled
  const rules = config?.rules || {};
  const jsxTextEnabled = rules["jsx-text"] !== "off";
  const jsxAttrEnabled = rules["jsx-attribute"] !== "off";
  const ternaryEnabled = rules["ternary-locale"] !== "off";
  const toastEnabled = rules["toast-message"] !== "off";
  const stringVarEnabled = rules["string-variable"] !== "off";
  const dataStructureEnabled = config?.dataStructureDetection?.enabled !== false;

  function visit(node: ts.Node) {
    let pushed = false;
    let isTranslationScope = false;

    // Scoping nodes: functions, blocks
    if (ts.isFunctionLike(node) || ts.isBlock(node)) {
      pushScope();
      pushed = true;

      // Check if this function has a 't' parameter (translation-aware)
      if (ts.isFunctionLike(node)) {
        const hasTParameter = node.parameters.some((param) => {
          if (ts.isIdentifier(param.name)) {
            return param.name.text === "t" || /^t[A-Z]/.test(param.name.text);
          }
          return false;
        });

        if (hasTParameter) {
          isTranslationScope = true;
          translationScopeDepth++;
          if (stats && stats.dataStructureScopes !== undefined) stats.dataStructureScopes++;
        }
      }
    }

    // Detect bindings in VariableDeclarations
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const binding = detectBinding(node.initializer);
      if (binding) {
        if (ts.isIdentifier(node.name)) {
          registerBinding(node.name.text, binding);
        } else if (ts.isObjectBindingPattern(node.name)) {
          // const { t } = useTranslations()
          for (const element of node.name.elements) {
            const id = ts.isIdentifier(element.name) ? element.name.text : null;
            const prop =
              element.propertyName && ts.isIdentifier(element.propertyName)
                ? element.propertyName.text
                : id;
            if (id && prop === "t") {
              registerBinding(id, binding);
            }
          }
        }
      }
    }

    // Detect bindings in Assignments (t = useTranslations())
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken
    ) {
      const binding = detectBinding(node.right);
      if (binding && ts.isIdentifier(node.left)) {
        registerBinding(node.left.text, binding);
      }
    }

    const ctx: RuleContext = {
      filePath,
      sourceFile,
      namespaceMap: getCurrentBindings(),
      stats,
      verbose,
      translationScope: translationScopeDepth > 0 || Object.keys(getCurrentBindings()).length > 0,
      fileNamespaces,
    };

    // JSX Text
    if (jsxTextEnabled && ts.isJsxText(node)) {
      const issue = checkJsxText(node, ctx);
      if (issue) issues.push(issue);
    }

    // JSX Attribute
    if (jsxAttrEnabled && ts.isJsxAttribute(node)) {
      const issue = checkJsxAttribute(node, ctx);
      if (issue) issues.push(issue);
    }

    // Ternary with locale
    if (ternaryEnabled && ts.isConditionalExpression(node)) {
      const issue = checkTernaryLocale(node, ctx);
      if (issue) issues.push(issue);
    }

    // Translation function calls
    if (ts.isCallExpression(node)) {
      const issue = checkTranslationFunction(node, ctx);
      if (issue) issues.push(issue);

      // Toast message calls
      if (toastEnabled) {
        const toastIssue = checkToastMessage(node, ctx);
        if (toastIssue) issues.push(toastIssue);
      }
    }

    // String variable assignments
    if (stringVarEnabled && ts.isVariableDeclaration(node)) {
      const issue = checkStringVariable(node, ctx);
      if (issue) issues.push(issue);
    }

    // Data structure detection
    const wasInsideDataStructure = insideDataStructure;
    if (dataStructureEnabled && !insideDataStructure) {
      if (ts.isObjectLiteralExpression(node) || ts.isArrayLiteralExpression(node)) {
        insideDataStructure = true;
        const dataIssues = checkDataStructure(node, ctx, config?.dataStructureDetection);
        issues.push(...dataIssues);
      }
    }

    ts.forEachChild(node, visit);

    // Reset data structure tracking after visiting children
    if (wasInsideDataStructure !== insideDataStructure) {
      insideDataStructure = wasInsideDataStructure;
    }

    if (pushed) {
      popScope();
      if (isTranslationScope) {
        translationScopeDepth--;
      }
    }
  }

  visit(sourceFile);

  return { issues, stats };
}

/**
 * Helper to get identifier name
 */
function getIdentifierName(expr: ts.Expression): string | null {
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) return expr.name.text;
  return null;
}

/**
 * Get TypeScript script kind based on file extension
 */
function getScriptKind(filePath: string): ts.ScriptKind {
  if (filePath.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (filePath.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (filePath.endsWith(".ts")) return ts.ScriptKind.TS;
  return ts.ScriptKind.JS;
}
