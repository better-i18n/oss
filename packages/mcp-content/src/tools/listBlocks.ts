/**
 * listBlocks MCP Tool
 *
 * Browse the registered block catalog for a project with optional filters.
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
  category: z.string().optional(),
  search: z.string().optional(),
});

export const listBlocks: Tool = {
  definition: {
    name: "listBlocks",
    description: `List all registered blocks for a project.

Returns the catalog: slug, displayName, category, description, paramsSchema (JSON Schema for CMS forms + params validation), previewUrl, previewOrigin.

Use this before composing block instances — the returned slugs are the only valid types for block params. Filters:
- category: exact match (e.g. 'cover', 'marketing')
- search: case-insensitive substring in slug/displayName/description`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        category: {
          type: "string",
          description: "Filter by category (exact match)",
        },
        search: {
          type: "string",
          description:
            "Case-insensitive substring match on slug, displayName, or description",
        },
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.listBlocks.query({
        orgSlug: workspaceId,
        projectSlug,
        category: input.category,
        search: input.search,
      });

      return success({ blocks: result.blocks });
    }),
};
