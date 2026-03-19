/**
 * removeField MCP Tool
 *
 * Removes a custom field from a content model.
 * WARNING: Deletes all field values for this field across ALL entries.
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
  fieldName: z.string().min(1),
});

export const removeField: Tool = {
  definition: {
    name: "removeField",
    description: `DESTRUCTIVE: Remove a custom field from a content model. Deletes ALL field values for this field across ALL entries — irreversible, NO recovery.

Before removing: call listContentEntries with the model slug to see how many entries will lose data. Call getContentModel to verify the field exists.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Parent content model slug",
        },
        fieldName: {
          type: "string",
          description: "Field name to remove",
        },
      },
      required: ["project", "modelSlug", "fieldName"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.removeField.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        fieldName: input.fieldName,
      });

      return success({
        removed: true,
        ...result,
      });
    }),
};
