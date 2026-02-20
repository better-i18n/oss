/**
 * proposeLanguageEdits MCP Tool
 *
 * Update status of existing target languages.
 * Statuses: active (published to CDN), draft (visible but not deployed), archived (hidden).
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
  edits: z
    .array(
      z.object({
        languageCode: z.string().min(2).max(5),
        newStatus: z.enum(["active", "draft", "archived"]),
      }),
    )
    .min(1)
    .max(50),
});

export const proposeLanguageEdits: Tool = {
  definition: {
    name: "proposeLanguageEdits",
    description:
      "Update status of existing target languages — active (published to CDN), draft (visible but not deployed), archived (hidden from editor and CDN). Use this to activate, deactivate, or archive languages.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        edits: {
          type: "array",
          description:
            "Language edits. Each item: { languageCode: string, newStatus: 'active' | 'draft' | 'archived' }.",
          items: {
            type: "object",
            properties: {
              languageCode: { type: "string", description: "ISO 639-1 code of the language to update" },
              newStatus: {
                type: "string",
                enum: ["active", "draft", "archived"],
                description: "New status: active=published to CDN, draft=visible but not deployed, archived=hidden",
              },
            },
            required: ["languageCode", "newStatus"],
          },
        },
      },
      required: ["project", "edits"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      // Map edits → updates format expected by the API
      const updates = input.edits.map((edit) => ({
        languageCode: edit.languageCode,
        status: edit.newStatus,
      }));

      const result = await client.mcp.updateLanguages.mutate({
        orgSlug: workspaceId,
        projectSlug,
        updates,
      });

      return success({
        success: result.success,
        results: result.results,
        notFound: result.notFound,
        project: input.project,
      });
    }),
};
