---
"@better-i18n/mcp-content": minor
---

feat: Add enum field options support to MCP content tools

- `addField` and `updateField` now accept `options.enumValues` for defining enum choices (label + value pairs)
- `createContentModel` field definitions support `options.enumValues` for inline enum setup
- Updated README with field types reference table and enum usage examples
