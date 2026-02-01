/**
 * createKeys MCP Tool
 *
 * Creates one or more translation keys with source text and optional translations.
 * Readable input schema mapped to compact API payload (k=[{n, ns, v, t, nc}]).
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
  keys: z.array(
    z.object({
      name: z.string(),
      namespace: z.string().optional(),
      sourceText: z.string().optional(),
      translations: z.record(z.string(), z.string()).optional(),
      namespaceContext: namespaceContextSchema,
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
            nc: item.namespaceContext,
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
