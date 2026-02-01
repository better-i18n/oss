/**
 * JSX Text detection rule
 *
 * Detects hardcoded text content in JSX elements
 */

import ts from "typescript";
import { generateKeyFromContext, truncate } from "../../utils/text.js";
import type { Issue, RuleContext } from "../types.js";

/**
 * Default patterns to ignore
 */
const IGNORE_PATTERNS = [
  /^[\s\n\r\t]+$/, // Whitespace only
  /^[→←↑↓★•·\-–—/\\|,;:.!?()[\]{}]+$/, // Symbols only
  /^\d+[+%KkMm]?$/, // Numbers with optional suffix
  /^[A-Z_]+$/, // SCREAMING_CASE
  /^https?:\/\//, // URLs
  /^\//, // Paths
  /^[a-z-]+$/, // CSS-like (lowercase with hyphens only)
  /^&[a-z]+;$/, // HTML entities like &quot; &amp; &nbsp;
  /^&#\d+;$/, // Numeric HTML entities like &#39;
];

/**
 * Check JSX text node for hardcoded strings
 */
export function checkJsxText(node: ts.JsxText, ctx: RuleContext): Issue | null {
  const text = node.text.trim();

  // Skip empty or very short
  if (!text || text.length <= 2) return null;

  // Skip ignored patterns
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(text)) return null;
  }

  // Get position
  const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());

  return {
    file: ctx.filePath,
    line: pos.line + 1,
    column: pos.character + 1,
    text,
    type: "jsx-text",
    severity: "warning",
    message: `Hardcoded text: "${truncate(text, 40)}"`,
    suggestedKey: generateKeyFromContext(text, ctx.filePath),
  };
}
