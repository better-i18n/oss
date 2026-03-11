---
"@better-i18n/mcp": patch
---

fix: improve MCP tool descriptions with safety guardrails to prevent AI agent misuse

- createKeys: Added namespace duplication warnings, workflow guidance (getProject first, use same namespace)
- getTranslations: Added explicit warning that status filter requires languages parameter
- updateKeys: Added step-by-step workflow for adding missing translations
- listKeys: Added pre-flight check hint for use before createKeys
