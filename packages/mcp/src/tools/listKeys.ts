/**
 * listKeys MCP Tool
 *
 * Lists ALL translation keys with source text and translations.
 * Supports full-text search in source and target languages.
 *
 * EXAMPLES:
 * - Find "login" in source: { search: "login" }
 * - Find "Giriş" in Turkish: { search: "Giriş", languages: ["tr"] }
 * - Get Turkish translations: { languages: ["tr"] }
 * - Get specific keys: { keys: ["auth.login.title", "auth.login.button"] }
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
  search: z.string().optional(),
  languages: z.array(z.string()).optional(),
  namespaces: z.array(z.string()).optional(),
  keys: z.array(z.string()).optional(),
  status: z.enum(["missing", "draft", "approved", "all"]).optional(),
});

export const listKeys: Tool = {
  definition: {
    name: "listKeys",
    description: `Get all translation keys with their id, source text, and translations.

SEARCH + FILTER:
- search: Text to search for (in source text or specified languages)
- languages: Languages to search in AND return translations for

FILTER OPTIONS:
- namespaces: Filter by namespace(s)
- keys: Fetch specific keys by exact name
- status: Filter by translation status ("missing", "draft", "approved", "all")

EXAMPLES:
- Find "login" in source: { search: "login" }
- Find "Giriş" in Turkish: { search: "Giriş", languages: ["tr"] }
- Get all Turkish translations: { languages: ["tr"] }
- Get missing Turkish translations: { languages: ["tr"], status: "missing" }
- Get specific keys: { keys: ["auth.login.title", "auth.login.button"] }`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        search: {
          type: "string",
          description:
            "Text to search for in source text or translations (case-insensitive). If languages is specified, searches in those languages; otherwise searches source text.",
        },
        languages: {
          type: "array",
          items: { type: "string" },
          description:
            "Language codes to search in and return (e.g., ['tr', 'de']). If omitted with search, searches source text. If omitted without search, returns all languages.",
        },
        namespaces: {
          type: "array",
          items: { type: "string" },
          description: "Filter by namespace(s)",
        },
        keys: {
          type: "array",
          items: { type: "string" },
          description: "Fetch specific keys by exact name",
        },
        status: {
          type: "string",
          enum: ["missing", "draft", "approved", "all"],
          description:
            "Filter by translation status (default: all). Requires languages to be specified for filtering.",
        },
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        const result = await client.mcp.getAllTranslations.query({
          orgSlug: workspaceId,
          projectSlug,
          search: input.search,
          languages: input.languages,
          namespaces: input.namespaces,
          keys: input.keys,
          status: input.status,
        });
        return success(result);
      },
    ),
};
