# @better-i18n/mcp-content

## 0.5.3

### Patch Changes

- fa26401: Fix build error caused by `excerpt` and other fields missing from `@better-i18n/mcp-types` input types

  Use spread pattern with type assertion to forward all validated input fields to tRPC client,
  making the MCP tool layer forward-compatible with future `mcp-types` schema additions.

## 0.5.2

### Patch Changes

- 4f8042a: Add expand parameter support and bump mcp-types dependency
  - Bump @better-i18n/mcp-types to ^0.13.0 (fixes relation field type, adds expand support)
  - Add `expand` parameter to getContentEntry and listContentEntries tools
  - Enables MCP agents to resolve relation fields (e.g., author, category) with full entry data

## 0.5.1

### Patch Changes

- d94f4cd: Improve MCP tool descriptions for source language awareness and localized custom field values
  - createContentEntry: Add source language guidance (check getProject 'sl' field), non-English example, clarify title/customFields are stored in source language
  - updateContentEntry: Document metadata-only mode behavior for localized customFields, clarify source language auto-resolution
  - getContentEntry: Document response structure for per-language custom field values (cfv, tr.{lang}.cfv)

## 0.5.0

### Minor Changes

- f7005be: feat: Add showInTable field option and tableSettings model parameter
  - addField/updateField: new `showInTable` boolean in field options
  - updateContentModel: new `tableSettings` parameter for base field column visibility

## 0.4.0

### Minor Changes

- cb2495a: feat: Add enum field options support to MCP content tools
  - `addField` and `updateField` now accept `options.enumValues` for defining enum choices (label + value pairs)
  - `createContentModel` field definitions support `options.enumValues` for inline enum setup
  - Updated README with field types reference table and enum usage examples

## 0.3.0

### Minor Changes

- 675ad63: - Remove `user_select` field type — use `relation` with `fieldConfig.targetModel = 'users'` instead
  - `updateContentEntry` now supports metadata-only mode (3rd mode: omit languageCode and translations)
  - `listContentEntries` documents built-in `users` virtual model for listing team members
  - Improved `customFields` description with relation/media/enum/user field guidance
  - README updated with all 17 tools (was 8)

## 0.2.0

### Minor Changes

- 4d1eb95: Add `expand` parameter to content entry queries for expanding relation fields.
  Add `relations` field to entry responses with expanded relation data.
- 4d1eb95: Add `relation` field type for linking entries across content models (belongs_to).
  Add generic `fieldConfig` object to field definitions for type-specific configuration.

## 0.1.0

### Minor Changes

- 101fd86: Expand Content MCP with 9 new tools and multi-language support

  **New Tools (9):**
  - `createContentModel` - Create content models with field definitions
  - `updateContentModel` - Update model metadata
  - `deleteContentModel` - Delete model and all related data (destructive)
  - `addField` - Add custom field to a model
  - `updateField` - Update field properties
  - `removeField` - Remove field and all values (destructive)
  - `reorderFields` - Reorder fields within a model
  - `bulkPublishEntries` - Publish multiple entries at once
  - `duplicateContentEntry` - Deep-copy entry with all translations

  **Updated Tools (3):**
  - `createContentEntry` - Added `translations` param for multi-language creation in single request
  - `updateContentEntry` - Added `translations` param + made `languageCode` optional for multi-language updates
  - `listContentEntries` - Added `missingLanguage` filter

  **Removed:**
  - `generateFieldContent` - AI generates content natively, no dedicated tool needed

  Total tools: 8 → 17

## 0.0.4

### Patch Changes

- f11cbbe: Initial publish of MCP Content server for headless CMS content management

## 0.0.3

### Patch Changes

- 80afe51: Initial publish of MCP Content server for headless CMS content management

## 0.0.2

### Patch Changes

- d2b320b: Fix npx executable resolution by removing duplicate HTTP bin entry. Having multiple bin entries caused `npx @better-i18n/mcp` to fail with "could not determine executable to run" on npm v10+. HTTP transport is still available via `node dist/http.js`.
