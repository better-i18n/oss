/**
 * duplicateContentEntry MCP Tool
 *
 * Deep-copies a content entry with all its translations and field values.
 * The copy is always created as "draft".
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
  entryId: z.string().uuid(),
  newSlug: z.string().max(200).regex(/^[a-z0-9-]+$/).optional(),
});

export const duplicateContentEntry: Tool = {
  definition: {
    name: "duplicateContentEntry",
    description:
      "Duplicate a content entry with all its translations and field values. The copy is created as draft. Optionally provide a new slug.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Source entry UUID to duplicate",
        },
        newSlug: {
          type: "string",
          description: "Slug for the copy (defaults to original-slug-copy)",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.duplicateContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
        newSlug: input.newSlug,
      });

      return success({
        duplicated: true,
        entry: result,
      });
    }),
};
