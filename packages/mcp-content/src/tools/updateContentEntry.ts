/**
 * updateContentEntry MCP Tool
 *
 * Updates a content entry's translation and/or metadata.
 * Can update translation for any language, entry metadata, and custom field values.
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema.extend({
  entryId: z.string().uuid(),
  languageCode: z.string().min(1),
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
});

export const updateContentEntry: Tool = {
  definition: {
    name: "updateContentEntry",
    description:
      "Update a content entry's translation and/or metadata. Specify the language to update and the fields to change. Each entry updates ONE language for ONE entry.",
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
          description: "Language to update translation for (e.g., 'en', 'tr', 'de')",
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
      },
      required: ["project", "entryId", "languageCode"],
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
      });

      return success({
        updated: true,
        entry: result,
      });
    }),
};
