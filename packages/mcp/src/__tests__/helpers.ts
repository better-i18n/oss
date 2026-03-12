import type { ToolResult } from "../types/index.js";

/** Extract and parse JSON from a ToolResult's text content */
export function parseToolResult(result: ToolResult): unknown {
  const text = result.content.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("No text content in result");
  return JSON.parse(text);
}

/** Check if a ToolResult is an error */
export function isErrorResult(result: ToolResult): boolean {
  return result.isError === true;
}

/** Assert that result is successful and return parsed JSON */
export function expectSuccess(result: ToolResult): unknown {
  if (isErrorResult(result)) {
    const text = result.content.find((c) => c.type === "text")?.text;
    throw new Error(`Expected success but got error: ${text}`);
  }
  return parseToolResult(result);
}

/** Assert that result is an error and return the message */
export function expectError(result: ToolResult): string {
  if (!isErrorResult(result)) {
    throw new Error("Expected error but got success");
  }
  return result.content.find((c) => c.type === "text")?.text ?? "";
}
