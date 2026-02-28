/**
 * Toast message detection rule
 *
 * Detects hardcoded strings in toast function calls
 * Works with: react-hot-toast, sonner, react-toastify
 */

import ts from "typescript";
import { generateKeyFromContext, truncate } from "../../utils/text.js";
import type { Issue, RuleContext } from "../../analyzer/types.js";

/**
 * Toast function names to detect
 */
const TOAST_FUNCTIONS = new Set([
  "toast",
  "success",
  "error",
  "warning",
  "info",
  "loading",
]);

/**
 * Toast method names (for toast.error(), toast.success(), etc.)
 */
const TOAST_METHODS = new Set([
  "success",
  "error",
  "warning",
  "info",
  "loading",
  "promise",
  "custom",
]);

/**
 * Check for toast function calls with hardcoded strings
 */
export function checkToastMessage(
  node: ts.CallExpression,
  ctx: RuleContext,
): Issue | null {
  const funcName = getToastFunctionName(node);
  if (!funcName) return null;

  // Get the first argument
  const args = node.arguments;
  if (args.length === 0) return null;
  const firstArg = args[0];

  // Handle string literal: toast("Hello")
  if (ts.isStringLiteral(firstArg)) {
    return createIssue(firstArg, firstArg.text, ctx);
  }

  // Handle template literal: toast(`Hello`)
  if (ts.isNoSubstitutionTemplateLiteral(firstArg)) {
    return createIssue(firstArg, firstArg.text, ctx);
  }

  return null;
}

/**
 * Get toast function name from call expression
 * Handles: toast(), toast.error(), toast.success(), etc.
 */
function getToastFunctionName(node: ts.CallExpression): string | null {
  const expr = node.expression;

  // Simple call: toast("message")
  if (ts.isIdentifier(expr)) {
    const name = expr.text;
    if (name === "toast" || TOAST_FUNCTIONS.has(name)) {
      return name;
    }
    return null;
  }

  // Method call: toast.error("message"), toast.success("message")
  if (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression)
  ) {
    const objName = expr.expression.text;
    const methodName = expr.name.text;

    if (objName === "toast" && TOAST_METHODS.has(methodName)) {
      return `toast.${methodName}`;
    }
  }

  return null;
}

/**
 * Create an issue for a detected hardcoded toast message
 */
function createIssue(
  node: ts.Node,
  text: string,
  ctx: RuleContext,
): Issue | null {
  // Skip very short strings
  if (!text || text.length <= 2) return null;

  // Skip strings that look like technical identifiers
  if (/^[a-z_]+$/.test(text)) return null;

  const pos = ctx.sourceFile.getLineAndCharacterOfPosition(node.getStart());

  return {
    file: ctx.filePath,
    line: pos.line + 1,
    column: pos.character + 1,
    text,
    type: "toast-message",
    severity: "warning",
    message: `Hardcoded toast: "${truncate(text, 40)}"`,
    suggestedKey: generateKeyFromContext(text, ctx.filePath),
  };
}
