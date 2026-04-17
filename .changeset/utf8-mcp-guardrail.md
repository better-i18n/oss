---
"@better-i18n/mcp": patch
"@better-i18n/mcp-content": patch
---

Add UTF-8 character encoding guardrail to MCP server instructions. Some AI agents (Codex observed in the wild) transliterate non-ASCII characters to ASCII (e.g., "öğretmen" → "ogretmen") during JSON string serialization, silently corrupting translations. Both MCP servers now prominently instruct agents to send non-ASCII characters as-is or use Unicode escape sequences, and mark transliteration as a client-side bug to fix. Also adds server-level instructions to `@better-i18n/mcp` (previously had none), including the phantom-keys incident guardrail (always `listKeys` before `createKeys`).
