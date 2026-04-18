/**
 * cancelSync MCP Tool
 *
 * Cancel a queued (pending) sync job before the worker picks it up. Use when
 * a publish was triggered with wrong data or you decided to abort before
 * anything is written to CDN/GitHub.
 *
 * Semantics (IMPORTANT):
 *   - Only sync jobs in status="pending" can be cancelled. Once the worker
 *     has picked up the job (status="in_progress") or it has reached a terminal
 *     state, this is a no-op and the response explains why via `prev` and `rsn`.
 *   - Cancellation prevents the job from being processed — it does NOT roll
 *     back partial work. No CDN files are deleted, no GitHub commits reverted.
 *   - Call as soon as possible after publishTranslations returns a syncId you
 *     want to abort.
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
  syncId: z
    .string()
    .describe(
      "Sync job ID to cancel — returned by publishTranslations in syncJobIds[] or listed by getSyncs.",
    ),
});

export const cancelSync: Tool = {
  definition: {
    name: "cancelSync",
    description: `Cancel a queued sync job before the worker picks it up.

WHEN TO USE:
- You called publishTranslations with the wrong data and want to abort before CDN/GitHub is touched.
- You want to prevent a queued sync from running at all.

SEMANTICS:
- Only jobs in status="pending" can be cancelled.
- If the worker already picked the job up (status="in_progress") or the job has reached a terminal
  state (completed/failed/cancelled), this returns can=false with rsn explaining why.
- Cancellation does NOT roll back partial work. If bytes already made it to CDN/GitHub, they stay.
  The next publish produces a consistent state.
- Call this as EARLY as possible — the window between publish and worker pickup is short.

TYPICAL AGENT WORKFLOW:
1. publishTranslations → returns syncJobIds[]
2. You realize the input was wrong.
3. cancelSync({ syncId }) ASAP.
4. If can=true → fix data → publishTranslations again.
5. If can=false and prev="in_progress" → too late, use getSync(syncId) to watch it finish,
   then compensate with a corrective publish.

RESPONSE SHAPE (compact):
  { id: "<syncId>", can: boolean, prev: "pending"|"in_progress"|"completed"|"failed"|"cancelled",
    rsn: string, hint?: string }`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        syncId: {
          type: "string",
          description:
            "Sync job ID to cancel (returned by publishTranslations in syncJobIds[], or from getSyncs).",
        },
      },
      required: ["project", "syncId"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        const result = await client.mcp.cancelSync.mutate({
          orgSlug: workspaceId,
          projectSlug,
          syncId: input.syncId,
        });

        return success(result);
      },
    ),
};
