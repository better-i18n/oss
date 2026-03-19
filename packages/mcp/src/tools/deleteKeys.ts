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
    description: `Soft-delete translation keys by UUID (max 100 per call).

REQUIRED WORKFLOW:
1. Call listKeys to find and verify key IDs (UUIDs) before deleting.
2. Call deleteKeys with verified UUIDs.
3. Call getPendingChanges to review what will be permanently deleted.
4. Call publishTranslations only when ready — after publish, deleted keys are PERMANENTLY removed with NO recovery.

Check 'skipped' in response — lists IDs not found or already deleted.`,
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

      return success(result);
    }),
};
