---
"@better-i18n/mcp-content": patch
---

Add expand parameter support and bump mcp-types dependency

- Bump @better-i18n/mcp-types to ^0.13.0 (fixes relation field type, adds expand support)
- Add `expand` parameter to getContentEntry and listContentEntries tools
- Enables MCP agents to resolve relation fields (e.g., author, category) with full entry data
