# MCP Manual QA Checklist — Agentic Roadmap Features

A ~30-minute end-to-end walkthrough for the four tools shipped in the
agentic roadmap: `cancelSync`, `getSync` waitMs, `getTranslationContext` v1,
`getTranslationContext` v2 RAG. Run this **after** the platform is deployed
and the OSS package is published to npm.

Unlike the smoke script (`bun run smoke` in `packages/mcp/`), this walkthrough
exercises the tools **through a real MCP-enabled AI agent** — Claude Code,
Cursor, Codex, etc. It is the only test layer that validates the tool
descriptions themselves: does the agent reach for the right tool at the
right time, or does the guidance fail silently?

---

## Prerequisites

- `@better-i18n/mcp@latest` installed in an AI agent of your choice (Claude Code works well for this script).
- A test project on the deployed platform with:
  - At least 5-10 translation keys, some with existing translations
  - A glossary with 3+ approved terms, including one `must_not_translate` brand term
  - `ai_system_prompt` set (non-trivial — e.g., "Be concise; use product names verbatim")
  - `ai_context` populated (description + tone set via Analyze Website or manually)
  - **For v2 RAG:** some `project_embedding` rows seeded — run Analyze Website or wait for the background embedder to catch up
- One known-completed syncId (from a previous publish)
- A Riuve dashboard open to watch real-time `mcp` events

---

## 1. getTranslationContext v1 — project-wide snapshot

**Prompt the agent:**
> "Connect to my Better i18n project and tell me what the brand voice is and what terms must not be translated."

**Expected:**
- Agent calls `getTranslationContext` once — verify in Riuve.
- Agent's reply mentions the configured `ai_system_prompt`, tone (formality / voice), and the must-not-translate brand term by name.

**Fail modes to watch for:**
- Agent invents a tone instead of reading `ctx.tone` — description is unclear
- Agent calls `listKeys` / `getProject` instead — tool discovery failing
- Response omits the glossary entirely — service query broken

---

## 2. getTranslationContext v1 — empty project hint

**Setup:** spin up a fresh project with zero glossary, no `ai_system_prompt`, no `ai_context`.

**Prompt the agent:**
> "What's the brand voice for this project?"

**Expected:**
- Agent sees `hint: "No translation context configured…"` and surfaces it to the user (suggests running Analyze Website).

**Fail mode:** agent silently proceeds with a guessed tone — `hint` is not being read.

---

## 3. getTranslationContext v2 — per-key RAG

**Prompt the agent:**
> "Translate the following 5 keys into Turkish, staying consistent with how similar things have been translated before: [pick 5 real keyIds from listKeys]."

**Expected:**
- Agent first calls `listKeys` (or uses a list it already has), then calls `getTranslationContext` **with `keys: [...]` AND `languages: ["tr"]`**.
- Response includes `rules[]` with per-key `sim[]`. Each `sim[i].s` should be between 0 and 1, sorted highest-first per key.
- Agent's translations reuse wording from high-scoring past translations rather than inventing new terms.

**Fail modes:**
- Agent calls `getTranslationContext` without `keys` — it's not following the v2 upgrade hint
- Agent translates each key with a fresh call — it's not caching / not batching
- `rules[0].sim` is empty for every key despite embeddings existing — `embedBatch` / pgvector query regression

---

## 4. getTranslationContext v2 — degraded path

**Setup:** temporarily unset `GEMINI_API_KEY` on the platform worker (staging only!) OR pick a project that has zero `project_embedding` rows.

**Prompt the agent:**
> "Use project context to translate key X."

**Expected:**
- Response includes `hint` explaining the degradation (no API key / no embeddings / circuit open).
- Agent surfaces the hint to the user instead of silently returning a lower-quality translation.

**Fail mode:** agent errors out or returns a fake "success" — the degradation hint is being ignored.

---

## 5. getSync waitMs — blocking wait

