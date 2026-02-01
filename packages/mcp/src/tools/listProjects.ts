/**
 * listProjects MCP Tool
 *
 * Lists all projects the user has access to across all organizations.
 */

import { executeSimpleTool, success } from "../base-tool.js";
import type { Tool } from "../types/index.js";
import { z } from "zod";

const inputSchema = z.object({});

export const listProjects: Tool = {
  definition: {
    name: "listProjects",
    description:
      "List all projects you have access to. Call this first to discover available projects before using other tools.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  execute: (client, args) =>
    executeSimpleTool(args, inputSchema, async () => {
      const result = await client.mcp.listProjects.query();
      return success(result);
    }),
};
