# @better-i18n/sdk

## 0.2.0

### Minor Changes

- de74aac: Remove translations/CDN client from SDK - SDK is now content-only

  Breaking: Removed `./content` and `./translations` export paths, removed `TranslationsClient`, `TranslationManifest`, `BetterI18nClient` types, removed `cdnBase` from config. `createClient()` now returns `ContentClient` directly with flat API (`client.getModels()` instead of `client.content.getModels()`).

## 0.1.1

### Patch Changes

- 52e1100: Initial release of `@better-i18n/sdk` — TypeScript SDK for fetching translations and content from Better i18n. Supports CDN mode (no API key, published content only) and API mode (full access with API key).
