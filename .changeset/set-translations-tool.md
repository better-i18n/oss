---
"@better-i18n/mcp": minor
"@better-i18n/mcp-types": patch
---

Add `setTranslations` MCP tool — a narrow-purpose write optimized for the dominant AI agent pattern: "translate N keys into M languages in one shot." Uses a key-grouped shape (`t: [{ id, t: { tr: "...", de: "..." } }]`) that is roughly 55-65% smaller than the equivalent `updateKeys` payload for N-language batches. This directly reduces LLM output tokens and fits more keys in a single tool call. `updateKeys` stays for source-text edits, status transitions, and single-language edits. Unknown UUIDs are returned in `errors[]` — never silent-created. Max 500 keys per call.
