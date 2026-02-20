/**
 * updateField MCP Tool
 *
 * Updates a custom field's properties within a content model.
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
  displayName: z.string().min(1).max(200).optional(),
  type: z.enum(["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"]).optional(),
  localized: z.boolean().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().max(500).optional(),
  helpText: z.string().max(500).optional(),
  fieldConfig: z.object({
    targetModel: z.string().optional(),
  }).optional(),
});

export const updateField: Tool = {
  definition: {
    name: "updateField",
    description: "Update a custom field's properties. Identify the field by model slug and field name.",
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
          description: "Field name to update",
        },
        displayName: {
          type: "string",
          description: "Updated display name",
        },
        type: {
          type: "string",
          enum: ["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"],
          description: "Updated field type. For user fields, use 'relation' with fieldConfig.targetModel = 'users'",
        },
        localized: {
          type: "boolean",
          description: "Updated localization setting",
        },
        required: {
          type: "boolean",
          description: "Updated required setting",
        },
        placeholder: {
          type: "string",
          description: "Updated placeholder text",
        },
        helpText: {
          type: "string",
          description: "Updated help text",
        },
        fieldConfig: {
          type: "object",
          description: "Type-specific configuration (e.g., targetModel for relation fields)",
          properties: {
            targetModel: { type: "string", description: "Target model slug for relation fields" },
          },
        },
      },
      required: ["project", "modelSlug", "fieldName"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.updateField.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        fieldName: input.fieldName,
        displayName: input.displayName,
        type: input.type,
        localized: input.localized,
        required: input.required,
        placeholder: input.placeholder,
        helpText: input.helpText,
        fieldConfig: input.fieldConfig,
      });

      return success({
        updated: true,
        field: result,
      });
    }),
};
