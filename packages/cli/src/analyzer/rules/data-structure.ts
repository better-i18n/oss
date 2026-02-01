/**
 * Data structure detection rule
 *
 * Detects translation keys stored in data structures (arrays, objects)
 * Uses property name heuristics to identify translation-relevant strings
 */

import ts from "typescript";
import type { DataStructureConfig, Issue, RuleContext } from "../types.js";

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
  // Too short (likely not meaningful)
  if (value.length < 2) return false;

  // URLs
  if (value.startsWith("http://") || value.startsWith("https://")) return false;

  // File paths
  if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) return false;

  // CSS classes (common patterns)
  if (value.includes(" ") && (value.includes("-") || value.includes("_"))) {
    // Likely CSS like "flex items-center gap-2"
    return false;
  }

  // Data URLs
  if (value.startsWith("data:")) return false;

  // RGB/Hex colors
  if (/^#[0-9a-fA-F]{3,8}$/.test(value) || /^rgb\(/.test(value)) return false;

  // Numbers only
  if (/^\d+$/.test(value)) return false;

  // Single special characters
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
  if (currentDepth > maxDepth) {
    // console.log(`[DEBUG] Stopping at depth ${currentDepth} (maxDepth: ${maxDepth})`);
    return [];
  }

  const keys: string[] = [];

  for (const prop of node.properties) {
    // Handle property assignments: { message: "translationKey" }
    if (ts.isPropertyAssignment(prop)) {
      const propName = prop.name.getText();
      // console.log(`[DEBUG depth=${currentDepth}] Property: ${propName}, isArray: ${ts.isArrayLiteralExpression(prop.initializer)}`);

      // Check if property name matches our heuristics
      if (propertyNames.has(propName)) {
        // Extract string literal value
        if (ts.isStringLiteral(prop.initializer)) {
          const value = prop.initializer.text;
          if (looksLikeTranslationKey(value)) {
            // console.log(`[DEBUG depth=${currentDepth}] Found key: ${value}`);
            keys.push(value);
          }
        }
      }

      // Recursively check nested objects
      if (ts.isObjectLiteralExpression(prop.initializer)) {
        const nestedKeys = extractFromObjectLiteral(
          prop.initializer,
          propertyNames,
          currentDepth + 1,
          maxDepth,
        );
        // console.log(`[DEBUG depth=${currentDepth}] Nested object returned ${nestedKeys.length} keys`);
        keys.push(...nestedKeys);
      }

      // Recursively check nested arrays
      if (ts.isArrayLiteralExpression(prop.initializer)) {
        // console.log(`[DEBUG depth=${currentDepth}] Processing nested array for prop: ${propName}`);
        const nestedKeys = extractFromArrayLiteral(
          prop.initializer,
          propertyNames,
          currentDepth + 1,
          maxDepth,
        );
        // console.log(`[DEBUG depth=${currentDepth}] Nested array returned ${nestedKeys.length} keys`);
        keys.push(...nestedKeys);
      }
    }

    // Handle shorthand properties: { message } (less common for translation keys)
    // Skip for now as these are references, not literals
  }

  return keys;
}

/**
 * Check if an array looks like a language selector pattern
 * Examples: [{ value: "en", label: "English" }, { value: "tr", label: "Türkçe" }]
 */
function isLanguageSelectorPattern(node: ts.ArrayLiteralExpression): boolean {
  // Need at least 2 elements to be a selector
  if (node.elements.length < 2) return false;

  // Check if all elements are object literals with value + label properties
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
        // Check if value looks like ISO language code (2-5 lowercase letters, optionally with dash)
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
  if (currentDepth > maxDepth) {
    // console.log(`[DEBUG ARRAY] Stopping at depth ${currentDepth} (maxDepth: ${maxDepth})`);
    return [];
  }

  // Skip language selector patterns (native language names should not be translated)
  if (isLanguageSelectorPattern(node)) {
    return [];
  }

  // console.log(`[DEBUG ARRAY depth=${currentDepth}] Processing array with ${node.elements.length} elements`);
  const keys: string[] = [];

  for (const element of node.elements) {
    // console.log(`[DEBUG ARRAY depth=${currentDepth}] Element is object: ${ts.isObjectLiteralExpression(element)}, is array: ${ts.isArrayLiteralExpression(element)}`);

    // Handle object literals in arrays: [{ message: "key1" }, { message: "key2" }]
    if (ts.isObjectLiteralExpression(element)) {
      const nestedKeys = extractFromObjectLiteral(
        element,
        propertyNames,
        currentDepth + 1,
        maxDepth,
      );
      // console.log(`[DEBUG ARRAY depth=${currentDepth}] Object element returned ${nestedKeys.length} keys`);
      keys.push(...nestedKeys);
    }

    // Handle nested arrays
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

  // console.log(`[DEBUG ARRAY depth=${currentDepth}] Total keys from array: ${keys.length}`);
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

  // Feature disabled
  if (!cfg.enabled) return [];

  // Require translation scope and not in one
  if (cfg.requireTranslationScope && !ctx.translationScope) return [];

  // Build property names set
  const propertyNames = new Set([
    ...DEFAULT_PROPERTY_NAMES,
    ...(cfg.propertyNames || []),
  ]);

  // Extract keys based on node type
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

  // No keys found
  if (extractedKeys.length === 0) return [];

  // Get current namespace binding from context
  const issues: Issue[] = [];
  for (const extractedKey of extractedKeys) {
    // Try to apply namespace from current scope
    let key = extractedKey;
    let namespace: string | undefined;
    let bindingType: "bound-scoped" | "root-scoped" | "unknown-scoped" | "unbound" = "unbound";

    // First try: scope-bound namespace (existing logic)
    if (ctx.namespaceMap) {
      for (const binding of Object.values(ctx.namespaceMap)) {
        if (binding.type === "bound-scoped" && binding.namespace) {
          namespace = binding.namespace;
          bindingType = "bound-scoped";
          // Apply namespace prefix
          if (!key.startsWith(`${namespace}.`)) {
            key = `${namespace}.${extractedKey}`;
          }
          break;
        }
      }
    }

    // Second try: file-level namespace inference (NEW)
    if (!namespace && ctx.fileNamespaces && ctx.fileNamespaces.length > 0) {
      if (ctx.fileNamespaces.length === 1) {
        // Single namespace in file - safe to apply
        namespace = ctx.fileNamespaces[0];
        bindingType = "bound-scoped";
        key = `${namespace}.${extractedKey}`;

        if (ctx.verbose) {
          console.log(
            `[VERBOSE] Applied file-level namespace "${namespace}" to data structure key: ${extractedKey}`
          );
        }
      } else {
        // Multiple namespaces - ambiguous, use first one but mark as unknown-scoped
        namespace = ctx.fileNamespaces[0];
        bindingType = "unknown-scoped";
        key = `${namespace}.${extractedKey}`;

        if (ctx.verbose) {
          console.log(
            `[VERBOSE] Ambiguous namespace (${ctx.fileNamespaces.length} found in file), using "${namespace}" for: ${extractedKey}`
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

    // Track stats
    if (ctx.stats && ctx.stats.dataStructureKeys !== undefined) {
      ctx.stats.dataStructureKeys++;
    }
  }

  return issues;
}
