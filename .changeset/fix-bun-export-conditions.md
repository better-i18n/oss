---
"@better-i18n/core": patch
"@better-i18n/next": patch
"@better-i18n/server": patch
"@better-i18n/remix": patch
"@better-i18n/expo": patch
"@better-i18n/sdk": patch
"@better-i18n/schemas": patch
"@better-i18n/vite": patch
"@better-i18n/use-intl": patch
---

Remove "bun" export conditions that referenced unpublished src/ files

All packages had `"bun": "./src/*.ts"` conditions in their exports map, but `src/` is not included in the npm package (`files: ["dist"]`). Bun runtime resolves the "bun" condition before "default", causing module resolution failures for customers using Bun to build their apps.
