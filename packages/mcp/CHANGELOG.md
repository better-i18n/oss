# @better-i18n/mcp

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
