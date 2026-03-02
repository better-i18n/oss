---
"@better-i18n/mcp-content": patch
---

Improve MCP tool descriptions for source language awareness and localized custom field values

- createContentEntry: Add source language guidance (check getProject 'sl' field), non-English example, clarify title/customFields are stored in source language
- updateContentEntry: Document metadata-only mode behavior for localized customFields, clarify source language auto-resolution
- getContentEntry: Document response structure for per-language custom field values (cfv, tr.{lang}.cfv)
