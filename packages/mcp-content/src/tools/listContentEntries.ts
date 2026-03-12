/**
 * listContentEntries MCP Tool
 *
 * Lists content entries with filtering and pagination.
 * Supports filtering by model, status, language, and text search.
 *
 * EXAMPLES:
 * - List all entries: { project: "org/proj" }
 * - Filter by model: { project: "org/proj", modelSlug: "blog-posts" }
 * - Search: { project: "org/proj", search: "getting started" }
 * - Filter by status: { project: "org/proj", status: "published" }
 * - Paginate: { project: "org/proj", page: 2, limit: 10 }
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
  modelSlug: z.string().optional(),
  search: z.union([z.string(), z.array(z.string())]).optional(),
  searchLanguages: z.array(z.string()).optional(),
  searchInBody: z.boolean().optional().default(false),
  status: z.enum(["draft", "published", "archived"]).optional(),
  language: z.string().optional(),
  missingLanguage: z.string().optional(),
  expand: z.array(z.string()).optional(),
  compact: z.boolean().optional().default(false),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export const listContentEntries: Tool = {
  definition: {
    name: "listContentEntries",
    description: `List content entries with filtering and pagination.

BUILT-IN MODELS:
- "users": Lists project team members (virtual model). Returns member name, email, role, and avatar.

FILTER OPTIONS:
- modelSlug: Filter by content model (e.g., "blog-posts")
- search: Search in title, slug, and text custom fields. Accepts a string or an array of strings (OR logic — any match returns the entry).
- searchLanguages: Limit search scope to specific language codes (e.g., ["tr", "de"]). Default: all languages.
- searchInBody: Also search body markdown content. Only effective when modelSlug is provided and the model has a body field. Default: false.
- status: Filter by status ("draft", "published", "archived")
- language: Filter entries that have this language translation
- missingLanguage: Filter entries MISSING a translation for this language

RESPONSE MODES:
- compact: When true, returns minimal fields (id, sl, st, t, langs only) — drops dates, model ref, and custom fields. ~65% token reduction. Use when you only need to browse entry titles/statuses.

PAGINATION:
- page: Page number (default: 1)
- limit: Results per page (default: 20, max: 50)

EXAMPLES:
- All blog posts: { modelSlug: "blog-posts" }
- Team members: { modelSlug: "users" }
- Published only: { status: "published" }
- Search single term: { search: "getting started" }
- Search multiple terms (OR): { search: ["hello world", "getting started"] }
- Search only in Turkish: { search: "merhaba", searchLanguages: ["tr"] }
- Search including body: { modelSlug: "blog-posts", search: "introduction", searchInBody: true }
- Missing Turkish: { missingLanguage: "tr" }
- Token-efficient listing: { modelSlug: "blog-posts", compact: true }
- Expand relations: { modelSlug: "blog-posts", expand: ["author", "category"] }`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        modelSlug: {
          type: "string",
          description: "Filter by content model slug",
        },
        search: {
          type: "string",
          description: "Search in title, slug, and text custom fields. Accepts a string or an array of strings (OR logic — any match returns the entry).",
        },
        searchLanguages: {
          type: "array",
          items: { type: "string" },
          description: "Limit search scope to these language codes (e.g., [\"tr\", \"de\"]). Default: all languages.",
        },
        searchInBody: {
          type: "boolean",
          description: "Also search body markdown content. Only effective when modelSlug is provided and the model has a body field. Default: false.",
        },
        status: {
          type: "string",
          enum: ["draft", "published", "archived"],
          description: "Filter by entry status",
        },
        language: {
          type: "string",
          description: "Filter by language code (entries with this translation)",
        },
        missingLanguage: {
          type: "string",
          description: "Filter to entries MISSING a translation for this language code",
        },
        expand: {
          type: "array",
          items: { type: "string" },
          description: "Relation field names to expand with referenced entry data (e.g., [\"author\", \"category\"]). Ignored when compact=true.",
        },
        compact: {
          type: "boolean",
          description: "When true, returns minimal fields (id, sl, st, t, langs only) — drops dates, model ref, and custom fields. ~65% token reduction.",
        },
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        limit: {
          type: "number",
          description: "Results per page (default: 20, max: 50)",
        },
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.listContentEntries.query({
        orgSlug: workspaceId,
        projectSlug,
        modelSlug: input.modelSlug,
        search: input.search,
        searchLanguages: input.searchLanguages,
        searchInBody: input.searchInBody,
        status: input.status,
        language: input.language,
        missingLanguage: input.missingLanguage,
        expand: input.expand,
        compact: input.compact,
        page: input.page,
        limit: input.limit,
      });
      return success(result);
    }),
};
