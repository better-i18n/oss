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
  slugs: z.union([z.string(), z.array(z.string())]).optional(),
  search: z.union([z.string(), z.array(z.string())]).optional(),
  searchLocales: z.array(z.string()).optional(),
  includeBody: z.boolean().optional(),
  status: z.union([
    z.enum(["draft", "published", "archived"]),
    z.array(z.enum(["draft", "published", "archived"])),
  ]).optional(),
  language: z.string().optional(),
  languageMode: z.enum(["any", "all"]).optional(),
  missingLanguage: z.string().optional(),
  where: z.record(z.string(), z.string()).optional(),
  expand: z.array(z.string()).optional(),
  compact: z.boolean().optional().default(false),
  sort: z.enum(["publishedAt", "createdAt", "updatedAt", "title"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
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
- slugs: Fetch specific entries by exact slug(s) — more precise than search when slugs are known
- search: Search in title, slug, and text custom fields. String or array (OR logic).
- searchLocales: Limit search to specific locales (e.g., ["tr", "de"]). Default: all languages.
- includeBody: Also search body markdown content. Default: false. Only effective with modelSlug.
- status: Filter by status. Single value or array: "published" or ["draft","published"]
- language: Entries that HAVE this language translation. Example: language="fr" → already translated.
- languageMode: "any" (default, OR) or "all" (AND) when using multiple language values.
- missingLanguage: Entries MISSING a translation for this language. Use for batch-translate workflows.
- where: Exact custom-field value filter. Example: { category: "frameworks" }. AND-combined.
- sort: Sort by "publishedAt", "createdAt", "updatedAt", or "title" (default: updatedAt)
- order: "asc" or "desc" (default: desc)

⚠️ CRITICAL — language vs missingLanguage:
- language="fr"        → returns entries that ALREADY HAVE French
- missingLanguage="fr" → returns entries that NEED French (untranslated)
Never use language= when looking for content that needs translating — always use missingLanguage=.

RESPONSE MODES:
- compact: When true, returns minimal fields (id, sl, st, t, langs only) — drops dates, model ref, and custom fields. ~65% token reduction. Use when you only need to browse entry titles/statuses.

PAGINATION:
- page: Page number (default: 1)
- limit: Results per page (default: 20, max: 50)

EXAMPLES:
- All blog posts: { modelSlug: "blog-posts" }
- Team members: { modelSlug: "users" }
- Published only: { status: "published" }
- Draft or published: { status: ["draft", "published"] }
- Fetch by slugs: { slugs: ["github", "nextjs"] }
- Search: { search: "getting started" }
- Search multiple terms (OR): { search: ["hello world", "getting started"] }
- Search only in Turkish: { search: "merhaba", searchLocales: ["tr"] }
- Search including body: { modelSlug: "blog-posts", search: "introduction", includeBody: true }
- Filter by custom field: { modelSlug: "blog-posts", where: { category: "tech" } }
- Missing Turkish: { missingLanguage: "tr" }
- Latest published first: { sort: "publishedAt", order: "desc" }
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
        slugs: {
          type: "string",
          description: "Fetch specific entries by exact slug(s). String or array. Prefer over search when slugs are known.",
        },
        search: {
          type: "string",
          description: "Search in title, slug, and text custom fields. String or array (OR logic).",
        },
        searchLocales: {
          type: "array",
          items: { type: "string" },
          description: "Limit search to these locales (e.g., [\"tr\", \"de\"]). Default: all languages.",
        },
        includeBody: {
          type: "boolean",
          description: "Also search body markdown content. Default: false. Only effective with modelSlug.",
        },
        status: {
          type: "string",
          description: "Filter by status. Single value or array: \"published\" or [\"draft\",\"published\"].",
        },
        language: {
          type: "string",
          description: "Filter entries that HAVE this language translation.",
        },
        languageMode: {
          type: "string",
          enum: ["any", "all"],
          description: "\"any\" (default, OR) or \"all\" (AND) for multi-language filter.",
        },
        missingLanguage: {
          type: "string",
          description: "Filter entries MISSING a translation for this language code.",
        },
        where: {
          type: "object",
          description: "Exact custom-field value filter. Example: { category: \"frameworks\" }. AND-combined.",
        },
        expand: {
          type: "array",
          items: { type: "string" },
          description: "Relation field names to expand with referenced entry data. Ignored when compact=true.",
        },
        compact: {
          type: "boolean",
          description: "When true, returns minimal fields (id, sl, st, t, langs only). ~65% token reduction.",
        },
        sort: {
          type: "string",
          enum: ["publishedAt", "createdAt", "updatedAt", "title"],
          description: "Sort field (default: updatedAt).",
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort direction (default: desc).",
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
        models: input.modelSlug,
        slugs: input.slugs,
        search: input.search,
        searchLocales: input.searchLocales,
        includeBody: input.includeBody,
        status: input.status,
        language: input.language,
        languageMode: input.languageMode,
        missingLanguage: input.missingLanguage,
        where: input.where,
        expand: input.expand,
        compact: input.compact,
        sort: input.sort,
        order: input.order,
        page: input.page,
        limit: input.limit,
      });
      return success(result);
    }),
};
