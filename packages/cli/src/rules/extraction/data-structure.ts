/**
 * Data structure detection rule
 *
 * Detects translation keys stored in data structures (arrays, objects)
 * Uses property name heuristics to identify translation-relevant strings
 */

import ts from "typescript";
import type { DataStructureConfig, Issue, RuleContext } from "../../analyzer/types.js";

/**
 * Default property names that likely contain translation keys
 */
const DEFAULT_PROPERTY_NAMES = new Set([
  "message",
  "label",
  "title",
  "text",
  "description",
  "placeholder",
  "tooltip",
  "translationKey",
  "i18nKey",
  "successMessage",
  "errorMessage",
  "warningMessage",
  "infoMessage",
]);

/**
 * Default configuration for data structure detection
 */
const DEFAULT_CONFIG: DataStructureConfig = {
  enabled: true,
  requireTranslationScope: true,
  maxDepth: 3,
  propertyNames: [],
};

/**
 * Check if a string value looks like a translation key
 * Filters out obvious non-translation strings
 */
function looksLikeTranslationKey(value: string): boolean {
  if (value.length < 2) return false;
  if (value.startsWith("http://") || value.startsWith("https://")) return false;
  if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) return false;
  if (value.includes(" ") && (value.includes("-") || value.includes("_"))) return false;
  if (value.startsWith("data:")) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^rgb\(/.test(value)) return false;
  if (/^\d+$/.test(value)) return false;
  if (/^[^a-zA-Z0-9]+$/.test(value)) return false;

  return true;
}

/**
 * Extract string literals from object literal expression
 */
function extractFromObjectLiteral(
  node: ts.ObjectLiteralExpression,
  propertyNames: Set<string>,
  currentDepth: number,
  maxDepth: number,
): string[] {
  if (currentDepth > maxDepth) return [];

  const keys: string[] = [];

  for (const prop of node.properties) {
    if (ts.isPropertyAssignment(prop)) {
      const propName = prop.name.getText();

      if (propertyNames.has(propName)) {
        if (ts.isStringLiteral(prop.initializer)) {
          const value = prop.initializer.text;
          if (looksLikeTranslationKey(value)) {
            keys.push(value);
          }
        }
      }

      if (ts.isObjectLiteralExpression(prop.initializer)) {
        keys.push(
          ...extractFromObjectLiteral(
            prop.initializer,
            propertyNames,
            currentDepth + 1,
            maxDepth,
          ),
        );
      }

      if (ts.isArrayLiteralExpression(prop.initializer)) {
        keys.push(
          ...extractFromArrayLiteral(
            prop.initializer,
            propertyNames,
            currentDepth + 1,
            maxDepth,
          ),
        );
      }
    }
  }

  return keys;
}

/**
 * Check if an array looks like a language selector pattern
 */
function isLanguageSelectorPattern(node: ts.ArrayLiteralExpression): boolean {
  if (node.elements.length < 2) return false;

  const allMatchPattern = node.elements.every((element) => {
    if (!ts.isObjectLiteralExpression(element)) return false;

    let hasValue = false;
    let hasLabel = false;
    let valueIsLanguageCode = false;

    for (const prop of element.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;

      const propName = prop.name.getText();

      if (propName === "value" && ts.isStringLiteral(prop.initializer)) {
        hasValue = true;
        const value = prop.initializer.text;
        valueIsLanguageCode = /^[a-z]{2}(-[a-z]{2,3})?$/i.test(value);
      }

      if (propName === "label") {
        hasLabel = true;
      }
    }

    return hasValue && hasLabel && valueIsLanguageCode;
  });

  return allMatchPattern;
}

/**
 * Extract string literals from array literal expression
 */
function extractFromArrayLiteral(
  node: ts.ArrayLiteralExpression,
  propertyNames: Set<string>,
  currentDepth: number,
  maxDepth: number,
): string[] {
  if (currentDepth > maxDepth) return [];

  if (isLanguageSelectorPattern(node)) return [];

  const keys: string[] = [];

  for (const element of node.elements) {
    if (ts.isObjectLiteralExpression(element)) {
      keys.push(
        ...extractFromObjectLiteral(
          element,
          propertyNames,
          currentDepth + 1,
          maxDepth,
        ),
      );
    }

    if (ts.isArrayLiteralExpression(element)) {
      keys.push(
        ...extractFromArrayLiteral(
          element,
          propertyNames,
          currentDepth + 1,
          maxDepth,
        ),
      );
    }
  }

  return keys;
}

/**
 * Check data structures for translation keys
 */
export function checkDataStructure(
  node: ts.ObjectLiteralExpression | ts.ArrayLiteralExpression,
  ctx: RuleContext,
  config?: DataStructureConfig,
): Issue[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  if (!cfg.enabled) return [];
  if (cfg.requireTranslationScope && !ctx.translationScope) return [];

  const propertyNames = new Set([
    ...DEFAULT_PROPERTY_NAMES,
    ...(cfg.propertyNames || []),
  ]);

  let extractedKeys: string[] = [];
  if (ts.isObjectLiteralExpression(node)) {
    extractedKeys = extractFromObjectLiteral(
      node,
      propertyNames,
      0,
      cfg.maxDepth || 3,
    );
  } else if (ts.isArrayLiteralExpression(node)) {
    extractedKeys = extractFromArrayLiteral(
      node,
      propertyNames,
      0,
      cfg.maxDepth || 3,
    );
  }

  if (extractedKeys.length === 0) return [];

  const issues: Issue[] = [];
  for (const extractedKey of extractedKeys) {
    let key = extractedKey;
    let namespace: string | undefined;
    let bindingType: "bound-scoped" | "root-scoped" | "unknown-scoped" | "unbound" = "unbound";

    // First try: scope-bound namespace
    if (ctx.namespaceMap) {
      for (const binding of Object.values(ctx.namespaceMap)) {
        if (binding.type === "bound-scoped" && binding.namespace) {
          namespace = binding.namespace;
          bindingType = "bound-scoped";
          if (!key.startsWith(`${namespace}.`)) {
            key = `${namespace}.${extractedKey}`;
          }
          break;
        }
      }
    }

    // Second try: file-level namespace inference
    if (!namespace && ctx.fileNamespaces && ctx.fileNamespaces.length > 0) {
      if (ctx.fileNamespaces.length === 1) {
        namespace = ctx.fileNamespaces[0];
        bindingType = "bound-scoped";
        key = `${namespace}.${extractedKey}`;

        if (ctx.verbose) {
          console.log(
            `[VERBOSE] Applied file-level namespace "${namespace}" to data structure key: ${extractedKey}`,
          );
        }
      } else {
        namespace = ctx.fileNamespaces[0];
        bindingType = "unknown-scoped";
        key = `${namespace}.${extractedKey}`;

        if (ctx.verbose) {
          console.log(
            `[VERBOSE] Ambiguous namespace (${ctx.fileNamespaces.length} found in file), using "${namespace}" for: ${extractedKey}`,
          );
        }
      }
    }

    const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());

    issues.push({
      file: ctx.filePath,
      line: pos.line + 1,
      column: pos.character + 1,
      text: extractedKey,
      type: "string-variable",
      severity: "info",
      message: `Translation key in data structure: "${key}"`,
      key,
      bindingType,
      namespace,
    });

    if (ctx.stats && ctx.stats.dataStructureKeys !== undefined) {
      ctx.stats.dataStructureKeys++;
    }
  }

  return issues;
}
