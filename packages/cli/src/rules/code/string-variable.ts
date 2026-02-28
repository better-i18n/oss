/**
 * String variable detection rule
 *
 * Detects hardcoded user-facing strings assigned to variables
 * Uses strict filtering to avoid false positives
 */

import ts from "typescript";
import { generateKeyFromContext, truncate } from "../../utils/text.js";
import type { Issue, RuleContext } from "../../analyzer/types.js";

/**
 * Patterns to IGNORE (not user-facing text)
 */
const IGNORE_PATTERNS = [
  /^[A-Z_][A-Z0-9_]*$/, // SCREAMING_CASE constants
  /^[a-z][a-z0-9]*$/, // Single lowercase word (identifiers)
  /^[a-z-]+$/, // CSS-like (lowercase with hyphens)
  /^[a-z_]+$/, // snake_case identifiers
  /^https?:\/\//, // URLs
  /^\/[\w/.-]+$/, // Paths
  /^\d+(\.\d+)?(px|rem|em|%|vh|vw|ms|s)?$/, // Numbers with units
  /^#[0-9a-fA-F]{3,8}$/, // Hex colors
  /^rgba?\(/, // RGB colors
  /^hsla?\(/, // HSL colors
  /^[\w-]+:[\w-]+$/, // CSS-like property:value
  /^\s*$/, // Whitespace only
  /^[{}[\]()]+$/, // Brackets only
];

/**
 * Variable names that typically hold non-translatable values
 */
const IGNORE_VARIABLE_NAMES = new Set([
  "id",
  "key",
  "type",
  "name",
  "className",
  "class",
  "style",
  "styles",
  "href",
  "src",
  "url",
  "path",
  "route",
  "endpoint",
  "query",
  "params",
  "config",
  "options",
  "settings",
  "env",
  "mode",
  "format",
  "variant",
  "size",
  "color",
  "status",
  "state",
  "icon",
  "target",
  "rel",
  "method",
  "headers",
  "contentType",
  "mimeType",
  "encoding",
  "charset",
  "locale",
  "lang",
  "language",
  "namespace",
  "ns",
  "prefix",
  "suffix",
  "extension",
  "ext",
  "version",
  "v",
]);

/**
 * Check for string variable assignments with hardcoded user-facing text
 */
export function checkStringVariable(
  node: ts.VariableDeclaration,
  ctx: RuleContext,
): Issue | null {
  // Must have an initializer
  if (!node.initializer) return null;

  // Must be a string literal
  if (!ts.isStringLiteral(node.initializer)) return null;

  const text = node.initializer.text;

  // Skip if it doesn't look like user-facing text
  if (!isUserFacingText(text)) return null;

  // Skip if variable name suggests non-translatable content
  if (ts.isIdentifier(node.name)) {
    const varName = node.name.text.toLowerCase();
    if (IGNORE_VARIABLE_NAMES.has(varName)) return null;

    // Skip if variable name ends with common technical suffixes
    if (
      varName.endsWith("id") ||
      varName.endsWith("key") ||
      varName.endsWith("class") ||
      varName.endsWith("style") ||
      varName.endsWith("url") ||
      varName.endsWith("path") ||
      varName.endsWith("type")
    ) {
      return null;
    }
  }

  const pos = ctx.sourceFile.getLineAndCharacterOfPosition(
    node.initializer.getStart(),
  );

  return {
    file: ctx.filePath,
    line: pos.line + 1,
    column: pos.character + 1,
    text,
    type: "string-variable",
    severity: "warning",
    message: `Hardcoded string: "${truncate(text, 40)}"`,
    suggestedKey: generateKeyFromContext(text, ctx.filePath),
  };
}

/**
 * Determine if a string looks like user-facing text
 * - Must be at least 5 characters
 * - Must start with a capital letter OR contain a space
 * - Must not match any ignore patterns
 */
function isUserFacingText(text: string): boolean {
  // Too short
  if (text.length < 5) return false;

  // Check ignore patterns
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.test(text)) return false;
  }

  // Must either:
  // 1. Start with capital letter and have length >= 5, OR
  // 2. Contain at least one space (indicates a phrase)
  const startsWithCapital = /^[A-Z]/.test(text);
  const hasSpace = /\s/.test(text);

  if (!startsWithCapital && !hasSpace) return false;

  // Additional check: if no space, must look like a proper word/title
  if (!hasSpace) {
    const technicalWords = [
      "Primary",
      "Secondary",
      "Default",
      "None",
      "True",
      "False",
      "Null",
      "Undefined",
      "Material",
      "Outlined",
      "Contained",
      "Text",
      "Small",
      "Medium",
      "Large",
      "Left",
      "Right",
      "Center",
      "Top",
      "Bottom",
      "Start",
      "End",
      "Vertical",
      "Horizontal",
      "Enabled",
      "Disabled",
      "Active",
      "Inactive",
      "Loading",
      "Success",
      "Error",
      "Warning",
      "Info",
    ];
    if (technicalWords.includes(text)) return false;
  }

  return true;
}
