---
"@better-i18n/mcp-content": minor
---

- Remove `user_select` field type — use `relation` with `fieldConfig.targetModel = 'users'` instead
- `updateContentEntry` now supports metadata-only mode (3rd mode: omit languageCode and translations)
- `listContentEntries` documents built-in `users` virtual model for listing team members
- Improved `customFields` description with relation/media/enum/user field guidance
- README updated with all 17 tools (was 8)
