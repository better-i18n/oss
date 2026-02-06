# @better-i18n/mcp

## 0.10.0

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
