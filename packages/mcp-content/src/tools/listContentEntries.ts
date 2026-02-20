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
  search: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  language: z.string().optional(),
  missingLanguage: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
  expand: z.array(z.string()).optional(),
});

export const listContentEntries: Tool = {
  definition: {
    name: "listContentEntries",
    description: `List content entries with filtering and pagination.

BUILT-IN MODELS:
- "users": Lists project team members (virtual model). Returns member name, email, role, and avatar.

FILTER OPTIONS:
- modelSlug: Filter by content model (e.g., "blog-posts")
- search: Search in title or excerpt
- status: Filter by status ("draft", "published", "archived")
- language: Filter entries that have this language translation
- missingLanguage: Filter entries MISSING a translation for this language

PAGINATION:
- page: Page number (default: 1)
- limit: Results per page (default: 20, max: 50)

EXAMPLES:
- All blog posts: { modelSlug: "blog-posts" }
- Team members: { modelSlug: "users" }
- Published only: { status: "published" }
- Search: { search: "getting started" }
- Missing Turkish: { missingLanguage: "tr" }
- Expand relations: { modelSlug: "blog-posts", expand: ["category", "author"] }`,
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
          description: "Search in title or excerpt",
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
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        limit: {
          type: "number",
          description: "Results per page (default: 20, max: 50)",
        },
        expand: {
          type: "array",
          items: { type: "string" },
          description: "Relation field names to expand (e.g., ['category', 'author'])",
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
        status: input.status,
        language: input.language,
        missingLanguage: input.missingLanguage,
        page: input.page,
        limit: input.limit,
        expand: input.expand,
      });
      return success(result);
    }),
};
