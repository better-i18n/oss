/**
 * Translation function detection rule
 *
 * Detects t() function calls to extract translation keys used in code
 */

import ts from "typescript";
import type { Issue, RuleContext } from "../types.js";

/**
 * Translation function names to detect
 */
const TRANSLATION_FUNCTIONS = new Set(["t", "useTranslation"]);

/**
 * Check if identifier looks like a translator variable
 * Common patterns: t, tUser, tAuth, tCommon, etc.
 */
function looksLikeTranslator(name: string): boolean {
  // Single 't' or starts with 't' followed by uppercase (tUser, tAuth, etc.)
  return name === "t" || /^t[A-Z]/.test(name);
}

/**
 * Check for translation function calls
 */
export function checkTranslationFunction(
  node: ts.CallExpression,
  ctx: RuleContext,
): Issue | null {
  const bindingId = getBindingIdentifier(node);
  if (!bindingId) return null;

  // Check if this identifier is bound to a translation namespace
  // Use let instead of const so we can create a synthetic binding if pattern matches
  let binding = ctx.namespaceMap?.[bindingId];

  // If not bound and not a known global/default translation function, check if it looks like a translator

  if (!binding && !TRANSLATION_FUNCTIONS.has(bindingId)) {
    // Fallback: if it looks like a translator variable (tUser, tAuth, etc.), assume it's valid
    // This helps catch cases where binding detection failed but the pattern is clear
    if (looksLikeTranslator(bindingId)) {
      if (ctx.verbose) {
        const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(
          `[VERBOSE] Accepting translator by pattern: ${bindingId} at ${ctx.filePath}:${pos.line + 1}`,
        );
      }
      // Create a synthetic "unknown-scoped" binding for this translator
      // We don't know the namespace, so mark it as unknown-scoped for fuzzy matching later
      binding = { type: "unknown-scoped", dynamic: false };
    } else {
      if (ctx.stats) ctx.stats.unboundTranslators++;

      // Log unbound translator in verbose mode for debugging
      if (ctx.verbose) {
        const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(
          `[VERBOSE] Unbound translator (not a recognized pattern): ${bindingId} at ${ctx.filePath}:${pos.line + 1}`,
        );
      }

      return null;
    }
  }

  // Get the first argument (translation key)
  const args = node.arguments;
  if (args.length === 0) return null;
  const firstArg = args[0];

  // Handle string literal: t("auth.login")
  if (ts.isStringLiteral(firstArg)) {
    const pos = ctx.sourceFile.getLineAndCharacterOfPosition(
      firstArg.getStart(),
    );

    let key = firstArg.text;

    // Apply namespace prefix if bound to a specific namespace
    if (binding?.type === "bound-scoped" && binding.namespace) {
      const prefix = binding.namespace;
      if (!key.startsWith(`${prefix}.`)) {
        key = `${prefix}.${key}`;
      }
    }

    return {
      file: ctx.filePath,
      line: pos.line + 1,
      column: pos.character + 1,
      text: firstArg.text,
      type: "string-variable",
      severity: "info",
      message: `Translation key: "${key}"`,
      key,
      bindingType: binding?.type || "unbound",
      namespace: binding?.namespace,
    };
  }

  // Handle template literal: t(`plans.${planKey}.name`)
  if (ts.isTemplateExpression(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
    const pattern = extractTemplatePattern(firstArg);
    const pos = ctx.sourceFile.getLineAndCharacterOfPosition(
      firstArg.getStart(),
    );

    // Apply namespace prefix if bound
    let fullPattern = pattern;
    if (binding?.type === "bound-scoped" && binding.namespace) {
      const prefix = binding.namespace;
      if (!pattern.startsWith(`${prefix}.`)) {
        fullPattern = `${prefix}.${pattern}`;
      }
    }

    if (ctx.stats) ctx.stats.dynamicKeys++;

    return {
      file: ctx.filePath,
      line: pos.line + 1,
      column: pos.character + 1,
      text: pattern,
      type: "string-variable",
      severity: "info",
      message: `Dynamic translation key pattern: "${fullPattern}"`,
      key: fullPattern, // Store the pattern as the key for now
      pattern: fullPattern,
      isDynamic: true,
      bindingType: binding?.type || "unbound",
      namespace: binding?.namespace,
    };
  }

  // Other dynamic keys (computed, variables, etc.)
  if (ctx.stats) ctx.stats.dynamicKeys++;
  return null;
}

/**
 * Extract pattern from template literal
 * Examples:
 *   `plans.${planKey}.name` -> 'plans.${planKey}.name'
 *   `${namespace}.title` -> '${namespace}.title'
 */
function extractTemplatePattern(node: ts.TemplateLiteral): string {
  // NoSubstitutionTemplateLiteral is just a plain string (no ${})
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  // TemplateExpression has head, templateSpans
  if (!ts.isTemplateExpression(node)) {
    return "";
  }

  let pattern = node.head.text;

  for (const span of node.templateSpans) {
    // Add placeholder for the expression
    const expr = span.expression;
    let placeholder = "${x}"; // Generic placeholder

    // Try to use the actual variable name if it's an identifier
    if (ts.isIdentifier(expr)) {
      placeholder = `\${${expr.text}}`;
    } else if (ts.isPropertyAccessExpression(expr)) {
      // Handle cases like ${item.key}
      placeholder = `\${${expr.getText()}}`;
    }

    pattern += placeholder + span.literal.text;
  }

  return pattern;
}

/**
 * Extract the binding identifier from a call expression.
 * Handles: t(), t.raw(), t.rich(), t.has()
 */
function getBindingIdentifier(node: ts.CallExpression): string | null {
  const expr = node.expression;

  // Simple identifier: t()
  if (ts.isIdentifier(expr)) {
    return expr.text;
  }

  // Property access: t.raw(), t.rich(), t.has()
  if (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression)
  ) {
    const propName = expr.name.text;
    if (["raw", "rich", "has"].includes(propName)) {
      return expr.expression.text;
    }
  }

  return null;
}
