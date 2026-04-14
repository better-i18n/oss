---
"@better-i18n/mcp-content": patch
---

Warn AI agents when `bodyMarkdown` starts with a `# H1` heading. The entry title is already rendered as the page H1 — a duplicate heading degrades SEO and accessibility. The warning is returned in create, update, bulkCreate, and bulkUpdate responses.