**Setup:** trigger a publish via the dashboard (or a pre-warmed syncJob that's still `pending` / `in_progress`).

**Prompt the agent:**
> "I just started a publish. Wait until it's done and tell me the result."

**Expected:**
- Agent calls `getSync({ syncId, waitMs: 15000 })` — **once**, not a polling loop.
- Elapsed time for the call matches the sync duration (±200ms).
- Response `st` is `completed` / `failed` / `cancelled`.

**Fail modes:**
- Agent polls without `waitMs` in a loop — the waitMs hint in the description isn't convincing enough. File a description-clarity bug.
- Elapsed exceeds 25000ms — server-side safety cap broken.
- Agent hangs after the call — response parsing broken.

---

## 6. getSync waitMs — timeout path

**Setup:** find or trigger a sync that runs longer than 25 seconds (large publish, thousands of keys).

**Prompt the agent:**
> "Wait for the publish to finish."

**Expected:**
- First call returns with the job still in `in_progress` / `pending` and `hint` nudges toward another `waitMs=25000` call.
- Agent either calls again (correct) or falls back to polling without waitMs (acceptable fallback).

**Fail mode:** agent gives up after a single timed-out call with no retry / fallback — hint isn't actionable enough.

---

## 7. cancelSync — happy path

**Setup:** trigger a publish that you'll immediately abort. Easiest: use an API client to POST `publishTranslations`, copy the `syncJobIds[0]`, wait ~1 second so it's still pending.

**Prompt the agent:**
> "I just queued a publish with id `<syncId>` but I realized the data was wrong. Cancel it."

**Expected:**
- Agent calls `cancelSync({ syncId })`.
- Response: `{ can: true, prev: "pending", rsn: "cancelled" }`.
- Dashboard shows a `SYNC_CANCELLED` activity row under that job.
- Subsequent `getSync` reports `st: "cancelled"`.

**Fail modes:**
- Agent calls `publishTranslations` with "undo" data instead of `cancelSync` — description not clear about the cancel primitive.
- Dashboard does not show the audit activity row — `syncActivity` insert failing.

---

## 8. cancelSync — too-late path (in_progress)

**Setup:** trigger a publish and wait long enough that the worker has picked it up (status flipped to `in_progress`).

**Prompt the agent:**
> "Cancel sync `<syncId>`."

**Expected:**
- Response: `{ can: false, prev: "in_progress", rsn: "already_in_progress" }`.
- Agent's reply explains the job is past the cancel window and suggests watching it finish or compensating with a corrective publish.

**Fail mode:** agent reports "cancelled" when `can` is `false` — it's not reading `can`.

---

## 9. cancelSync — terminal state

**Setup:** pick any completed syncId.

**Prompt the agent:**
> "Cancel sync `<syncId>`."

**Expected:**
- Response: `{ can: false, prev: "completed", rsn: "terminal_state" }`.
- Agent tells the user the job already finished and nothing was cancelled.

---

## 10. cancelSync — cross-project guard

**Setup:** take a syncId from a **different project** the agent is NOT connected to.

**Prompt the agent:**
> "Cancel sync `<foreign-syncId>`."

**Expected:**
- Tool returns a FORBIDDEN error — the agent surfaces it to the user.
- Dashboard: the foreign sync row is **unchanged** (status untouched).

**Fail mode:** the cross-project sync gets cancelled or leaks data — critical security regression. Stop the deploy.

---

## Sign-off

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | v1 — full context | ☐ | |
| 2 | v1 — empty project hint | ☐ | |
| 3 | v2 — per-key RAG | ☐ | |
| 4 | v2 — degraded path | ☐ | |
| 5 | waitMs — blocking wait | ☐ | |
| 6 | waitMs — timeout path | ☐ | |
| 7 | cancelSync — happy path | ☐ | |
| 8 | cancelSync — in_progress | ☐ | |
| 9 | cancelSync — terminal | ☐ | |
| 10 | cancelSync — cross-project | ☐ | |

All 10 green → ship announce + changelog. Any red → file an issue before
rolling out to customers.
