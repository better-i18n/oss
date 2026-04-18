---
"@better-i18n/mcp": minor
"@better-i18n/mcp-types": patch
---

Add `cancelSync` MCP tool for aborting queued publish jobs.

Previously, when an AI agent realized a publish was triggered with wrong data, there was no way to prevent it from reaching the CDN — the agent had to wait, then compensate with a corrective publish. `cancelSync(syncId)` lets the agent abort a sync job while it is still in status="pending", before the worker picks it up.

Semantics are intentionally strict: only pending jobs can be cancelled. If the job is already `in_progress`, `completed`, `failed`, or `cancelled`, the tool returns `can=false` with a reason (`already_in_progress` / `terminal_state`) so the agent can decide whether to watch the job finish (via `getSync`) or ship a corrective publish. No partial CDN/GitHub work is rolled back — cancelling only prevents execution.

`mcp-types`: extends `SyncJobStatus` to include `"cancelled"`, adds `cancelSyncInput`, `CancelSyncResponse`, and `CompactCancelSyncResponse`, and exposes `cancelSync` on the `MCPClient` interface.
