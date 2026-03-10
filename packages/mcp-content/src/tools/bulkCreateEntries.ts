/**
 * bulkCreateEntries MCP Tool
 *
 * Create multiple content entries in a single model.
 * Partial success possible — response reports created count and failures.
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const translationValue = z.object({
  title: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  customFields: z.record(z.string(), z.union([
    z.string(),
    z.number().transform(String),
    z.boolean().transform(String),
  ]).nullable()).optional(),
});

const coercibleFieldValue = z.union([
  z.string(),
  z.number().transform(String),
  z.boolean().transform(String),
]).nullable();

const inputSchema = projectSchema.extend({
  modelSlug: z.string().min(1),
  entries: z.array(z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    bodyMarkdown: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    customFields: z.record(z.string(), coercibleFieldValue).optional().default({}),
    translations: z.record(z.string(), translationValue).optional(),
  })).min(1).max(20),
});

export const bulkCreateEntries: Tool = {
  definition: {
    name: "bulkCreateEntries",
    description: `Create multiple content entries in a single model at once (max 20).
Partial success is possible — response reports created count and any failures.

Each entry supports the same fields as createContentEntry: title, slug, bodyMarkdown, status, customFields, and translations.

EXAMPLE:
{
  "modelSlug": "blog-posts",
  "entries": [
    { "title": "First Post", "slug": "first-post", "status": "draft" },
    { "title": "Second Post", "slug": "second-post", "customFields": { "category": "tech" } }
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
              bodyMarkdown: { type: "string", description: "Content body in Markdown" },
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
      });

      return success(result);
    }),
};
