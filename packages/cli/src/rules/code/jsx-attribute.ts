/**
 * JSX Attribute detection rule
 *
 * Detects hardcoded strings in title, alt, placeholder, etc.
 */

import ts from "typescript";
import { generateKeyFromContext, truncate } from "../../utils/text.js";
import type { Issue, RuleContext } from "../../analyzer/types.js";

/**
 * Attributes to check for hardcoded strings
 */
const CHECK_ATTRIBUTES = new Set([
  "title",
  "alt",
  "placeholder",
  "aria-label",
  "label",
]);

/**
 * Attributes to ignore (never flag these)
 */
const IGNORE_ATTRIBUTES = new Set([
  "className",
  "class",
  "id",
  "key",
  "ref",
  "data-testid",
  "href",
  "src",
  "name",
  "type",
  "role",
]);

/**
 * Patterns for non-user-facing attribute values (false positives)
 */
const IGNORE_VALUE_PATTERNS = [
  /^\d+(\.\d+)?(px|rem|em|%|vh|vw|ms|s)?$/, // Numbers with optional decimal/units (41.0082, 100px)
  /^\d{1,2}:\d{2}(:\d{2})?$/, // Time strings (06:25, 12:50:00)
  /^#[0-9a-fA-F]{3,8}$/, // Hex colors
  /^rgba?\(/, // RGB colors
  /^hsla?\(/, // HSL colors
  /^[A-Z_][A-Z0-9_]*$/, // SCREAMING_CASE constants
  /^[a-z][a-z0-9]*$/, // Single lowercase word (identifiers)
  /^[a-z-]+$/, // CSS-like (lowercase with hyphens)
  /^[a-z_]+$/, // snake_case identifiers
];

/**
 * Check JSX attribute for hardcoded strings
 */
export function checkJsxAttribute(
  node: ts.JsxAttribute,
  ctx: RuleContext
): Issue | null {
  const attrName = node.name.getText();

  // Skip ignored attributes
  if (IGNORE_ATTRIBUTES.has(attrName)) return null;

  // Only check specific attributes
  if (!CHECK_ATTRIBUTES.has(attrName)) return null;

  // Get the value
  const value = node.initializer;
  if (!value) return null;

  let text: string | null = null;

  // String literal: title="Hello"
  if (ts.isStringLiteral(value)) {
    text = value.text;
  }

  // JSX expression with string: title={"Hello"}
  if (ts.isJsxExpression(value) && value.expression) {
    if (ts.isStringLiteral(value.expression)) {
      text = value.expression.text;
    }
  }

  // No text found or too short
  if (!text || text.length <= 2) return null;

  // Skip URLs
  if (text.startsWith("http") || text.startsWith("/")) return null;

  // Skip non-user-facing values (numbers, times, colors, identifiers)
  for (const pattern of IGNORE_VALUE_PATTERNS) {
    if (pattern.test(text)) return null;
  }

  const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());

  return {
    file: ctx.filePath,
    line: pos.line + 1,
    column: pos.character + 1,
    text,
    type: "jsx-attribute",
    severity: "warning",
    message: `Hardcoded ${attrName}: "${truncate(text, 40)}"`,
    suggestedKey: generateKeyFromContext(text, ctx.filePath),
  };
}
