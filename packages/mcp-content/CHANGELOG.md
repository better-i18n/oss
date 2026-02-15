# @better-i18n/mcp-content

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
