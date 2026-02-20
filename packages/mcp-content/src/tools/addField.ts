/**
 * addField MCP Tool
 *
 * Adds a custom field to a content model.
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
  name: z.string().min(1).max(100).regex(/^[a-z_][a-z0-9_]*$/),
  displayName: z.string().min(1).max(200),
  type: z.enum(["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"]).default("text"),
  localized: z.boolean().default(false),
  required: z.boolean().default(false),
  placeholder: z.string().max(500).optional(),
  helpText: z.string().max(500).optional(),
  position: z.number().int().min(0).optional(),
  fieldConfig: z.object({
    targetModel: z.string().optional(),
  }).optional(),
});

export const addField: Tool = {
  definition: {
    name: "addField",
    description: "Add a custom field to a content model. Field name must be snake_case. For relation fields, use fieldConfig.targetModel to specify the related model slug.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Parent content model slug",
        },
        name: {
          type: "string",
          description: "Field name (snake_case, e.g., 'author_name')",
        },
        displayName: {
          type: "string",
          description: "Display name (e.g., 'Author Name')",
        },
        type: {
          type: "string",
          enum: ["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"],
          description: "Field type (default: text). For user fields, use 'relation' with fieldConfig.targetModel = 'users'",
        },
        localized: {
          type: "boolean",
          description: "Whether field is localized per language (default: false)",
        },
        required: {
          type: "boolean",
          description: "Whether field is required (default: false)",
        },
        placeholder: {
          type: "string",
          description: "Placeholder text",
        },
        helpText: {
          type: "string",
          description: "Help text",
        },
        position: {
          type: "number",
          description: "Sort position (auto-calculated if omitted)",
        },
        fieldConfig: {
          type: "object",
          description: "Type-specific configuration (e.g., targetModel for relation fields)",
          properties: {
            targetModel: { type: "string", description: "Target model slug for relation fields" },
          },
        },
      },
      required: ["project", "modelSlug", "name", "displayName"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.addField.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        name: input.name,
        displayName: input.displayName,
        type: input.type,
        localized: input.localized,
        required: input.required,
        placeholder: input.placeholder,
        helpText: input.helpText,
        position: input.position,
        fieldConfig: input.fieldConfig,
      });

      return success({
        created: true,
        field: result,
      });
    }),
};
