/**
 * listKeys MCP Tool
 *
 * Lists translation keys in compact format — optimized for browsing and exploration.
 * Returns paginated results with namespace deduplication to minimize token usage.
 *
 * USE THIS for:
 * - Browsing keys (finding what exists)
 * - Checking which keys are missing a translation
 * - Getting key IDs for use with updateKeys
 *
 * Use getTranslations instead when you need actual translation text.
 *
 * RESPONSE FORMAT:
 * - tot: total matching keys (before pagination)
 * - ret: keys returned in this page
 * - has_more: true → increment page to fetch next batch
 * - nss: namespace lookup table — each key's ns field is an index into this array
 * - k: key items (k=name, ns=namespace index, id=uuid, src=source text, tl/tlc=coverage)
 * - note: optional warning (e.g., large project hint to use filters)
 *
 * EXAMPLES:
 * - List first page: { project: "org/project" }
 * - Find "login" keys: { project: "org/project", search: "login" }
 * - Find keys missing Turkish: { project: "org/project", missingLanguage: "tr" }
 * - Filter by namespace: { project: "org/project", namespaces: ["auth", "common"] }
 * - Coverage overview: { project: "org/project", fields: ["id", "translatedLanguageCount"] }
 * - Next page: { project: "org/project", page: 2 }
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const FIELDS = ["id", "sourceText", "translations", "translatedLanguages", "translatedLanguageCount"] as const;

const inputSchema = projectSchema.extend({
  search: z.union([z.string(), z.array(z.string())]).optional(),
  namespaces: z.array(z.string()).optional(),
  missingLanguage: z.string().optional(),
  fields: z.array(z.enum(FIELDS)).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const listKeys: Tool = {
  definition: {
    name: "listKeys",
    description: `Browse translation keys in compact format. Optimized for exploration — use getTranslations when you need actual translation text.

PAGINATION:
- Response includes tot (total), ret (returned), has_more — increment page for next batch
- Default: page=1, limit=20

NAMESPACE DEDUPLICATION:
- nss field is the namespace lookup table (array of strings)
- Each key's ns field is an index into nss (saves tokens on repeated namespaces)
- e.g. nss=["auth","common"] and ns=0 means the key belongs to "auth"

NOTE FIELD:
- Large projects (>500 keys) return a note field warning to use filters
- Apply search, namespaces, or missingLanguage to narrow results

FIELDS (default: ["id", "sourceText"]):
- "translatedLanguageCount" → tlc: 5  (token-efficient integer, great for coverage overview)
- "translatedLanguages"     → tl: ["de","fr","tr"]  (full list, use when you need exact codes)
- "translations"            → tr: {"de":"..."}  (heaviest, only when you need text)
- Prefer "translatedLanguageCount" over "translatedLanguages" for large projects

FILTER OPTIONS:
- search: Key name search (partial match, single string or array for OR)
- namespaces: Filter by namespace(s)
- missingLanguage: Find keys with no translation for this language (e.g., "tr")

EXAMPLES:
- Browse all keys: { project: "org/project" }
- Find "login" keys: { project: "org/project", search: "login" }
- Missing Turkish: { project: "org/project", missingLanguage: "tr" }
- Coverage overview: { project: "org/project", fields: ["id", "translatedLanguageCount"] }
- Next page: { project: "org/project", page: 2, limit: 50 }`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        search: {
          type: "string",
          description:
            "Search keys by name (partial match, case-insensitive). Single string or array for multi-term OR search.",
        },
        namespaces: {
          type: "array",
          items: { type: "string" },
          description: "Filter to keys in these namespace(s)",
        },
        missingLanguage: {
          type: "string",
          description:
            "Return only keys missing a translation for this language code (e.g., 'tr', 'de')",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
            enum: [...FIELDS],
          },
          description:
            "Fields to include per key. Default: [\"id\", \"sourceText\"]. Use \"translatedLanguageCount\" (tlc) for token-efficient coverage count, \"translatedLanguages\" (tl) for full lang code list, \"translations\" (tr) for actual text.",
        },
        page: {
          type: "number",
          description: "Page number (1-indexed, default: 1)",
        },
        limit: {
          type: "number",
          description: "Keys per page (default: 20, max: 100)",
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
        const result = await client.mcp.listKeys.query({
          orgSlug: workspaceId,
          projectSlug,
          search: input.search,
          namespaces: input.namespaces,
          missingLanguage: input.missingLanguage,
          fields: input.fields,
          page: input.page,
          limit: input.limit,
        });
        return success(result);
      },
    ),
};
