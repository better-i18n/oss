/**
 * updateKeys MCP Tool
 *
 * Updates source text and/or target translations for one or more keys.
 * Uses compact schema matching the API: t=[{k, ns, l, t, s, st, nc}].
 * Each entry = one language update for one key. s=true for source text.
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
  t: z.array(
    z.object({
      k: z.string().describe("Key name (e.g., 'submit_button')"),
      ns: z.string().optional().describe("Namespace (default: 'default')"),
      l: z.string().describe("Language code (e.g., 'en', 'tr', 'de')"),
      t: z.string().describe("Translation text"),
      s: z.boolean().optional().describe("true if updating source language text"),
      st: z.string().optional().describe("Translation status (e.g., 'approved')"),
      nc: namespaceContextSchema,
    }),
  ).min(1),
});

export const updateKeys: Tool = {
  definition: {
    name: "updateKeys",
    description:
      "Update translations. Each entry updates ONE language for ONE key. Set s=true to update the source text.",
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
              k: { type: "string", description: "Key name (e.g., 'submit_button')" },
              ns: { type: "string", description: "Namespace (default: 'default')" },
              l: { type: "string", description: "Language code (e.g., 'en', 'tr', 'de')" },
              t: { type: "string", description: "Translation text" },
              s: { type: "boolean", description: "true if updating source language text" },
              st: { type: "string", description: "Translation status (e.g., 'approved')" },
              nc: {
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
            required: ["k", "l", "t"],
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
