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
  includeBody: z.boolean().optional(),
});

export const updateContentModel: Tool = {
  definition: {
    name: "updateContentModel",
    description: `Update a content model's metadata (displayName, description, icon, etc.).

⚠️ STRUCTURAL SAFETY RULE: DO NOT change includeBody, kind, or slug unless the user EXPLICITLY requests it.
- Changing includeBody can hide/show body fields across all entries.
- Changing kind (collection↔singleton) alters the model's behavior.
- Changing slug breaks existing API references and CDN paths.

REQUIRED WORKFLOW:
1. Call getContentModel FIRST to read current settings.
2. Only modify the specific fields requested by the user.
3. To add fields, use addField — do NOT toggle includeBody here.

For taxonomy/lookup models (categories, tags): keep includeBody=false unless user explicitly asks for body content.`,
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
        includeBody: {
          type: "boolean",
          description: "Set false to remove the body/rich-text field (for structured data models with only custom fields). Set true to add it back.",
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
        includeBody: input.includeBody,
      });

      return success({
        updated: true,
        model: result,
      });
    }),
};
