/**
 * bulkCreateEntries MCP Tool
 *
 * Create multiple content entries in a single model.
 * Partial success possible — response reports created count and failures.
 */

import { z } from "zod";
import {
  customFieldsSchema,
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const translationValue = z.object({
  title: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  customFields: customFieldsSchema,
});

const inputSchema = projectSchema.extend({
  modelSlug: z.string().min(1),
  entries: z.array(z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    bodyMarkdown: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    customFields: customFieldsSchema,
    translations: z.record(z.string(), translationValue).optional(),
  })).min(1).max(20),
});

export const bulkCreateEntries: Tool = {
  definition: {
    name: "bulkCreateEntries",
    description: `Create multiple content entries in a single model at once (max 20).

ALWAYS prefer this over calling createContentEntry multiple times.
Rule: if you need to create 2 or more entries → use this tool, not a loop of createContentEntry calls.

Partial success is possible — response reports created count and any failures.
Each entry supports the same fields as createContentEntry: title, slug, bodyMarkdown, status, customFields, and translations.

IMPORTANT — bodyMarkdown: Do NOT start with a # H1 heading. The entry title is rendered separately as the page H1. Starting with # Title creates a duplicate visible heading. Begin each body with an introductory paragraph or ## H2 section.

EXAMPLE:
{
  "modelSlug": "blog-posts",
  "entries": [
    {
      "title": "First Post",
      "slug": "first-post",
      "status": "draft",
      "bodyMarkdown": "Opening paragraph here...\n\n## First Section\n..."
    },
    {
      "title": "Second Post",
      "slug": "second-post",
      "customFields": { "category": "tech" }
    }
  ]
}`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Content model slug to create entries in",
        },
        entries: {
          type: "array",
          description: "Entries to create (max 20)",
          items: {
            type: "object",
            properties: {
              title: { type: "string", description: "Entry title" },
              slug: { type: "string", description: "URL slug" },
              bodyMarkdown: { type: "string", description: "Content body in Markdown. WARNING: Do NOT start with a # H1 heading — the title is rendered separately as the page H1. Begin with a paragraph or ## H2 section." },
              status: { type: "string", enum: ["draft", "published"], description: "Initial status (default: draft)" },
              customFields: { type: "object", description: "Custom field values as { fieldName: value }" },
              translations: { type: "object", description: "Target language translations — { langCode: { title, bodyMarkdown, customFields } }" },
            },
            required: ["title", "slug"],
          },
        },
      },
      required: ["project", "modelSlug", "entries"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      // Normalize translation record keys to lowercase for each entry
      const entries = input.entries.map(entry => {
        if (!entry.translations) return entry;
        const normalized: typeof entry.translations = {};
        for (const [lang, value] of Object.entries(entry.translations)) {
          normalized[lang.toLowerCase()] = value;
        }
        return { ...entry, translations: normalized };
      });

      const result = await client.mcpContent.bulkCreateEntries.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        entries,
      } as Parameters<typeof client.mcpContent.bulkCreateEntries.mutate>[0]);

      return success(result);
    }),
};
