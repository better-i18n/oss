/**
 * getSyncs MCP Tool
 *
 * Lists recent sync operations for a project.
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
  limit: z.number().min(1).max(50).optional(),
  status: z.enum(["pending", "in_progress", "completed", "failed"]).optional(),
  type: z
    .enum(["initial_import", "source_sync", "cdn_upload", "batch_publish"])
    .optional(),
});

export const getSyncs: Tool = {
  definition: {
    name: "getSyncs",
    description:
      "List recent sync operations for a project. Returns sync jobs with status, type, and timing. Use to check if syncs succeeded or failed.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        limit: { type: "number" },
        status: {
          type: "string",
          enum: ["pending", "in_progress", "completed", "failed"],
        },
        type: {
          type: "string",
          enum: ["initial_import", "source_sync", "cdn_upload", "batch_publish"],
        },
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.getSyncs.query({
        orgSlug: workspaceId,
        projectSlug,
        limit: input.limit,
        status: input.status,
        type: input.type,
      });
      return success(result);
    }),
};
