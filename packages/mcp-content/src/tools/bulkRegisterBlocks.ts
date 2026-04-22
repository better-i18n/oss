/**
 * bulkRegisterBlocks MCP Tool
 *
 * Atomically register up to 50 blocks in one call. Ideal for syncing an entire
 * block registry from code.
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const blockDefinition = z.object({
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

const inputSchema = projectSchema.extend({
  blocks: z.array(blockDefinition).min(1).max(50),
});

export const bulkRegisterBlocks: Tool = {
  definition: {
    name: "bulkRegisterBlocks",
    description: `Register up to 50 blocks atomically in a single transaction.

Prefer this over looping registerBlock when syncing an entire registry from code. All-or-nothing: if any block's schema is invalid, the whole batch is rejected.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        blocks: {
          type: "array",
          description: "Array of block definitions (1-50)",
          items: {
            type: "object",
            properties: {
              slug: { type: "string" },
              displayName: { type: "string" },
              category: { type: "string" },
              description: { type: "string" },
              jsonSchema: { type: "object" },
              previewUrl: { type: "string" },
              previewOrigin: { type: "string" },
              sourceCommit: { type: "string" },
            },
            required: ["slug", "displayName", "jsonSchema"],
          },
        },
      },
      required: ["project", "blocks"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.bulkRegisterBlocks.mutate({
        orgSlug: workspaceId,
        projectSlug,
        blocks: input.blocks,
      });

      return success({
        registered: result.registered,
        blocks: result.blocks,
      });
    }),
};
