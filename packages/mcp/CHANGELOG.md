# @better-i18n/mcp

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
