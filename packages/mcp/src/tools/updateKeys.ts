/**
 * updateKeys MCP Tool
 *
 * Updates source text and/or target translations for one or more keys.
 * Readable input schema mapped to compact API payload (t=[{k, ns, l, t, s, st, nc}]).
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

const namespaceContextSchema = z.object({
  description: z.string().optional(),
  team: z.string().optional(),
  domain: z.string().optional(),
  aiPrompt: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).optional();

const inputSchema = projectSchema.extend({
  translations: z.array(
    z.object({
      key: z.string(),
      namespace: z.string().optional(),
      language: z.string(),
      text: z.string(),
      isSource: z.boolean().optional(),
      status: z.string().optional(),
      namespaceContext: namespaceContextSchema,
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
              namespaceContext: {
                type: "object",
                description: "Optional context for the namespace (description, team, domain, aiPrompt, tags). Applied once per namespace.",
                properties: {
                  description: { type: "string", description: "What this namespace is about" },
                  team: { type: "string", description: "Team owning this namespace" },
                  domain: { type: "string", description: "Business domain (e.g., 'auth', 'billing')" },
                  aiPrompt: { type: "string", description: "Custom AI prompt for translations in this namespace" },
                  tags: { type: "array", items: { type: "string" }, description: "Tags for categorization" },
                },
              },
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
            nc: item.namespaceContext,
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
