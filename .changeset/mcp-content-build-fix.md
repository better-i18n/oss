---
"@better-i18n/mcp-content": patch
---

Fix build error caused by `excerpt` and other fields missing from `@better-i18n/mcp-types` input types

Use spread pattern with type assertion to forward all validated input fields to tRPC client,
making the MCP tool layer forward-compatible with future `mcp-types` schema additions.
