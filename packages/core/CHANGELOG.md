# @better-i18n/core

## 0.2.2

### Patch Changes

- f3403e1: fix: add .js extensions to relative imports for Node.js ESM compatibility

## 0.2.1

### Patch Changes

- 12210eb: fix(expo): offline cache fallback + Metro storage resolution

  ### Offline fallback (helpers.ts)

  `Promise.all` içinde `core.getLanguages()` (manifest fetch) offline'da throw edince tüm init iptal oluyordu — MMKV cache'deki çeviriler hiç yüklenmiyordu.

  ```ts
  // Before: getLanguages() throw → Promise.all → init cancelled
  core.getLanguages();

  // After: offline'da boş array döner, çeviriler MMKV'den yüklenir
  core.getLanguages().catch(() => [] as LanguageOption[]);
  ```

  ### Metro storage resolution (storage.ts)

  `require("react-native-mmkv")` Metro stub bazı versiyonlarda try/catch'i bypass edip "Requiring unknown module" hatasına yol açıyordu. `import()` ile Promise-tabanlı hata yakalamaya geçildi.

  ```ts
  // Before: senkron require → Metro stub try/catch bypass
  const { MMKV } = require("react-native-mmkv");

  // After: async import → her zaman catch edilebilir
  const { MMKV } = await import("react-native-mmkv");
  ```

  `@react-native-async-storage/async-storage` ve `react-native-mmkv`'nin **ikisi de yüklü olmadığında** artık `createMemoryStorage()` fallback'ine düşer.

  ### react-native export condition (package.json)

  Metro 0.82+ varsayılan condition listesi `['require', 'react-native']` — eksik `"react-native"` export koşulu bazı Metro versiyonlarında modül resolution belirsizliğine neden oluyordu.

## 0.2.0

### Minor Changes

- 5fd34e0: feat: BCP 47 sub-locale normalization for CDN compatibility
  - Normalize sub-locale tags to lowercase before CDN manifest and message fetches (`pt-BR` → `pt-br`, `zh_TW` → `zh-tw`)
  - Apply `normalizeLocale()` in `cdn.ts` prior to cache key construction and fetch
  - Normalize locale values in `detection.ts` locale matching so Accept-Language headers resolve correctly against manifest
  - Export 7 locale utility helpers from `utils/locale.ts` via `index.ts`: `normalizeLocale`, `extractLocale`, `getLocaleFromPath`, `hasLocalePrefix`, `removeLocalePrefix`, `addLocalePrefix`, `replaceLocaleInPath`, `createLocalePath`

## 0.1.10

### Patch Changes

- fix: Normalize locale to lowercase for CDN compatibility (BCP 47 sub-locale fix)

## 0.1.9

### Patch Changes

- 3836f94: Add CDN fallback chain with storage and staticData support
  - 3-tier fallback: CDN → persistent storage → static data → throw
  - AbortController-based fetch timeout (default 10s)
  - Exponential backoff retry (default 1 retry)
  - New storage adapters: localStorage, memory, auto-detect
  - Fire-and-forget write-through to storage on CDN success
  - New exports: createAutoStorage, createLocalStorage, createMemoryStorage
  - No breaking changes — all new fields are optional

## 0.1.8

### Patch Changes

- Fix package entry points to resolve from dist/ instead of missing src/

  Root-level main/types/exports now point to dist/ directly. Added "bun" conditional export for monorepo development.

## 0.1.7

### Patch Changes

- 043c5f4: Add `@better-i18n/expo` - i18next backend plugin for Expo/React Native with offline caching

  **@better-i18n/expo:**
  - i18next `BackendModule` with network-first strategy (always fresh translations)
  - Persistent offline fallback via MMKV or AsyncStorage (auto-detected, zero config)
  - Device locale detection via expo-localization
  - `initBetterI18n()` convenience helper for one-liner setup

  **@better-i18n/core:**
  - Add `Cache-Control: no-cache` header to CDN fetch requests for proper cache revalidation

- 1f45586: Fix broken package entry points — `main`/`exports` now point to `dist/` directly

  `bun publish` does not apply `publishConfig` overrides, causing `main: "./src/index.ts"` to be published while `src/` is not included in the tarball. This broke Metro (React Native) and any bundler that doesn't fall back to `publishConfig`.
  - Root-level `main`/`types` now point to `./dist/index.js` and `./dist/index.d.ts`
  - Added `"bun"` conditional export for monorepo dev (`./src/index.ts`)
  - Removed broken `publishConfig` field overrides (kept `access: "public"` only)

## 0.1.6

### Patch Changes

- c5c914a: feat: Clerk-style middleware callback pattern for better auth integration

  **New Clerk-style API:**
  - `createBetterI18nMiddleware` now accepts an optional callback as second argument
  - Callback receives `{ locale, response }` context, allowing auth logic with full locale access
  - Return `NextResponse` from callback to short-circuit (e.g., redirect to login)
  - Return `void` to continue with i18n response (headers preserved!)

  ```typescript
  export default createBetterI18nMiddleware(
    config,
    async (req, { locale, response }) => {
      if (needsLogin) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
      }
      // Return nothing = i18n response is used automatically
    },
  );
  ```

  **Deprecation:**
  - `composeMiddleware` is now deprecated (shows warning in development)
  - Migrate to the callback pattern for reliable header preservation

  **Other improvements:**
  - Adds `localePrefix` option to `I18nMiddlewareConfig`
  - Sets `x-middleware-request-x-next-intl-locale` header for full next-intl compatibility
  - Exports new `MiddlewareContext` and `MiddlewareCallback` types

## 0.1.5

### Patch Changes

- fix: add next-intl middleware compatibility for `getRequestConfig({ requestLocale })`
  - `createBetterI18nMiddleware` now delegates to next-intl's `createMiddleware` internally
  - Adds `localePrefix` option to `I18nMiddlewareConfig` (supports "as-needed", "always", "never")
  - Sets `x-middleware-request-x-next-intl-locale` header required by next-intl's `requestLocale`
  - Maintains backwards compatibility with `x-locale` header
  - Caches middleware instance for performance (recreates only when locales change)

## 0.1.4

### Patch Changes

- 2d400f0: Fix: Ensure packages are built before publishing
  - Added `prepublishOnly` hook to `@better-i18n/core` to build dist before publish
  - Fixed `@better-i18n/use-intl` to publish source files (consistent with `@better-i18n/next`)

## 0.1.3

### Patch Changes

- 76855e2: Fix: Remove private workspace dependency from devDependencies

  Removed `@better-i18n/typescript-config: workspace:*` from devDependencies. This was causing installation failures for consumers because the private package doesn't exist on npm and `workspace:*` couldn't be resolved during publish.

## 0.1.2

### Patch Changes

- 1488817: Internal/core architecture update and middleware improvements. Moved glossary and encryption to internal package. Improved Next.js and TanStack Start middleware composability.
