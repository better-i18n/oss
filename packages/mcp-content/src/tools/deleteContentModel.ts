/**
 * deleteContentModel MCP Tool
 *
 * Hard-deletes a content model and ALL related data (fields, entries, translations, versions).
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
  modelSlug: z.string().min(1),
});

export const deleteContentModel: Tool = {
  definition: {
    name: "deleteContentModel",
    description:
      "DESTRUCTIVE: Delete a content model and ALL its fields, entries, translations, and versions. This action is irreversible.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Content model slug to delete",
        },
      },
      required: ["project", "modelSlug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.deleteContentModel.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
      });

      return success({
        deleted: true,
        ...result,
      });
    }),
};
