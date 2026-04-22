/**
 * deleteBlock MCP Tool
 *
 * Remove a block from the project's catalog. DESTRUCTIVE — existing content
 * entries referencing this block may stop rendering depending on policy.
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
  policy: z.enum(["strict", "warn", "orphan"]).default("strict"),
});

export const deleteBlock: Tool = {
  definition: {
    name: "deleteBlock",
    description: `DESTRUCTIVE: Remove a block from the project's catalog.

Policy controls what happens to existing content entries referencing this block:
- strict (default): fail if any entry uses it (v1: not yet enforced — treats all policies as unconditional delete)
- warn: delete and mark affected entries with a warning flag
- orphan: delete; entries keep raw JSON but render nothing for this block type

Consider deleting related entries first (deleteContentEntry) or reassigning them to a different block type.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        slug: {
          type: "string",
          description: "Block slug to delete",
        },
        policy: {
          type: "string",
          enum: ["strict", "warn", "orphan"],
          description:
            "Deletion policy: strict (default), warn, or orphan",
        },
      },
      required: ["project", "slug"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.deleteBlock.mutate({
        orgSlug: workspaceId,
        projectSlug,
        slug: input.slug,
        policy: input.policy ?? "strict",
      });

      return success({ deleted: result.deleted });
    }),
};
