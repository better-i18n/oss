/**
 * publishContentEntry MCP Tool
 *
 * Publishes a content entry by setting its status to "published"
 * and approving the source translation. Returns the full entry detail.
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

export const publishContentEntry: Tool = {
  definition: {
    name: "publishContentEntry",
    description:
      "Publish a content entry. Sets status to 'published' and approves the source translation. The entry becomes visible to SDK consumers.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID to publish",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.publishContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
      });

      return success({
        published: true,
        entry: result,
      });
    }),
};
