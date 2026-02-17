# @better-i18n/sdk

## 1.1.0

### Minor Changes

- 4d1eb95: Add `expand` parameter to content entry queries for expanding relation fields.
  Add `relations` field to entry responses with expanded relation data.

## 1.0.1

### Patch Changes

- 2744ff9: Ship compiled JavaScript instead of raw TypeScript source files. Packages now export pre-built `dist/` files with proper `.js`, `.d.ts`, and source maps — eliminating the need for `transpilePackages` workarounds in consumer projects.

## 1.0.0

### Major Changes

- **BREAKING CHANGE: Migrate to dedicated Content API**

  The SDK now uses the new dedicated Content API at `content.better-i18n.com` instead of `dash.better-i18n.com/api/v1/content`.

  ### What Changed
  - **Default API Base**: `https://content.better-i18n.com` (was `https://dash.better-i18n.com`)
  - **URL Path**: `/v1/content` (was `/api/v1/content`)
  - **CORS Support**: Wildcard origin enabled for public access
  - **Performance**: CDN caching with 60s cache + 1h stale-while-revalidate

  ### Migration Guide

  **For users without custom `apiBase`:**
  No action required. SDK will automatically use the new endpoint.

  **For users with custom `apiBase`:**

  ```typescript
  // Before
  const client = createClient({
    project: "acme/web-app",
    apiKey: "bi18n_...",
    apiBase: "https://dash.better-i18n.com", // Old endpoint
  });

  // After
  const client = createClient({
    project: "acme/web-app",
    apiKey: "bi18n_...",
    apiBase: "https://content.better-i18n.com", // New endpoint
  });
  ```

  ### Benefits
  - ✅ **Proper CORS** - No more CORS errors in browser
  - ✅ **Better Performance** - CDN caching for faster responses
  - ✅ **Clean URLs** - Professional API endpoint
  - ✅ **Independent Scaling** - Dedicated infrastructure

  ### Backward Compatibility

  The old endpoint at `dash.better-i18n.com/api/v1/content` will remain operational during a transition period. However, we recommend migrating to the new endpoint as soon as possible.

  To temporarily use the old endpoint:

  ```typescript
  const client = createClient({
    project: "acme/web-app",
    apiKey: "bi18n_...",
    apiBase: "https://dash.better-i18n.com",
  });
  ```

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
