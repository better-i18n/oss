/**
 * listContentModels MCP Tool
 *
 * Lists all content models for a project with entry counts and field definitions.
 * Use this first to discover available content types before querying entries.
 */

import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema;

export const listContentModels: Tool = {
  definition: {
    name: "listContentModels",
    description:
      "List all content models for a project with entry counts and field definitions. Use this to discover available content types (e.g., blog posts, changelog entries) before querying entries.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (_input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.listContentModels.query({
        orgSlug: workspaceId,
        projectSlug,
      });
      return success(result);
    }),
};
