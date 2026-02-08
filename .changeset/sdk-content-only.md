---
"@better-i18n/sdk": minor
---

Remove translations/CDN client from SDK - SDK is now content-only

Breaking: Removed `./content` and `./translations` export paths, removed `TranslationsClient`, `TranslationManifest`, `BetterI18nClient` types, removed `cdnBase` from config. `createClient()` now returns `ContentClient` directly with flat API (`client.getModels()` instead of `client.content.getModels()`).
