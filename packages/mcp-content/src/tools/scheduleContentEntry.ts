/**
 * scheduleContentEntry MCP Tool
 *
 * Schedules a content entry to publish at a future time. The entry keeps its
 * current status until then; the server publishes it exactly as
 * publishContentEntry would, webhooks and cache purge included.
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
  publishAt: z.string().datetime({ offset: true }),
  languages: z.array(z.string().min(1)).optional(),
});

export const scheduleContentEntry: Tool = {
  definition: {
    name: "scheduleContentEntry",
    description:
      "Schedule a content entry to publish at a future time. The entry stays in its current status (usually draft) and is NOT served until publishAt; then the server publishes it exactly like publishContentEntry (webhooks and Content API cache purge included), within about a minute of the time. publishAt is ISO 8601 WITH a timezone offset, e.g. \"2026-10-01T09:00:00Z\" or \"2026-10-01T12:00:00+03:00\". If the user gives a local time without a zone, ask for their timezone instead of guessing. Past times are rejected: to publish now, use publishContentEntry. Calling this again replaces the existing schedule; use unscheduleContentEntry to cancel. Publishing the entry by hand before the time also cancels the schedule. The response includes sch_at (and sch_langs when limited to some languages). Write content and translations first, then schedule.",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID to schedule",
        },
        publishAt: {
          type: "string",
          description:
            'When to publish, ISO 8601 with a timezone offset. Example: "2026-10-01T09:00:00Z". Must be in the future.',
        },
        languages: {
          type: "array",
          items: { type: "string" },
          description:
            "Optional. Only publish these language codes at that time (each must already have a translation). Omit to publish every language that has content.",
        },
      },
      required: ["project", "entryId", "publishAt"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.scheduleContentEntry.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
        publishAt: input.publishAt,
        ...(input.languages && { languages: input.languages }),
      });

      return success({
        scheduled: true,
        entry: result,
      });
    }),
};
