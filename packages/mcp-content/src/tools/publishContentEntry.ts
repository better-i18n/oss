/**
 * publishContentEntry MCP Tool
 *
 * Publishes a content entry by setting its status to "published"
 * and marking the source translation as "published". Returns the full entry detail.
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
      "Publish a single content entry (status change only — NOT a CDN deploy). Sets entry status to 'published' and marks the source translation as 'published'. CDN delivery is managed separately. WHEN TO USE THIS vs. bulkPublishEntries: publishing 1 entry → use this tool. Publishing 2+ entries → use bulkPublishEntries instead (single API call, up to 50 entries). Never call this tool in a loop.",
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
