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
    description:
      "Delete a content entry and all its translations, field values, and versions. This action is irreversible.",
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
