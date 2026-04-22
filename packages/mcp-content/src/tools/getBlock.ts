/**
 * getBlock MCP Tool
 *
 * Fetch a single block's full detail including its params JSON Schema.
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
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z][a-z0-9-]*$/),
});

export const getBlock: Tool = {
  definition: {
    name: "getBlock",
    description: `Fetch a single block's full detail by slug.

Returns: displayName, category, description, paramsSchema (JSON Schema for params), previewUrl, previewOrigin, sourceCommit, registeredAt, updatedAt.

Use before composing block params — the paramsSchema tells you exactly which fields are required and their types/enums.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        slug: {
          type: "string",
          description: "Block slug (e.g. 'cover-gradient')",
        },
      },
      required: ["project", "slug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.getBlock.query({
        orgSlug: workspaceId,
        projectSlug,
        slug: input.slug,
      });

      return success(result);
    }),
};
