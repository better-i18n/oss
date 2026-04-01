/**
 * createContentEntry MCP Tool
 *
 * Creates a new content entry with source language translation.
 * The entry is created atomically with its source translation and custom field values.
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
  title: z.string(),
  bodyMarkdown: z.string().optional(),
  customFields: customFieldsSchema,
});

const inputSchema = projectSchema.extend({
  modelSlug: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  bodyMarkdown: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  customFields: customFieldsSchema,
  translations: z.record(z.string(), translationValue).optional(),
});

export const createContentEntry: Tool = {
  definition: {
    name: "createContentEntry",
    description: `Create a new content entry with source language translation.
Top-level title/bodyMarkdown and customFields are stored as the project's SOURCE LANGUAGE text.
Check getProject response's 'sl' field to know which language to write.

WHEN TO USE THIS vs. bulkCreateEntries:
- Creating 1 entry → use this tool
- Creating 2+ entries → use bulkCreateEntries instead (single API call, up to 20 entries at once)
Never call this tool in a loop — always batch with bulkCreateEntries.

IMPORTANT: Source language may not be English. If sl='tr', write Turkish for title/customFields.

⚠️ MULTI-LANGUAGE EFFICIENCY — If you need this entry in multiple languages, pass ALL translations in THIS call via the translations map. Do NOT create the entry first, then call updateContentEntry separately for each language — that wastes N extra API calls.

⚠️ LOCALIZED CUSTOM FIELDS — Custom fields with localized=true must be set per-language via translations.{lang}.customFields. Setting them at top-level customFields only applies to the source language.

Translation language codes are normalized to lowercase automatically (e.g., "EN" → "en").

STATUS:
- status controls the entry's publish state (default: "draft")
- All translations saved via this tool are set to "published" status by default (save = publish for content workflow)

EXAMPLE (project sl='tr', with localized custom field):
{
  "title": "Merhaba Dünya",
  "slug": "merhaba-dunya",
  "customFields": { "subtitle": "Alt başlık" },
  "translations": {
    "en": {
      "title": "Hello World",
      "customFields": { "subtitle": "Subtitle", "localized_slug": "hello-world" }
    },
    "id": {
      "title": "Halo Dunia",
      "customFields": { "subtitle": "Subjudul", "localized_slug": "halo-dunia" }
    }
  }
}`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Content model slug to create entry in (e.g., 'blog-posts')",
        },
        title: {
          type: "string",
          description: "Entry title in the project's source language (check getProject 'sl' field)",
        },
        slug: {
          type: "string",
          description: "URL slug for the entry — this is the UNIVERSAL identifier shared across all languages (used in the CMS, not language-specific). For per-language URL slugs, use a localized custom field (e.g., 'localized_slug' with localized=true) and set it via translations.{lang}.customFields.",
        },
        bodyMarkdown: {
          type: "string",
          description: "Content body in Markdown format (supports GFM: tables, strikethrough, task lists). WARNING: Do NOT start with a # H1 heading — the entry title is already rendered as the page H1 by the platform. Starting with # Title creates a duplicate visible heading. Begin with an introductory paragraph or ## H2 section instead.",
        },
        status: {
          type: "string",
          enum: ["draft", "published"],
          description: "Initial entry status (default: draft)",
        },
        customFields: {
          type: "object",
          description: "Custom field values in the project's source language. Use translations map for other languages. For relation fields, pass the related entry ID. For media fields, pass the URL. For enum fields, pass one of the allowed values. For user fields (relation with targetModel='users'), pass the member ID from listContentEntries({ modelSlug: 'users' }).",
        },
        translations: {
          type: "object",
          description: "Target language translations — { langCode: { title, bodyMarkdown, customFields } }",
        },
      },
      required: ["project", "modelSlug", "title", "slug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const { project: _, ...data } = input;

      // Normalize translation record keys to lowercase (z.record keys can't use .transform)
      if (data.translations) {
        const normalized: typeof data.translations = {};
        for (const [lang, value] of Object.entries(data.translations)) {
          normalized[lang.toLowerCase()] = value;
        }
        data.translations = normalized;
      }

      const result = await client.mcpContent.createContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        ...data,
      } as Parameters<typeof client.mcpContent.createContentEntry.mutate>[0]);

      return success({
        created: true,
        entry: result,
      });
    }),
};
