/**
 * deleteKeys MCP Tool
 *
 * Soft-deletes translation keys by marking them with a deletedAt timestamp.
 * Keys are permanently removed on the next publish.
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
  keyIds: z.array(z.string().uuid()).min(1).max(100),
});

export const deleteKeys: Tool = {
  definition: {
    name: "deleteKeys",
    description:
      "Soft-delete translation keys by UUID. Keys are marked for deletion and removed from CDN/GitHub on next publish. Get UUIDs from listKeys.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        keyIds: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["project", "keyIds"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.deleteKeys.mutate({
        orgSlug: workspaceId,
        projectSlug,
        keyIds: input.keyIds,
      });

      return success({
        success: true,
        project: input.project,
        markedCount: result.markedCount,
        marked: result.marked,
        skipped: result.skipped,
      });
    }),
};
