/**
 * updateKeys MCP Tool
 *
 * Updates source text and/or target translations for one or more keys.
 * Readable input schema mapped to compact API payload (t=[{k, ns, l, t, s, st}]).
 * Each entry = one language update for one key. isSource=true for source text.
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
  translations: z.array(
    z.object({
      key: z.string(),
      namespace: z.string().optional(),
      language: z.string(),
      text: z.string(),
      isSource: z.boolean().optional(),
      status: z.string().optional(),
    }),
  ),
});

export const updateKeys: Tool = {
  definition: {
    name: "updateKeys",
    description:
      "Update translations. Each entry updates ONE language for ONE key. Set isSource=true to update the source text.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        translations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string", description: "Key name (e.g., 'submit_button')" },
              namespace: { type: "string", description: "Namespace (default: 'default')" },
              language: { type: "string", description: "Language code (e.g., 'en', 'tr', 'de')" },
              text: { type: "string", description: "Translation text" },
              isSource: { type: "boolean", description: "true if updating source language text" },
              status: { type: "string", description: "Translation status (e.g., 'approved')" },
            },
            required: ["key", "language", "text"],
          },
        },
      },
      required: ["project", "translations"],
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
          t: input.translations.map((item) => ({
            k: item.key,
            ns: item.namespace || "default",
            l: item.language,
            t: item.text,
            s: item.isSource,
            st: item.status,
          })),
        });

        return success({
          success: true,
          project: input.project,
          keysUpdated: result.keysUpdated,
          updates: result.updates,
        });
      },
    ),
};
