---
"@better-i18n/mcp-content": minor
"@better-i18n/mcp-types": patch
---

Raise bulk content entry caps to unblock large agent batches: `bulkUpdateEntries` 20→200, `bulkCreateEntries` 20→200, `bulkPublishEntries` 50→500. Previous caps forced AI agents into many round trips for naturally one-shot workloads (e.g. "translate all 200 blog posts to Turkish"), costing tokens, latency, and breaking single-call partial-failure semantics. Partial failure reporting via `failed[]` is unchanged and now covers a wider slice of real workloads in one call.
