---
"@better-i18n/mcp-content": minor
---

feat: accept any JSON-serializable custom field values and bump mcp-types for per-language cfv support

- Extracted shared `customFieldsSchema` with JSON string preprocess for flexible custom field input
- Updated createContentEntry, updateContentEntry, and bulkCreateEntries to use the shared schema
- Bumped `@better-i18n/mcp-types` to ^0.15.3 for per-language `customFieldValues` in translations
