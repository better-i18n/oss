/**
 * updateContentEntry MCP Tool
 *
 * Updates a content entry's translation and/or metadata.
 * Supports single-language or multi-language updates in one request.
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
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  customFields: z.record(z.string(), z.string().nullable()).optional(),
});

const inputSchema = projectSchema.extend({
  entryId: z.string().uuid(),
  languageCode: z.string().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  customFields: z.record(z.string(), z.string().nullable()).optional(),
  translations: z.record(z.string(), translationValue).optional(),
});

export const updateContentEntry: Tool = {
  definition: {
    name: "updateContentEntry",
    description: `Update a content entry's translation and/or metadata.

Three modes:
1. Single language: provide languageCode + top-level fields (title, bodyMarkdown, etc.)
2. Multi-language: provide translations map — { langCode: { title, bodyMarkdown, ... } }
3. Metadata-only: omit both languageCode and translations to update only metadata (slug, status, customFields)

Modes 1 & 2 can be combined. All fields are optional — send only what changed.

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
          description: "Updated URL slug",
        },
        excerpt: {
          type: "string",
          description: "Updated excerpt",
        },
        bodyMarkdown: {
          type: "string",
          description: "Updated content body in Markdown format (supports GFM: tables, strikethrough, task lists)",
        },
        metaTitle: {
          type: "string",
          description: "SEO meta title",
        },
        metaDescription: {
          type: "string",
          description: "SEO meta description",
        },
        featuredImage: {
          type: "string",
          description: "Updated featured image URL",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Updated tags",
        },
        status: {
          type: "string",
          enum: ["draft", "published", "archived"],
          description: "Updated entry status",
        },
        customFields: {
          type: "object",
          description: "Updated custom field values",
        },
        translations: {
          type: "object",
          description: "Multiple language translations — { langCode: { title, bodyMarkdown, excerpt, metaTitle, metaDescription, customFields } }",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.updateContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
        languageCode: input.languageCode,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        bodyMarkdown: input.bodyMarkdown,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        featuredImage: input.featuredImage,
        tags: input.tags,
        status: input.status,
        customFields: input.customFields,
        translations: input.translations,
      });

      return success({
        updated: true,
        entry: result,
      });
    }),
};
