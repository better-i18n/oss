/**
 * updateKeys MCP Tool
 *
 * Updates source text and/or target translations for one or more keys.
 * Uses UUID-based schema matching the API: t=[{id, l, t, s, st}].
 *
 * IMPORTANT: id (UUID) is required — get it from getAllTranslations or listKeys response.
 * The old k/ns/nc format has been removed. Use id exclusively.
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
  t: z.array(
    z.object({
      id: z.string().describe("Translation key UUID — get from getAllTranslations or listKeys response (id field)"),
      l: z.string().describe("Language code (e.g., 'tr', 'de')"),
      t: z.string().describe("Translation text"),
      s: z.boolean().optional().describe("true if updating source language text"),
      st: z.string().optional().describe("Translation status (e.g., 'approved')"),
    }),
  ).min(1),
});

export const updateKeys: Tool = {
  definition: {
    name: "updateKeys",
    description:
      "Update translations for existing keys. REQUIRED: Get key UUIDs first via getAllTranslations or listKeys (id field). Each entry updates ONE language for ONE key. Set s=true to update the source text.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        t: {
          type: "array",
          description: "Array of translation updates. Each entry updates ONE language for ONE key.",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "Translation key UUID (required). Get from getAllTranslations or listKeys response." },
              l: { type: "string", description: "Language code (e.g., 'tr', 'de')" },
              t: { type: "string", description: "Translation text" },
              s: { type: "boolean", description: "true if updating source language text" },
              st: { type: "string", description: "Translation status (e.g., 'approved')" },
            },
            required: ["id", "l", "t"],
          },
        },
      },
      required: ["project", "t"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        const result = await client.mcp.updateKeys.mutate({
          orgSlug: workspaceId,
          projectSlug,
          t: input.t,
        });

        return success(result);
      },
    ),
};
