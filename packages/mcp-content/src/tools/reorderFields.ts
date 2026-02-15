/**
 * reorderFields MCP Tool
 *
 * Reorder fields within a content model.
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
  fieldNames: z.array(z.string()).min(1),
});

export const reorderFields: Tool = {
  definition: {
    name: "reorderFields",
    description:
      "Reorder fields within a content model. Provide the ordered list of field names (first = position 0).",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Parent content model slug",
        },
        fieldNames: {
          type: "array",
          items: { type: "string" },
          description: "Ordered list of field names (first = position 0)",
        },
      },
      required: ["project", "modelSlug", "fieldNames"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.reorderFields.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        fieldNames: input.fieldNames,
      });

      return success({
        reordered: true,
        ...result,
      });
    }),
};
