/**
 * registerBlock MCP Tool
 *
 * Upsert a single block in the project's block catalog by (project, slug).
 * Called when a new `defineBlock()` is added in the customer's SDK client.
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
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z][a-z0-9-]*$/),
  displayName: z.string().min(1).max(120),
  category: z.string().max(64).optional(),
  description: z.string().max(500).optional(),
  jsonSchema: z.record(z.string(), z.unknown()),
  previewUrl: z.string().url().optional(),
  previewOrigin: z.string().url().optional(),
  sourceCommit: z.string().max(64).optional(),
});

export const registerBlock: Tool = {
  definition: {
    name: "registerBlock",
    description: `Upsert a single block in the project's block catalog by (project, slug).

Blocks are code-first renderable primitives (hero, feature grid, cover, FAQ, CTA) defined by the customer's SDK client via 'defineBlock()'. This call stores the JSON Schema + metadata used by the CMS and by AI agents to compose entries.

ONLY stores schema + metadata — no render code ever enters Better's infrastructure.

On conflict: updates displayName, category, description, jsonSchema, preview fields, sourceCommit.

Typical workflow:
1. Developer writes 'defineBlock({ slug, params: z.object({...}), render })' in app code
2. Run z.toJSONSchema() on params to extract JSON Schema
3. Call registerBlock with the schema + metadata

To register many blocks atomically, use bulkRegisterBlocks instead.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        slug: {
          type: "string",
          description: "Block slug (kebab-case, unique per project). Example: 'cover-gradient'",
        },
        displayName: {
          type: "string",
          description: "Human-readable name shown in CMS picker",
        },
        category: {
          type: "string",
          description: "Grouping label for picker (e.g. 'cover', 'marketing')",
        },
        description: {
          type: "string",
          description: "Help text shown to editors",
        },
        jsonSchema: {
          type: "object",
          description:
            "JSON Schema (draft-7 or 2020-12) derived from the block's Zod schema. Required. Used to render CMS forms and validate params.",
        },
        previewUrl: {
          type: "string",
          description: "Static preview PNG/WEBP URL (customer-hosted)",
        },
        previewOrigin: {
          type: "string",
          description:
            "Base URL where the customer serves live previews. CMS iframes this for opt-in live preview.",
        },
        sourceCommit: {
          type: "string",
          description: "Git SHA or version tag for traceability",
        },
      },
      required: ["project", "slug", "displayName", "jsonSchema"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.registerBlock.mutate({
        orgSlug: workspaceId,
        projectSlug,
        slug: input.slug,
        displayName: input.displayName,
        category: input.category,
        description: input.description,
        jsonSchema: input.jsonSchema,
        previewUrl: input.previewUrl,
        previewOrigin: input.previewOrigin,
        sourceCommit: input.sourceCommit,
      });

      return success({ registered: true, block: result });
    }),
};
