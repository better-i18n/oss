/**
 * Ternary locale detection rule
 *
 * Detects anti-pattern: locale === 'en' ? 'Hello' : 'Merhaba'
 */

import ts from "typescript";
import { generateKeyFromContext, truncate } from "../../utils/text.js";
import type { Issue, RuleContext } from "../../analyzer/types.js";

/**
 * Check conditional expression for locale-based ternary
 */
export function checkTernaryLocale(
  node: ts.ConditionalExpression,
  ctx: RuleContext,
): Issue | null {
  const condition = node.condition;

  // Check for binary expression
  if (!ts.isBinaryExpression(condition)) return null;

  // Check if comparing with locale
  const left = condition.left;
  let isLocaleComparison = false;

  // Direct identifier: locale === 'en'
  if (ts.isIdentifier(left) && left.text === "locale") {
    isLocaleComparison = true;
  }

  // Property access: i18n.locale === 'en' or router.locale === 'en'
  if (ts.isPropertyAccessExpression(left) && left.name.text === "locale") {
    isLocaleComparison = true;
  }

  if (!isLocaleComparison) return null;

  // Check if both branches have string literals
  const hasStringTrue = ts.isStringLiteral(node.whenTrue);
  const hasStringFalse = ts.isStringLiteral(node.whenFalse);

  if (!hasStringTrue && !hasStringFalse) return null;

  // Get text for message
  const text = hasStringTrue
    ? (node.whenTrue as ts.StringLiteral).text
    : (node.whenFalse as ts.StringLiteral).text;

  // Ignore empty strings (common in URL construction: locale === 'en' ? '' : locale + '/')
  if (text.trim() === "") return null;

  const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());

  return {
    file: ctx.filePath,
    line: pos.line + 1,
    column: pos.character + 1,
    text,
    type: "ternary-locale",
    severity: "error", // This is an anti-pattern, so error
    message: `Locale ternary pattern detected: "${truncate(text, 30)}"`,
    suggestedKey: generateKeyFromContext(text, ctx.filePath),
  };
}
