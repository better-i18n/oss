/**
 * unscheduleContentEntry MCP Tool
 *
 * Cancels a pending scheduled publish. The entry's status is not touched.
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

export const unscheduleContentEntry: Tool = {
  definition: {
    name: "unscheduleContentEntry",
    description:
      "Cancel a content entry's pending scheduled publish (set by scheduleContentEntry). The entry keeps its current status: a draft stays a draft, a live entry stays live. Safe to call when nothing is scheduled. To move a schedule to another time, call scheduleContentEntry again instead; it replaces the old one.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID whose schedule to cancel",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.unscheduleContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
      });

      return success({
        unscheduled: true,
        entry: result,
      });
    }),
};
