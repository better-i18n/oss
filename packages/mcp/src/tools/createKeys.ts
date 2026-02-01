/**
 * createKeys MCP Tool
 *
 * Creates one or more translation keys with source text and optional translations.
 * Readable input schema mapped to compact API payload (k=[{n, ns, v, t}]).
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
  keys: z.array(
    z.object({
      name: z.string(),
      namespace: z.string().optional(),
      sourceText: z.string().optional(),
      translations: z.record(z.string(), z.string()).optional(),
    }),
  ),
});

export const createKeys: Tool = {
  definition: {
    name: "createKeys",
    description:
      "Create translation keys with source text and optional translations. Don't include the source language in translations — use sourceText instead.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        keys: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Key name (e.g., 'submit_button', 'nav.home')" },
              namespace: { type: "string", description: "Namespace (default: 'default')" },
              sourceText: { type: "string", description: "Source language text" },
              translations: { type: "object", description: "Target translations as {langCode: text}" },
            },
            required: ["name"],
          },
        },
      },
      required: ["project", "keys"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        const result = await client.mcp.createKeys.mutate({
          orgSlug: workspaceId,
          projectSlug,
          k: input.keys.map((item) => ({
            n: item.name,
            ns: item.namespace || "default",
            v: item.sourceText,
            t: item.translations,
          })),
        });

        return success({
          success: true,
          project: input.project,
          keysCreated: result.keysCreated,
          keys: result.keys,
        });
      },
    ),
};
