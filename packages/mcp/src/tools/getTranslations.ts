/**
 * getTranslations MCP Tool
 *
 * Gets translation keys with full text content and status.
 * Optimized for AI translation tasks that need to read or update translation text.
 *
 * USE THIS when you need actual translation text (to translate, review, or update).
 * Use listKeys instead for browsing/exploring keys — it's faster and uses fewer tokens.
 *
 * SEARCH + FILTER:
 * - search: Text to search for (in source text or specified languages)
 * - languages: Which languages to search in AND return translations for
 * - status: Filter by translation status ("missing", "draft", "approved", "all")
 * - namespaces: Filter by namespace(s)
 * - keys: Fetch specific keys by exact name
 * - limit: Max keys to return (1–200, default 100)
 *
 * RESPONSE INCLUDES PAGINATION METADATA:
 * - returned: number of keys in this response
 * - total: total keys in DB matching your filters (before status filter)
 * - hasMore: true when total > limit — use narrower filters to get specific keys
 *
 * EXAMPLES:
 * - Find "login" in source: { project: "org/project", search: "login" }
 * - Multi-term search: { project: "org/project", search: ["login", "signup", "forgot_password"] }
 * - Find "Giriş" in Turkish: { project: "org/project", search: "Giriş", languages: ["tr"] }
 * - Get all Turkish translations: { project: "org/project", languages: ["tr"] }
 * - Get missing Turkish: { project: "org/project", languages: ["tr"], status: "missing" }
 * - Get specific keys: { project: "org/project", keys: ["auth.login.title", "auth.login.button"] }
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
  search: z.union([z.string(), z.array(z.string())]).optional(),
  languages: z.array(z.string()).optional(),
  namespaces: z.array(z.string()).optional(),
  keys: z.array(z.string()).optional(),
  status: z.enum(["missing", "draft", "approved", "all"]).optional(),
  limit: z.number().min(1).max(200).optional(),
});

export const getTranslations: Tool = {
  definition: {
    name: "getTranslations",
    description: `Get translation keys with full text content and status for AI translation tasks.

USE THIS when you need actual translation text (to translate, review, or update).
Use listKeys instead for browsing/exploring keys — it's faster and uses fewer tokens.

SEARCH + FILTER:
- search: Text to search for (in source text or specified languages)
- languages: Languages to search in AND return translations for
- status: Filter by translation status ("missing", "draft", "approved", "all")
- namespaces: Filter by namespace(s)
- keys: Fetch specific keys by exact name
- limit: Max keys (1–200, default 100)

RESPONSE METADATA:
- returned: keys in this response (after all filters)
- total: DB count before in-memory status filter
- hasMore: true when total > limit — narrow your filters to get specific results

EXAMPLES:
- Find "login" in source: { search: "login" }
- Multi-term search: { search: ["login", "signup", "forgot_password"] }
- Find "Giriş" in Turkish: { search: "Giriş", languages: ["tr"] }
- Get all Turkish translations: { languages: ["tr"] }
- Get missing Turkish translations: { languages: ["tr"], status: "missing" }
- Get specific keys: { keys: ["auth.login.title", "auth.login.button"] }

Response includes namespaceDetails: a map of namespace metadata (name, keyCount, description, context with team/domain/aiPrompt/tags) for all namespaces present in the result.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        search: {
          type: "string",
          description:
            "Text to search for in source text or translations (case-insensitive). Single string or array of strings for multi-term search (OR matching). If languages is specified, searches in those languages; otherwise searches source text.",
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
        limit: {
          type: "number",
          description:
            "Max keys to return (1–200, default 100). Check 'returned', 'total', 'hasMore' in response to understand result size. Use narrower filters to get specific keys.",
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
          limit: input.limit,
        });
        return success(result);
      },
    ),
};
