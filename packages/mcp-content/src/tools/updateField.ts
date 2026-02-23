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

const enumValueItem = z.object({
  label: z.string().min(1).max(200),
  value: z.string().min(1).max(200),
});

const fieldOptionsSchema = z.object({
  enumValues: z.array(enumValueItem).max(200).optional(),
  unsplash: z.object({ enabled: z.boolean() }).optional(),
  aiGeneration: z.object({
    enabled: z.boolean(),
    prompt: z.string().max(2000).optional(),
    model: z.string().max(100).optional(),
  }).optional(),
}).optional();

const inputSchema = projectSchema.extend({
  modelSlug: z.string().min(1),
  fieldName: z.string().min(1),
  displayName: z.string().min(1).max(200).optional(),
  type: z.enum(["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"]).optional(),
  localized: z.boolean().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().max(500).optional(),
  helpText: z.string().max(500).optional(),
  options: fieldOptionsSchema,
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
        options: {
          type: "object",
          description: "Field-level options. For enum fields: { enumValues: [{ label, value }] }. For media: { unsplash, aiGeneration }",
          properties: {
            enumValues: {
              type: "array",
              description: "Allowed values for enum fields",
              items: {
                type: "object",
                properties: {
                  label: { type: "string", description: "Display label shown to users" },
                  value: { type: "string", description: "Machine-readable value stored in DB" },
                },
                required: ["label", "value"],
              },
            },
          },
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
        options: input.options,
        fieldConfig: input.fieldConfig,
      });

      return success({
        updated: true,
        field: result,
      });
    }),
};
