/**
 * getSync MCP Tool
 *
 * Get detailed information about a specific sync operation.
 *
 * Supports optional server-side blocking wait (waitMs) that collapses the
 * typical 3-6 round-trip polling loop into a single call for publishes
 * that finish within the window.
 */

import { z } from "zod";
import { executeSimpleTool, success } from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = z.object({
  syncId: z.string(),
  waitMs: z.number().int().min(0).max(25000).optional(),
});

export const getSync: Tool = {
  definition: {
    name: "getSync",
    description: `Get details about a specific sync operation — logs, affected keys, current status. Use syncId from publishTranslations or getSyncs.

BLOCKING WAIT (waitMs):
Pass waitMs to let the server block until the job reaches a terminal state
(completed / failed / cancelled) or the timeout elapses — whichever happens first.

- Omit waitMs (or pass 0) → instant snapshot (original behavior).
- Pass waitMs=15000 → server polls every ~2s and returns as soon as the job
  is done, or after 15s with the latest snapshot.
- Max 25000 (25s). Larger publishes (30s+) need a second call.

PREFER blocking wait right after publishTranslations — it replaces the 3-6
polling round-trips an agent otherwise makes. If the wait times out with the
job still running, the response hint tells you to call again with waitMs=25000
or fall back to polling.`,
    inputSchema: {
      type: "object",
      properties: {
        syncId: {
          type: "string",
          description:
            "Sync job ID — from publishTranslations syncJobIds[] or getSyncs.",
        },
        waitMs: {
          type: "number",
          description:
            "Optional server-side blocking wait in milliseconds (0-25000). Returns as soon as the job reaches a terminal state, or with the latest snapshot after the timeout.",
        },
      },
      required: ["syncId"],
    },
  },

  execute: (client, args) =>
    executeSimpleTool(args, inputSchema, async (input) => {
      const result = await client.mcp.getSync.query({
        syncId: input.syncId,
        ...(input.waitMs !== undefined ? { waitMs: input.waitMs } : {}),
      });
      return success(result);
    }),
};
