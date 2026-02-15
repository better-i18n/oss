/**
 * bulkPublishEntries MCP Tool
 *
 * Publish multiple content entries at once.
 * Partial success possible — response reports published count and failures.
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
  entryIds: z.array(z.string().uuid()).min(1).max(50),
});

export const bulkPublishEntries: Tool = {
  definition: {
    name: "bulkPublishEntries",
    description:
      "Publish multiple content entries at once. Partial success is possible — response reports published count and any failures.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryIds: {
          type: "array",
          items: { type: "string" },
          description: "Entry UUIDs to publish (max 50)",
        },
      },
      required: ["project", "entryIds"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.bulkPublishEntries.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryIds: input.entryIds,
      });

      return success(result);
    }),
};
