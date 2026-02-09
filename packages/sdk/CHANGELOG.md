# @better-i18n/sdk

## 0.4.0

### Minor Changes

- Simplify client config to single `project` identifier
  - **Single project param**: Replace separate `org` + `project` with single `project: "org/project"` format, matching the dashboard URL path
  - **Debug mode**: Add `debug` option to log all request URLs, status codes, and response bodies
  - **Fix API base URL**: Default to `https://dash.better-i18n.com` instead of non-existent `api.better-i18n.com`
  - **Body type fix**: Change `body` type from `unknown` to `Record<string, any> | null` for TanStack Start serialization compatibility

## 0.3.0

### Minor Changes

- 618b1d0: Add generic custom fields, status filter, sort/order, and pagination metadata to Content SDK
  - `ContentEntry<CF>` generic type parameter for typed custom fields
  - `status` filter option (`draft`, `published`, `archived`)
  - `sort` and `order` options for listing entries
  - `PaginatedResponse<T>` wrapper with `items`, `total`, `hasMore`
  - New exported types: `ContentEntryStatus`, `ContentEntrySortField`, `PaginatedResponse`

## 0.2.0

### Minor Changes

- de74aac: Remove translations/CDN client from SDK - SDK is now content-only

  Breaking: Removed `./content` and `./translations` export paths, removed `TranslationsClient`, `TranslationManifest`, `BetterI18nClient` types, removed `cdnBase` from config. `createClient()` now returns `ContentClient` directly with flat API (`client.getModels()` instead of `client.content.getModels()`).

## 0.1.1

### Patch Changes

- 52e1100: Initial release of `@better-i18n/sdk` — TypeScript SDK for fetching translations and content from Better i18n. Supports CDN mode (no API key, published content only) and API mode (full access with API key).
