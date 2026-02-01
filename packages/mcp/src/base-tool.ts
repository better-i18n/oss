/**
 * Base Tool Utilities
 *
 * Common patterns and helpers for MCP tools.
 * All tools work with project-scoped operations.
 */

import { z } from "zod";
import { parseProject, type ParsedProject } from "./helpers.js";
import type { ToolResult } from "./types/index.js";

/**
 * Common project schema - all tools require this
 */
export const projectSchema = z.object({
  project: z.string().min(1),
});

/**
 * Project field definition for tool inputSchema
 */
export const projectInputProperty = {
  project: {
    type: "string" as const,
    description:
      "Project identifier in 'org/project' format (e.g., 'aliosman-co/personal'). Get this from the project's i18n.ts config file.",
  },
};

/**
 * Creates a successful tool result
 */
export function success(data: object): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Creates an error tool result
 */
export function error(message: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
    isError: true,
  };
}

/**
 * Wraps tool execution with common error handling for project-scoped tools
 */
export async function executeTool<T extends { project: string }>(
  args: unknown,
  schema: z.ZodType<T>,
  handler: (input: T, parsed: ParsedProject) => Promise<ToolResult>
): Promise<ToolResult> {
  try {
    const input = schema.parse(args);
    const parsed = parseProject(input.project);
    return await handler(input, parsed);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(`Validation error: ${err.errors.map(e => e.message).join(", ")}`);
    }
    return error(err instanceof Error ? err.message : String(err));
  }
}

/**
 * Wraps tool execution with common error handling for non-project tools
 */
export async function executeSimpleTool<T>(
  args: unknown,
  schema: z.ZodType<T>,
  handler: (input: T) => Promise<ToolResult>
): Promise<ToolResult> {
  try {
    const input = schema.parse(args);
    return await handler(input);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(`Validation error: ${err.errors.map(e => e.message).join(", ")}`);
    }
    return error(err instanceof Error ? err.message : String(err));
  }
}
