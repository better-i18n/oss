/**
 * Base Tool Utilities
 *
 * Common patterns and helpers for MCP tools.
 * All tools work with project-scoped operations.
 */

import { z } from "zod";
import { parseProject, type ParsedProject } from "./helpers.js";
import type { ToolResult } from "./types/index.js";

/** Custom field values — accepts any JSON-serializable value per field */
export const customFieldsSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return val; }
    }
    return val;
  },
  z.record(z.string(), z.unknown())
).optional();

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
 * Detects bodyMarkdown fields starting with # H1 headings (common AI agent mistake).
 * Returns a warning string if found, or undefined if clean.
 *
 * Checks top-level bodyMarkdown and all translations.{lang}.bodyMarkdown.
 */
export function detectH1InBody(input: {
  bodyMarkdown?: string;
  translations?: Record<string, { bodyMarkdown?: string }>;
  entries?: Array<{
    bodyMarkdown?: string;
    translations?: Record<string, { bodyMarkdown?: string }>;
  }>;
}): string | undefined {
  const offenders: string[] = [];
  const h1Re = /^\s*#\s+/;

  const check = (md: string | undefined, label: string) => {
    if (md && h1Re.test(md)) offenders.push(label);
  };

  check(input.bodyMarkdown, "bodyMarkdown");
  if (input.translations) {
    for (const [lang, t] of Object.entries(input.translations)) {
      check(t.bodyMarkdown, `translations.${lang}.bodyMarkdown`);
    }
  }
  if (input.entries) {
    for (let i = 0; i < input.entries.length; i++) {
      const entry = input.entries[i];
      check(entry.bodyMarkdown, `entries[${i}].bodyMarkdown`);
      if (entry.translations) {
        for (const [lang, t] of Object.entries(entry.translations)) {
          check(t.bodyMarkdown, `entries[${i}].translations.${lang}.bodyMarkdown`);
        }
      }
    }
  }

  if (offenders.length === 0) return undefined;
  return `Body starts with # H1 heading in: ${offenders.join(", ")}. The entry title is already rendered as the page H1 — starting body with # Title creates a duplicate heading. Remove the # H1 line and begin with a paragraph or ## H2 section.`;
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
