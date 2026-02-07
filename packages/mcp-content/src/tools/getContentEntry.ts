/**
 * getContentEntry MCP Tool
 *
 * Gets a single content entry with all translations, custom field values,
 * and version history. Use this to read content for translation or editing.
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
});

export const getContentEntry: Tool = {
  definition: {
    name: "getContentEntry",
    description:
      "Get a content entry with all translations, custom field values, and version history. Use this to read full content for translation or editing.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.getContentEntry.query({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
      });
      return success(result);
    }),
};
