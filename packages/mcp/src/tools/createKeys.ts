/**
 * createKeys MCP Tool
 *
 * Creates one or more translation keys with source text and optional translations.
 * Uses compact schema matching the API: k=[{n, ns, v, t, nc}].
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
  k: z.array(
    z.object({
      n: z.string().describe("Key name (e.g., 'submit_button', 'nav.home')"),
      ns: z.string().default("default").describe("Namespace (default: 'default')"),
      v: z.string().optional().describe("Source language text"),
      t: z.record(z.string(), z.string()).optional().describe("Target translations as {langCode: text}"),
      nc: namespaceContextSchema,
    }),
  ).min(1),
});

export const createKeys: Tool = {
  definition: {
    name: "createKeys",
    description:
      "Create translation keys with source text and optional translations. Don't include the source language in translations \u2014 use v (source value) instead.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        k: {
          type: "array",
          description: "Array of keys to create",
          items: {
            type: "object",
            properties: {
              n: { type: "string", description: "Key name (e.g., 'submit_button', 'nav.home')" },
              ns: { type: "string", description: "Namespace (default: 'default')" },
              v: { type: "string", description: "Source language text" },
              t: { type: "object", description: "Target translations as {langCode: text}" },
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
            required: ["n"],
          },
        },
      },
      required: ["project", "k"],
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
          k: input.k,
        });

        return success(result);
      },
    ),
};
