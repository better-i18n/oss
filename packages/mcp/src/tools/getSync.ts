/**
 * getSync MCP Tool
 *
 * Get detailed information about a specific sync operation.
 */

import { z } from "zod";
import { executeSimpleTool, success } from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = z.object({
  syncId: z.string(),
});

export const getSync: Tool = {
  definition: {
    name: "getSync",
    description:
      "Get details about a specific sync operation including logs and affected keys. Use syncId from getSyncs response.",
    inputSchema: {
      type: "object",
      properties: {
        syncId: { type: "string" },
      },
      required: ["syncId"],
    },
  },

  execute: (client, args) =>
    executeSimpleTool(args, inputSchema, async (input) => {
      const result = await client.mcp.getSync.query({ syncId: input.syncId });
      return success(result);
    }),
};
