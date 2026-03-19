/**
 * deleteContentEntry MCP Tool
 *
 * Hard-deletes a content entry and all its translations, field values, and versions.
 * This action is irreversible.
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
  entryId: z.string().uuid(),
});

export const deleteContentEntry: Tool = {
  definition: {
    name: "deleteContentEntry",
    description: `HARD DELETE a content entry — irreversible, NO recovery.

Deletes the entry and ALL its translations, field values, and versions.

REQUIRED WORKFLOW:
1. Call getContentEntry FIRST to verify you have the correct entry.
2. Confirm the entry ID matches what you intend to delete.
3. Call deleteContentEntry only after verification.

SAFER ALTERNATIVE: Use updateContentEntry with status='archived' instead. Archived entries can be restored later.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID to delete",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.deleteContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
      });

      return success({
        deleted: true,
        ...result,
      });
    }),
};
