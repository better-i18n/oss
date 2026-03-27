---
"@better-i18n/mcp-content": patch
---

Improve tool descriptions to guide AI agents toward more effective usage patterns:
- All bodyMarkdown fields now warn against starting with # H1 (duplicate heading with page title)
- createContentEntry, updateContentEntry, publishContentEntry now explicitly route agents to bulk equivalents when working with 2+ entries
- bulkCreateEntries, bulkUpdateEntries, bulkPublishEntries now marked as the preferred tools with explicit "never loop single-entry tools" rules
- bulkUpdateEntries gains bodyMarkdown H1 warning and expanded workflow examples
