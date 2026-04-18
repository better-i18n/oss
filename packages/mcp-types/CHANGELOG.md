# @better-i18n/mcp-types

## 0.0.2

### Patch Changes

- 6efce5e: Raise bulk content entry caps to unblock large agent batches: `bulkUpdateEntries` 20→200, `bulkCreateEntries` 20→200, `bulkPublishEntries` 50→500. Previous caps forced AI agents into many round trips for naturally one-shot workloads (e.g. "translate all 200 blog posts to Turkish"), costing tokens, latency, and breaking single-call partial-failure semantics. Partial failure reporting via `failed[]` is unchanged and now covers a wider slice of real workloads in one call.
- 7182a91: Add `cancelSync` MCP tool for aborting queued publish jobs.

  Previously, when an AI agent realized a publish was triggered with wrong data, there was no way to prevent it from reaching the CDN — the agent had to wait, then compensate with a corrective publish. `cancelSync(syncId)` lets the agent abort a sync job while it is still in status="pending", before the worker picks it up.

  Semantics are intentionally strict: only pending jobs can be cancelled. If the job is already `in_progress`, `completed`, `failed`, or `cancelled`, the tool returns `can=false` with a reason (`already_in_progress` / `terminal_state`) so the agent can decide whether to watch the job finish (via `getSync`) or ship a corrective publish. No partial CDN/GitHub work is rolled back — cancelling only prevents execution.

  `mcp-types`: extends `SyncJobStatus` to include `"cancelled"`, adds `cancelSyncInput`, `CancelSyncResponse`, and `CompactCancelSyncResponse`, and exposes `cancelSync` on the `MCPClient` interface.

- 10a640b: Add optional `waitMs` to `getSync` — server-side blocking wait until terminal state.

  Previously, agents had to poll `getSync` every 2-3 seconds after `publishTranslations`, burning 3-6 round-trips (and 3-6 turns of agent context) for a sync that typically finishes in 5-30 seconds. Now a single `getSync({ syncId, waitMs: 15000 })` blocks until the job reaches `completed`, `failed`, or `cancelled` — or returns the latest snapshot if the timeout elapses.

  Semantics:
  - `waitMs` is optional and capped at 25000ms to stay safely below Cloudflare Workers' 30s wall-time limit.
  - Omit (or pass `0`) for the original instant-snapshot behavior — fully backwards compatible.
  - Wait loop is read-only (polls every ~2s) and degrades gracefully on timeout; the hint now nudges toward a second call with `waitMs=25000` rather than an infinite poll.

  `mcp-types`: `getSyncInput` gains the optional `waitMs` field.

- 8142354: Add `getTranslationContext` MCP tool — v1 ships project-wide translation context (brand voice, tone, glossary, locked translations, owner instructions) so external AI agents (Claude Code, Codex, Cursor, …) translate with the same guidance the in-platform AI drawer already uses.

  Before this tool, agents connected over MCP translated blind: glossary terms marked "must not translate" (brand names) could be translated anyway, locked customer-approved translations were ignored, and project tone/voice preferences never reached the model. The platform's own AI drawer has had this context injected via RAG since March; this tool closes the parity gap for third-party agents.

  v1 response:
  - `inst` — owner-configured system prompt (`project.aiSystemPrompt`).
  - `ctx` — brand description, target audience, product category, tone (formality, emotionalTone, technicalLevel, pacing, voiceCharacteristics).
  - `gl` — up to 30 approved glossary terms with `tp` (type), `d` (description, ≤120 chars), `mnt` (must-not-translate), `tr` (locked translations per language).
  - `src` / `tgt` — source + active target language codes.
  - `hint` — guidance when the project has no context configured yet.

  v2 roadmap (already accepted in the schema, ignored by v1): passing `keys: string[]` will trigger pgvector top-K RAG retrieval and add key-specific rules. v1 accepts the parameter so integrations can wire it today without a breaking change when v2 lands.

  `mcp-types`: adds `getTranslationContextInput`, `GetTranslationContextResponse`, `CompactGetTranslationContextResponse`, and exposes `getTranslationContext` on the `MCPClient` interface.

- feda450: `getTranslationContext` v2 — per-key RAG retrieval via pgvector.

  Passing `keys: string[]` (UUIDs from listKeys, max 50) now triggers per-key semantic retrieval over the project's `project_embedding` index. Each key receives its own top-K similar passages in `rules[]`, scored by cosine similarity, preserving attribution so the agent can map past-decision context back to the key it was resolving:

  ```json
  {
    "rules": [
      {
        "id": "<keyUuid>",
        "k": "auth.login.title",
        "sim": [
          {
            "tp": "translation",
            "c": "Hesabınıza giriş yapın",
            "s": 0.87,
            "l": "tr"
          },
          {
            "tp": "glossary",
            "c": "Login — sign-in action",
            "s": 0.71,
            "l": null
          }
        ]
      }
    ]
  }
  ```

  Retrieval types: `translation` (approved past pairs), `glossary` (term definitions), `preference` (user corrections to AI suggestions), `instruction` (project-level AI instructions), `content` (CMS entries). Scores below 0.5 are dropped. Content is truncated at 200 chars in the compact payload.

  `kPerKey` (1-20, default 5) caps per-key results. `languages` now also scopes RAG retrieval — language-agnostic entries (instructions, glossary definitions) are always included, language-specific entries match only the requested locales.

  Graceful degradation at every step:
  - No API key on server → `rules` omitted, hint explains.
  - Circuit breaker open (Gemini outage) → `rules` omitted, hint explains.
  - Unknown / cross-project UUIDs → silently dropped (security), remaining keys still processed, hint counts the skips.
  - No embeddings seeded → `rules: []`, hint suggests running Analyze Website.

  The v1 project-wide context (instructions, glossary, tone) always returns, even when RAG fails. Calls that omit `keys` are unchanged.

  `mcp-types`: adds `TranslationContextSimilarItem`, `TranslationContextKeyRule`, `CompactTranslationContextSimilarItem`, `CompactTranslationContextKeyRule`; extends response types with the optional `keySpecificRules` / `rules` field; input schema gains `kPerKey`.

- 51ab158: Add `setTranslations` MCP tool — a narrow-purpose write optimized for the dominant AI agent pattern: "translate N keys into M languages in one shot." Uses a key-grouped shape (`t: [{ id, t: { tr: "...", de: "..." } }]`) that is roughly 55-65% smaller than the equivalent `updateKeys` payload for N-language batches. This directly reduces LLM output tokens and fits more keys in a single tool call. `updateKeys` stays for source-text edits, status transitions, and single-language edits. Unknown UUIDs are returned in `errors[]` — never silent-created. Max 500 keys per call.

## 0.0.1

### Patch Changes

- 98dccd3: Add path collision detection to createKeys MCP tool. When creating keys that would cause leaf↔object conflicts in JSON output (e.g., "step.workspace.title" when "step.workspace" exists as a leaf), the tool now throws a CONFLICT error with detailed explanation. Also detects intra-batch collisions. Use `force: true` to override when intentional.
