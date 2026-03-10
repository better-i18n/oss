---
"@better-i18n/mcp": patch
"@better-i18n/mcp-content": patch
---

fix: normalize language codes to lowercase to prevent FK constraint violations

Language codes like `zh-Hant` and `pt-BR` are now automatically lowercased before API calls to match the database format. Affects createKeys, updateKeys, proposeLanguages, proposeLanguageEdits, publishTranslations, createContentEntry, updateContentEntry, and bulkCreateEntries tools.
