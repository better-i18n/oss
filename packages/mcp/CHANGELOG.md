# @better-i18n/mcp

## 0.21.2

### Patch Changes

- b6ca650: Replace the leftover Helpway-shaped logo on the OAuth callback page with the actual Better i18n mark, theme-aware via `currentColor`.

## 0.21.1

### Patch Changes

- f11df3b: Fix EADDRINUSE crash when the OAuth loopback port is busy.

  The bridge now (a) defaults to port 8989 (distinct from @helpway/mcp so users running both bridges don't collide) and (b) probes the next 16 ports if the preferred one is occupied, reflecting the actual bound port in the OAuth redirect_uri. Set `BETTER_I18N_OAUTH_PORT` to pin a specific port.

  Reference incident: stale Node process holding 8976 caused the bridge to crash with `EADDRINUSE` before opening the browser; Claude Code timed out the MCP server connect.

## 0.21.0

### Minor Changes

- 7916612: Add OAuth 2.1 browser login to the stdio bridge — connect without an API key.

  `npx @better-i18n/mcp` now opens your browser to sign in to Better i18n on first run and caches tokens in `~/.better-i18n` (refreshed automatically). `BETTER_I18N_API_KEY=bi-…` still works for headless use (CI, scripts). The bridge proxies to the remote MCP endpoint and forwards the tool catalog from the server, so new tools ship on an API deploy without an npm release.

## 0.20.0

### Minor Changes

- 646d67f: Add phantom key detection to listKeys + createKeys responses.

  `listKeys` now includes `p: true` on rows that are legacy duplicates with
  namespace_id=NULL whose key contains the full namespace path while a proper
  namespaced row exists. These shadow proper rows in CDN file generation
  (BETTER-260). Recommended action: call `deleteKeys` with the row's `id`,
  then `publishTranslations` to clean the CDN.

  `createKeys` now returns phantom warnings in its `warnings[]` array when a
  legacy phantom row exists for a key being created. Each warning carries the
  phantom's UUID and a deleteKeys hint.

## 0.19.1

### Patch Changes

- 7123bc3: getProject CDN response now includes fileStructure (fs) and keyFormat (kf) fields, enabling agents to distinguish single-file vs namespace-split delivery and construct correct CDN URLs

## 0.19.0

### Minor Changes

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

### Patch Changes

- d5f2beb: Add UTF-8 character encoding guardrail to MCP server instructions. Some AI agents (Codex observed in the wild) transliterate non-ASCII characters to ASCII (e.g., "öğretmen" → "ogretmen") during JSON string serialization, silently corrupting translations. Both MCP servers now prominently instruct agents to send non-ASCII characters as-is or use Unicode escape sequences, and mark transliteration as a client-side bug to fix. Also adds server-level instructions to `@better-i18n/mcp` (previously had none), including the phantom-keys incident guardrail (always `listKeys` before `createKeys`).

## 0.18.0

### Minor Changes

- a71f3b7: Surface project JSON format info in `listProjects` so AI agents can predict CDN shape and avoid leaf/object collisions.
  - New per-project fields: `fileStructure` (`"single_file"` | `"namespaced_folders"`) and `keyFormat` (`"flat"` | `"nested"`).
  - Response shape simplified: `cdnBaseUrl` is now returned once at the top level instead of duplicating a per-project `cdnFormat` URL template. Agents build URLs as `${cdnBaseUrl}/${slug}/${locale}/${ns}.json` (use `"translations"` as the `ns` literal for `single_file` projects).
  - Removed redundant per-project `organizationName` (derivable from `slug`).
  - Tool description updated to document the new response shape and warn about nested JSON parent-path collisions.

## 0.17.0

### Minor Changes

- 98dccd3: Add path collision detection to createKeys MCP tool. When creating keys that would cause leaf↔object conflicts in JSON output (e.g., "step.workspace.title" when "step.workspace" exists as a leaf), the tool now throws a CONFLICT error with detailed explanation. Also detects intra-batch collisions. Use `force: true` to override when intentional.

## 0.16.0

### Minor Changes

- beedc96: Add contextual hints to MCP tool responses for smarter AI agent decisions
  - All write tools (`createKeys`, `updateKeys`, `deleteKeys`, language tools) now include `hint` field explaining ambiguous results (empty responses, partial failures, skipped items)
  - `deleteKeys` now includes `pendingPublish` reminder — previously missing unlike `createKeys`/`updateKeys`
  - `proposeLanguages` and `proposeLanguageEdits` no longer drop `pendingPublish` from API response (bug fix)
  - `proposeLanguageEdits` adds hints for not-found language codes and no-op status updates
  - `getPendingChanges` includes `recentActivity` (last 3 sync/publish jobs with IDs) and contextual hints
  - `getSyncs` explains empty results when filters are applied
  - `getSync` provides recovery guidance for failed syncs and polling guidance for in-progress syncs

## 0.15.6

### Patch Changes

- d2bdbe7: fix: resolve mcp-types dependency error (0.0.0 not found on npm)

## 0.15.5

### Patch Changes

- e92ff9d: Improve MCP tool descriptions with workflow rules, safety warnings, and silent behavior documentation for better AI agent guidance

## 0.15.4

### Patch Changes

- 2c4c1a7: Rename translation status enum value "approved" → "published" to align with platform terminology

## 0.15.3

### Patch Changes

- 15d7785: fix: improve MCP tool descriptions with safety guardrails to prevent AI agent misuse
  - createKeys: Added namespace duplication warnings, workflow guidance (getProject first, use same namespace)
  - getTranslations: Added explicit warning that status filter requires languages parameter
  - updateKeys: Added step-by-step workflow for adding missing translations
  - listKeys: Added pre-flight check hint for use before createKeys

## 0.15.2

### Patch Changes

- feat: surface version update warning in tool responses for AI model visibility

  The update notification is now injected into the first tool call response so that AI models (Claude, ChatGPT, etc.) can read it and inform the user. Previously, warnings were only sent via MCP logging messages and stderr, which most clients don't surface to users.

## 0.15.1

### Patch Changes

- c907b9e: fix: normalize language codes to lowercase to prevent FK constraint violations

  Language codes like `zh-Hant` and `pt-BR` are now automatically lowercased before API calls to match the database format. Affects createKeys, updateKeys, proposeLanguages, proposeLanguageEdits, publishTranslations, createContentEntry, updateContentEntry, and bulkCreateEntries tools.

## 0.15.0

### Minor Changes

- 91bd5e0: Add `fields` parameter to `listKeys` tool for token-efficient coverage queries.

  **New parameter:** `fields` — controls which fields are returned per key.
  - `"translatedLanguageCount"` (`tlc`) — returns count as integer instead of full array. Significantly reduces tokens for large projects.
  - `"translatedLanguages"` (`tl`) — full list of translated language codes (existing behavior, now opt-in)
  - `"translations"` (`tr`) — actual translation text
  - `"id"`, `"sourceText"` — included by default

  **Default changed:** Fields default is now `["id", "sourceText"]` — `translatedLanguages` must be requested explicitly.

  **Example:**

  ```json
  { "project": "org/project", "fields": ["id", "translatedLanguageCount"] }
  ```

  Bumps `@better-i18n/mcp-types` to `^0.11.0`.

## 0.14.0

### Minor Changes

- 675ad63: - Replace `addLanguage` tool with `proposeLanguages` and `proposeLanguageEdits`
  - `proposeLanguages`: Batch-add up to 50 target languages with optional status (active/draft)
  - `proposeLanguageEdits`: Batch-update language statuses (active/draft/archived)

## 0.13.0

### Minor Changes

- 9620847: feat(getTranslations): Remove `limit: 0` ("fetch all") and add pagination metadata

  **Breaking change:** `limit: 0` is no longer accepted. Valid range is now `1–200`.
  This prevents token-limit crashes (e.g., 10K+ keys = 4M chars = exceeds 1M token limit).

  **New response fields:**
  - `returned`: number of keys in this response (after all filters)
  - `total`: total keys in DB matching namespace/search/key filters (before in-memory status filter)
  - `hasMore`: `true` when `total > limit` — use narrower filters to get specific keys

  **Example response:**

  ```json
  {
    "returned": 100,
    "total": 10483,
    "hasMore": true,
    "keys": [...]
  }
  ```

  **Migration:** Replace `limit: 0` with targeted filters — use `namespaces`, `search`, `keys[]`,
  or `status: "missing"` to narrow results instead of fetching everything.

### Patch Changes

- 9620847: fix(updateKeys): Use `id` (UUID) instead of deprecated `k`/`ns` fields

  The `updateKeys` tool was sending `k` (key name) and `ns` (namespace) fields to the API, but the API requires `id` (UUID) since v0.8. This caused a `BAD_REQUEST: id Required` validation error.

  **Breaking change for `updateKeys` tool users:** You must now provide `id` (UUID) instead of `k`/`ns`. Get the UUID from `getAllTranslations` or `listKeys` response first.

  **Before (broken):**

  ```json
  { "t": [{ "k": "auth.login.title", "ns": "auth", "l": "tr", "t": "Giriş" }] }
  ```

  **After (correct):**

  ```json
  {
    "t": [
      { "id": "550e8400-e29b-41d4-a716-446655440000", "l": "tr", "t": "Giriş" }
    ]
  }
  ```

## 0.12.0

### Minor Changes

- 55c14a8: Add `getTranslations` tool and fix `listKeys` to use compact paginated endpoint.
  - Fix `listKeys` to call `mcp.listKeys` endpoint instead of `mcp.getAllTranslations`. Response now uses compact format with pagination (`tot`, `ret`, `has_more`, `nss` namespace lookup table).
  - Add new `getTranslations` tool that preserves the previous full-text retrieval behavior for AI translation workflows (search by source/target text, filter by language/status/keys).
  - `listKeys` is now for browsing and exploration; `getTranslations` is for reading/updating translation text.
  - Bump `@better-i18n/mcp-types` dependency to `^0.8.0`.

## 0.11.1

### Patch Changes

- d2b320b: Fix npx executable resolution by removing duplicate HTTP bin entry. Having multiple bin entries caused `npx @better-i18n/mcp` to fail with "could not determine executable to run" on npm v10+. HTTP transport is still available via `node dist/http.js`.

## 0.11.0

### Minor Changes

- 70b1694: Upgrade to @better-i18n/mcp-types@0.6.0 with compact response format for read endpoints

  **Breaking: Compact response format**

  Read endpoints now return compact field names for efficient AI communication:
  - `getProject` → `{ prj, sl, nss, lng, tk, cov }`
  - `getSyncs` → `{ prj, tot, sy }`
  - `getSync` → `{ id, tp, st, st_at, cp_at, log, aff_k }`
  - `getPendingChanges` → `{ prj, has_chg, sum, by_lng, del_k }`

  Write endpoints (`createKeys`, `updateKeys`, `deleteKeys`, `publishTranslations`) remain verbose.

  **listKeys: multi-term search**
  - `search` parameter now accepts `string | string[]` for OR-based multi-term search

  **Other changes:**
  - Removed `approveTranslations` tool — use `updateKeys` with `status` parameter instead
  - Updated README with all 11 tools and compact field legend

- 730ec22: Split content tools into separate `@better-i18n/mcp-content` package. The translation MCP server now contains 11 focused translation tools. Content management tools (8 tools) are available via `@better-i18n/mcp-content`.

## 0.9.0

### Minor Changes

- Upgrade `@better-i18n/mcp-types` from `^0.5.1` to `^0.6.0` for compact response format support.

  **Breaking: Compact response format for read endpoints**

  Read endpoints now return compact field names for efficient AI communication:
  - `getProject` → `{ prj, sl, nss, lng, tk, cov }` (was `{ project, sourceLanguage, ... }`)
  - `getSyncs` → `{ prj, tot, sy }` (was `{ project, total, syncs }`)
  - `getSync` → `{ id, tp, st, st_at, cp_at, log, aff_k }` (was `{ id, type, status, ... }`)
  - `getPendingChanges` → `{ prj, has_chg, sum, by_lng, del_k }` (was `{ project, hasPendingChanges, ... }`)

  Write endpoints (`createKeys`, `updateKeys`, `deleteKeys`, `publishTranslations`) remain verbose.

  **listKeys: multi-term search**
  - `search` parameter now accepts `string | string[]` for OR-based multi-term search
  - Example: `{ search: ["login", "signup", "forgot_password"] }`

  **README update**
  - Added all 11 tools to Available Tools table (was missing 5)
  - Added Compact Response Format field legend
  - Added publish workflow example prompts

### Dependencies

- @better-i18n/mcp-types@0.6.0

## 0.8.1

### Patch Changes

- 1a5b18a: Remove redundant approveTranslations tool and update to mcp-types@0.5.1

  **Breaking Changes:**
  - Removed `approveTranslations` tool - use `updateKeys` with `status` parameter instead

  **Updates:**
  - Updated `@better-i18n/mcp-types` to 0.5.1 which includes `publishTranslations` rename
  - Tool now properly supports the renamed `publishTranslations` endpoint (was `publish`)

  **Migration Guide:**
  Instead of using `approveTranslations`, use `updateKeys` to change translation status:

  ```json
  {
    "translations": [
      {
        "key": "auth.login.title",
        "language": "tr",
        "text": "Giriş Yap",
        "status": "approved"
      }
    ]
  }
  ```

  The `updateKeys` tool is more flexible and supports any status change, not just draft→approved.

## 0.8.0

### Minor Changes

- Add getPendingChanges and publish MCP tools. Remove duplicate getAllTranslations tool (listKeys already provides this functionality). Update getSyncs to use batch_publish instead of publish_batch. Upgrade to @better-i18n/mcp-types@0.5.0 for full type safety without type assertions.

  New tools:
  - getPendingChanges: Preview pending changes before publishing
  - publish: Deploy translations to production (CDN/GitHub)

  Breaking changes:
  - Removed getAllTranslations tool (use listKeys instead)
  - getSyncs now uses "batch_publish" instead of "publish_batch" for type filter

## 0.6.0

### Minor Changes

- 26b8233: Add namespace context support and rich namespace metadata
  - `createKeys` and `updateKeys` now accept optional `namespaceContext` per item (`description`, `team`, `domain`, `aiPrompt`, `tags`)
  - Mapped to compact `nc` field in API payload; backend groups by namespace and applies after key resolve
  - `getProject` response now includes rich namespace objects with `keyCount`, `description`, and `context`
  - `listKeys` response now includes `namespaceDetails` map for all namespaces in result
  - Updated `@better-i18n/mcp-types` to `^0.4.0`

## 0.5.0

### Minor Changes

- Namespace context support for `createKeys` and `updateKeys`
  - Both tools now accept optional `namespaceContext` per item: `{ description, team, domain, aiPrompt, tags }`
  - Mapped to compact `nc` field in API payload
  - Backend groups by namespace and applies context after key resolve (last context wins per namespace)
- Rich namespace metadata in read endpoints
  - `getProject` now returns namespaces as rich objects: `{ name, keyCount, description, context }`
  - `listKeys` response now includes `namespaceDetails` map with metadata for all namespaces in the result
- Updated tool descriptions to reflect new response shapes

### Dependencies

- @better-i18n/mcp-types@0.4.0

## 0.4.1

### Patch Changes

- Add @better-i18n/mcp-types package for type-safe MCP API client
  - New package with Zod schemas and TypeScript types for MCP API
  - Defines contract between platform API and MCP client
  - Updates MCP package to use typed APIClient interface

- Updated dependencies
  - @better-i18n/mcp-types@0.2.0

## 0.4.0

### Minor Changes

- 279944f: Enhanced listKeys tool with full-text search and advanced filtering.

  New parameters:
  - `languages`: Search in specific language translations AND filter returned translations (e.g., `["tr", "de"]`)
  - `keys`: Fetch specific keys by exact name
  - `status`: Filter by translation status (`missing`, `draft`, `approved`, `all`)

  Search behavior:
  - `search` alone: searches in source text
  - `search` + `languages: ["tr"]`: searches in Turkish translations
  - `search` + `languages: ["en", "tr"]`: searches in both source text and Turkish translations

  Response now includes `translation.id` for each translation entry.

- 3f26b3f: Added multi-term search support to `listKeys` and `getTranslations` tools.

  The `search` parameter now accepts both a single string and an array of strings, enabling AI agents to search for multiple terms in a single request.

  Examples:
  - Single term: `{ "search": "login" }`
  - Multi-term: `{ "search": ["login", "signup", "forgot_password"] }`

  Multi-term search uses OR matching — results include keys matching any of the provided terms.

## 0.3.0

### Minor Changes

- Readable tool schemas for `createKeys` and `updateKeys`
  - `createKeys` now accepts `keys: [{ name, namespace, sourceText, translations }]` instead of compact `k: [{ n, ns, v, t }]`
  - `updateKeys` now accepts `translations: [{ key, namespace, language, text, isSource, status }]` instead of compact `t: [{ k, ns, l, t, s, st }]`
  - MCP tools map readable input → compact API payload internally
  - API backend remains unchanged (compact format)

### Patch Changes

- Fix translations created via MCP defaulting to "draft" status
  - `createKeys` and `updateKeys` now default translation status to `"approved"` instead of `"pending"`
  - MCP operations are explicit user actions and should be approved by default

## 0.2.0

### Minor Changes

- Compact tool schemas and source text updates
  - All tool input schemas now use compact format matching the API directly (no mapping layer)
  - Added `deleteKeys` tool for soft-deleting translation keys by UUID
  - `updateKeys` now supports source text updates via `s: true` flag
  - Stripped field-level descriptions from all tool schemas (tool description carries context)
  - Standardized all tools to use `executeTool`/`executeSimpleTool` helpers

## 0.1.0

### Minor Changes

- 8feee74: Add deleteKeys tool to MCP server. AI assistants can now soft-delete translation keys by providing key UUIDs. Keys are marked for deletion and permanently removed on the next publish.
