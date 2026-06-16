---
"@better-i18n/mcp-content": minor
---

Support `fieldConfig.multiple` for multi-valued relation fields. `addField`, `updateField`, and `createContentModel` now accept `multiple` in their `fieldConfig` schema (and advertise it in the tool JSON-Schema), so a relation can be created/updated as multi-valued via MCP. Previously the inline schemas only accepted `targetModel`, silently stripping `multiple` and creating single relations even though the platform API already supported it.
