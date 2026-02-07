/**
 * createContentEntry MCP Tool
 *
 * Creates a new content entry with source language translation.
 * The entry is created atomically with its source translation and custom field values.
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
  modelSlug: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  featuredImage: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  customFields: z.record(z.string(), z.string().nullable()).optional(),
});

export const createContentEntry: Tool = {
  definition: {
    name: "createContentEntry",
    description:
      "Create a new content entry with source language translation. Provide the model slug, title, slug, and optional body/excerpt/tags.",
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
          description: "Entry title (source language)",
        },
        slug: {
          type: "string",
          description: "URL slug for the entry",
        },
        excerpt: {
          type: "string",
          description: "Short excerpt or summary",
        },
        bodyMarkdown: {
          type: "string",
          description: "Content body in Markdown format (supports GFM: tables, strikethrough, task lists)",
        },
        featuredImage: {
          type: "string",
          description: "Featured image URL",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags for categorization",
        },
        status: {
          type: "string",
          enum: ["draft", "published"],
          description: "Initial entry status (default: draft)",
        },
        customFields: {
          type: "object",
          description: "Custom field values as { fieldName: value }",
        },
      },
      required: ["project", "modelSlug", "title", "slug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.createContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        bodyMarkdown: input.bodyMarkdown,
        featuredImage: input.featuredImage,
        tags: input.tags,
        status: input.status,
        customFields: input.customFields,
      });

      return success({
        created: true,
        entry: result,
      });
    }),
};
