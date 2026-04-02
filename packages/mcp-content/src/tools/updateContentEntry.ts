/**
 * updateContentEntry MCP Tool
 *
 * Updates a content entry's translation and/or metadata.
 * Supports single-language or multi-language updates in one request.
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
  excerpt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  customFields: customFieldsSchema,
});

const inputSchema = projectSchema.extend({
  entryId: z.string().uuid(),
  languageCode: z.string().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  translationStatus: z.enum(["draft", "published"]).optional(),
  customFields: customFieldsSchema,
  translations: z.record(z.string(), translationValue).optional(),
});

export const updateContentEntry: Tool = {
  definition: {
    name: "updateContentEntry",
    description: `Update a content entry's translation and/or metadata.

WHEN TO USE THIS vs. bulkUpdateEntries:
- Updating 1 entry → use this tool
- Updating 2+ entries → use bulkUpdateEntries instead (single API call, up to 20 entries at once)
Never call this tool in a loop — always batch with bulkUpdateEntries.

Three modes:
1. Single language: provide languageCode + top-level fields (title, bodyMarkdown, etc.)
2. Multi-language: provide translations map — { langCode: { title, bodyMarkdown, ... } }
3. Metadata-only: omit both languageCode and translations to update only metadata (slug, status, customFields).

⚠️ LOCALIZED CUSTOM FIELDS — If a field has localized=true, setting it via top-level customFields (mode 3) only updates the SOURCE LANGUAGE value. To update a localized field for a specific language, you MUST use mode 1 or 2.

WRONG (sets localized field only for source language):
{ "entryId": "...", "customFields": { "localized_slug": "my-slug" } }

CORRECT — single language (mode 1):
{ "entryId": "...", "languageCode": "en", "customFields": { "localized_slug": "my-slug-en" } }

CORRECT — multiple languages at once (mode 2):
{ "entryId": "...", "translations": {
  "en": { "customFields": { "localized_slug": "my-slug-en" } },
  "id": { "customFields": { "localized_slug": "my-slug-id" } }
} }

Modes 1 & 2 can be combined. All fields are optional — send only what changed.
Language codes (languageCode and translation keys) are normalized to lowercase automatically (e.g., "EN" → "en").

EXAMPLE multi-language:
{
  "entryId": "...",
  "translations": {
    "tr": { "title": "Merhaba Dünya", "bodyMarkdown": "# Merhaba" },
    "de": { "title": "Hallo Welt" }
  }
}

EXAMPLE metadata-only:
{
  "entryId": "...",
  "status": "published",
  "slug": "new-slug"
}`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID",
        },
        languageCode: {
          type: "string",
          description: "Language to update translation for (single-language mode)",
        },
        title: {
          type: "string",
          description: "Updated title",
        },
        slug: {
          type: "string",
          description: "Updated URL slug — UNIVERSAL identifier shared across all languages. For per-language URL slugs, use a localized custom field via translations.{lang}.customFields instead.",
        },
        bodyMarkdown: {
          type: "string",
          description: "Updated content body in Markdown format (supports GFM: tables, strikethrough, task lists). WARNING: Do NOT start with a # H1 heading — the entry title is already rendered as the page H1 by the platform. Starting with # Title creates a duplicate visible heading. Begin with an introductory paragraph or ## H2 section instead.",
        },
        excerpt: {
          type: "string",
          description: "Updated excerpt",
        },
        featuredImage: {
          type: "string",
          description: "Updated featured image URL",
        },
        metaTitle: {
          type: "string",
          description: "SEO meta title",
        },
        metaDescription: {
          type: "string",
          description: "SEO meta description",
        },
        status: {
          type: "string",
          enum: ["draft", "published", "archived"],
          description: "Updated entry status",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Updated tags",
        },
        translationStatus: {
          type: "string",
          enum: ["draft", "published"],
          description: "Translation status override. Default: \"published\" (save = publish). Set to \"draft\" to save a translation without publishing it immediately.",
        },
        customFields: {
          type: "object",
          description: "Updated custom field values. Localized fields (loc=true) in metadata-only mode update source language; use languageCode or translations for other languages.",
        },
        translations: {
          type: "object",
          description: "Multiple language translations — { langCode: { title, bodyMarkdown, customFields } }",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const { project: _, ...data } = input;

      // Normalize languageCode to lowercase
      if (data.languageCode) {
        data.languageCode = data.languageCode.toLowerCase();
      }

      // Normalize translation record keys to lowercase (z.record keys can't use .transform)
      if (data.translations) {
        const normalized: typeof data.translations = {};
        for (const [lang, value] of Object.entries(data.translations)) {
          normalized[lang.toLowerCase()] = value;
        }
        data.translations = normalized;
      }

      const result = await client.mcpContent.updateContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        ...data,
      } as Parameters<typeof client.mcpContent.updateContentEntry.mutate>[0]);

      return success({
        updated: true,
        entry: result,
      });
    }),
};
