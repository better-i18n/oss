---
"@better-i18n/mcp": minor
"@better-i18n/mcp-types": patch
---

Add optional `waitMs` to `getSync` — server-side blocking wait until terminal state.

Previously, agents had to poll `getSync` every 2-3 seconds after `publishTranslations`, burning 3-6 round-trips (and 3-6 turns of agent context) for a sync that typically finishes in 5-30 seconds. Now a single `getSync({ syncId, waitMs: 15000 })` blocks until the job reaches `completed`, `failed`, or `cancelled` — or returns the latest snapshot if the timeout elapses.

Semantics:
- `waitMs` is optional and capped at 25000ms to stay safely below Cloudflare Workers' 30s wall-time limit.
- Omit (or pass `0`) for the original instant-snapshot behavior — fully backwards compatible.
- Wait loop is read-only (polls every ~2s) and degrades gracefully on timeout; the hint now nudges toward a second call with `waitMs=25000` rather than an infinite poll.

`mcp-types`: `getSyncInput` gains the optional `waitMs` field.
