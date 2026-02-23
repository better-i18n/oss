/**
 * updateContentModel MCP Tool
 *
 * Updates a content model's metadata (display name, description, kind, icon).
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
  displayName: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  kind: z.enum(["collection", "single"]).optional(),
  icon: z.string().max(50).optional(),
  enableVersionHistory: z.boolean().optional(),
  tableSettings: z.object({
    baseFields: z.record(z.string(), z.boolean()).optional(),
  }).optional(),
});

export const updateContentModel: Tool = {
  definition: {
    name: "updateContentModel",
    description: "Update a content model's metadata. Provide the model slug and any fields to update.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Content model slug to update",
        },
        displayName: {
          type: "string",
          description: "Updated display name",
        },
        description: {
          type: "string",
          description: "Updated description",
        },
        kind: {
          type: "string",
          enum: ["collection", "single"],
          description: "Updated model kind",
        },
        icon: {
          type: "string",
          description: "Updated icon identifier",
        },
        enableVersionHistory: {
          type: "boolean",
          description: "Updated version history setting",
        },
        tableSettings: {
          type: "object",
          description: "Table display settings for base fields (title, slug, body)",
          properties: {
            baseFields: {
              type: "object",
              description: "Map of base field name → show in table (e.g., { title: true, slug: false, body: false })",
            },
          },
        },
      },
      required: ["project", "modelSlug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.updateContentModel.mutate({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        displayName: input.displayName,
        description: input.description,
        kind: input.kind,
        icon: input.icon,
        enableVersionHistory: input.enableVersionHistory,
        tableSettings: input.tableSettings,
      });

      return success({
        updated: true,
        model: result,
      });
    }),
};
