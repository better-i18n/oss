/**
 * getProject MCP Tool
 *
 * Gets project information including namespaces, languages, key count, and coverage stats.
 */

import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema;

export const getProject: Tool = {
  definition: {
    name: "getProject",
    description:
      "Get project details including namespaces, languages, key count, and translation coverage. Use this after listProjects to understand a specific project's structure. Namespaces include rich metadata: name, keyCount, description, and context (team, domain, aiPrompt, tags).",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.getProject.query({
        orgSlug: workspaceId,
        projectSlug,
      });
      return success(result);
    }),
};
