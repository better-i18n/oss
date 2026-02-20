/**
 * proposeLanguages MCP Tool
 *
 * Add one or more target languages to the project.
 * Already-existing languages are silently skipped (not an error).
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
  languages: z
    .array(
      z.object({
        languageCode: z.string().min(2).max(5),
        status: z.enum(["active", "draft"]).default("active").optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const proposeLanguages: Tool = {
  definition: {
    name: "proposeLanguages",
    description:
      "Add one or more target languages to the project. Use ISO 639-1 codes (e.g. 'fr', 'ja', 'de'). Already-existing languages are silently skipped.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        languages: {
          type: "array",
          description:
            "Languages to add. Each item: { languageCode: string, status?: 'active' | 'draft' }. Default status is 'active'.",
          items: {
            type: "object",
            properties: {
              languageCode: { type: "string", description: "ISO 639-1 code (e.g. 'fr', 'de', 'ja')" },
              status: {
                type: "string",
                enum: ["active", "draft"],
                description: "Language status. 'active' = published to CDN (default), 'draft' = visible but not deployed",
              },
            },
            required: ["languageCode"],
          },
        },
      },
      required: ["project", "languages"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.addLanguages.mutate({
        orgSlug: workspaceId,
        projectSlug,
        languages: input.languages,
      });

      return success({
        success: result.success,
        added: result.added,
        skipped: result.skipped,
        results: result.results,
        project: input.project,
      });
    }),
};
