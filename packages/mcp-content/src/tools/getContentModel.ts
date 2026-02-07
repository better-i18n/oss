/**
 * getContentModel MCP Tool
 *
 * Gets a single content model by slug with its full field definitions.
 * Use this to understand the model structure before creating or updating entries.
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
});

export const getContentModel: Tool = {
  definition: {
    name: "getContentModel",
    description:
      "Get a content model by slug with full field definitions. Use this to understand the model structure (fields, types, requirements) before creating entries.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Content model slug (e.g., 'blog-posts', 'changelog')",
        },
      },
      required: ["project", "modelSlug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.getContentModel.query({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
      });
      return success(result);
    }),
};
