---
"@better-i18n/mcp": minor
---

Add contextual hints to MCP tool responses for smarter AI agent decisions

- All write tools (`createKeys`, `updateKeys`, `deleteKeys`, language tools) now include `hint` field explaining ambiguous results (empty responses, partial failures, skipped items)
- `deleteKeys` now includes `pendingPublish` reminder — previously missing unlike `createKeys`/`updateKeys`
- `proposeLanguages` and `proposeLanguageEdits` no longer drop `pendingPublish` from API response (bug fix)
- `proposeLanguageEdits` adds hints for not-found language codes and no-op status updates
- `getPendingChanges` includes `recentActivity` (last 3 sync/publish jobs with IDs) and contextual hints
- `getSyncs` explains empty results when filters are applied
- `getSync` provides recovery guidance for failed syncs and polling guidance for in-progress syncs
