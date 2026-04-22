/**
 * validateBlockParams MCP Tool
 *
 * Dry-run validate params against a block's registered JSON Schema. Used by AI
 * agents before committing entry updates to avoid failed saves.
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
  params: z.unknown(),
  locale: z.string().min(2).max(10).optional(),
});

export const validateBlockParams: Tool = {
  definition: {
    name: "validateBlockParams",
    description: `Dry-run validate block params against the registered JSON Schema.

Call this before createContentEntry/updateContentEntry to catch invalid params without side effects. Returns { valid: true } or { valid: false, errors: [...] } with per-field paths and expected values.

Critical for agent retry loops: validate → fix errors → validate → commit. Prevents silent corruption of content entries.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        slug: {
          type: "string",
          description: "Block slug to validate against",
        },
        params: {
          type: "object",
          description: "The params object to validate (any shape)",
        },
        locale: {
          type: "string",
          description:
            "Optional locale — reserved for future per-locale schema variants",
        },
      },
      required: ["project", "slug", "params"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.validateBlockParams.query({
        orgSlug: workspaceId,
        projectSlug,
        slug: input.slug,
        params: input.params,
        locale: input.locale,
      });

      return success(result);
    }),
};
