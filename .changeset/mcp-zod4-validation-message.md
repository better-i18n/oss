---
"@better-i18n/mcp": patch
"@better-i18n/mcp-content": patch
---

Read validation messages from `ZodError.issues`. zod 4 removed `.errors`, so the packages no longer type-checked after the zod 4 upgrade. The block catalog tools in mcp-content are now typed on the client too.
