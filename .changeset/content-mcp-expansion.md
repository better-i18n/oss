---
"@better-i18n/mcp-content": minor
---

Expand Content MCP with 9 new tools and multi-language support

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
