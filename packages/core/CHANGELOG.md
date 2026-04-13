# @better-i18n/core

## 0.8.0

### Minor Changes

- b8958fc: Add selective namespace loading and CDN compression support
  - `getMessages(locale, { namespaces: ['common', 'nav'] })` — fetches only specified namespaces from CDN (v2 projects only; v1 single-file projects silently ignore the option)
  - Namespace-aware cache keys prevent selective fetches from polluting full-fetch cache
  - `Accept-Encoding: gzip, br` on all CDN requests — reduces manifest 477KB → 26KB (94%) and translation files proportionally
  - Split `manifestCacheTtlMs` and `messagesCacheTtlMs` in dev: manifest caches 30s (rarely changes), messages cache 0ms (always fresh). Both default to 5min in production
  - New `messagesCacheTtlMs` field in `NormalizedConfig` for runtime inspection

## 0.7.0

### Minor Changes

- 0407289: Standardize locale cookie API — `localeCookie` everywhere

  **BREAKING (0.x semver):** `persistLocale` prop renamed to `localeCookie` on `BetterI18nProvider`. `getPersistedLocale()` renamed to `getLocaleCookie()` in `@better-i18n/core`.

  Consistent naming across the entire stack:
  - **Client provider:** `<BetterI18nProvider localeCookie="preferred-locale" />`
  - **Client utility:** `getLocaleCookie("preferred-locale")` from `@better-i18n/core`
  - **Server plugin:** `createBetterAuthProvider(i18n, { localeCookie: "preferred-locale" })`
  - **Vite plugin:** `localeCookie: "preferred-locale"` (already used this name)

  **@better-i18n/core:** New `getLocaleCookie(cookieName)` utility for non-React contexts (auth clients, analytics, fetch wrappers). BCP 47 validated, regex-safe.

  **@better-i18n/use-intl:** `localeCookie` prop reads cookie on init (SPA fallback) and writes on every locale change. Merged with Vite plugin's SSR cookie — single `cookieName` resolves prop > SSR data. Provider internals hardened: lazy init, stable i18nCore instance, BCP 47 URL segment detection.

  **@better-i18n/server:** `createBetterAuthProvider` gains `localeCookie` option. Detection chain: `getLocale` > `localeCookie` > `Accept-Language` > `defaultLocale`.

## 0.6.2

### Patch Changes

- 89dd681: Remove "bun" export conditions that referenced unpublished src/ files

  All packages had `"bun": "./src/*.ts"` conditions in their exports map, but `src/` is not included in the npm package (`files: ["dist"]`). Bun runtime resolves the "bun" condition before "default", causing module resolution failures for customers using Bun to build their apps.

## 0.6.1

### Patch Changes

- 817c761: Treat empty CDN responses as failures to activate the fallback chain. The CDN always returns HTTP 200 even for non-existent locales (with `{}` or `{ fallback: true }`), which previously bypassed the storage → staticData fallback chain. Empty and fallback-marker responses now throw, allowing persistent storage and bundled translations to serve as safety nets. This fixes raw translation keys appearing when a locale doesn't exist in the project.

## 0.6.0

### Minor Changes

- 3a5b2b6: Single UI source for LocaleDropdown across all adapters

  Introduces `@better-i18n/core/react` — a new optional React export containing
  `LocaleDropdownBase`, a pure presentational component with no routing hooks.

  **New exports from `@better-i18n/core/react`:**
  - `LocaleDropdownBase` — props-driven UI, no hooks, works with any router
  - `LOCALE_DROPDOWN_CSS` — injectable CSS string for custom rendering pipelines
  - `DATA_ATTRS` — typed constants for all `data-better-locale-*` attributes
  - `CSS_VARS` — typed constants for all `--better-locale-*` custom properties
  - `LocaleDropdownBaseProps`, `LocaleDropdownRenderContext`, `LocaleDropdownTriggerContext` — full type surface

  **Adapter changes (all backwards compatible):**
  - `@better-i18n/use-intl`: `LocaleDropdown` → thin wrapper (TanStack Router hooks)
  - `@better-i18n/remix`: `LocaleDropdown` → thin wrapper (React Router hooks)
  - `@better-i18n/next`: `LocaleDropdown` → thin wrapper (cookie + router.refresh)
  - Eliminates ~1200 lines of duplicated UI code across the three adapters
  - Bundle size: `@better-i18n/core` main entry remains zero-dep; React UI loads only via `./react`

### Patch Changes

- 6bf6952: Fix: auto-disable cache in dev mode, raise default prod TTL to 5 minutes

  In development (`NODE_ENV=development`), the SDK now bypasses all caching so published translations are visible immediately on the next page refresh.

  In production, the default `manifestCacheTtlMs` is raised from 60s to 5 minutes. This significantly reduces CDN requests for globally-distributed deployments like Shopify Hydrogen on Oxygen, where traffic is spread across many Cloudflare edge nodes (each with an independent in-memory cache).

  For Next.js, ISR `revalidate` values are also set to `0` in dev mode, bypassing Next.js Data Cache entirely during development.

- 11c3426: Fix manifest and translations being served from browser disk cache.

  The CDN sends `Cache-Control: public, max-age=14400` for manifest and `max-age=60` for translations. The existing `Cache-Control: no-store` **request header** only affects Cloudflare/proxy caches — it does not bypass the browser's own disk cache. Adding `cache: "no-store"` to the fetch options fixes this for both manifest and translations.

  For the Next.js adapter, `createIsrFetch` now strips the `cache` property from init before adding `next: { revalidate }` — Next.js 14+ throws if both are present simultaneously.

## 0.5.0

### Minor Changes

- 1c8bc9b: ### @better-i18n/core

  **New:** `localePrefix: "never"` option in `LocaleConfig` — disables URL locale prefixing entirely. Locale is persisted only via cookie, ideal for dashboards and apps where URL structure shouldn't change per locale.

  `addLocalePrefix()` and `replaceLocaleInPath()` now respect all three modes:
  - `"as-needed"` (default): default locale has no prefix (`/about`), others do (`/tr/about`)
  - `"always"`: all locales get a prefix, including default (`/en/about`)
  - `"never"`: no locale prefix for any locale — cookie-only

  ### @better-i18n/use-intl

  **New:** `localePrefix="never"` prop on `BetterI18nProvider`. When set, `setLocale()` skips URL mutation entirely — only persists locale to cookie and triggers `onLocaleChange` if provided.

  ```tsx
  // Dashboard — no locale in URL, cookie-only
  <BetterI18nProvider localePrefix="never">
    <App />
  </BetterI18nProvider>
  ```

## 0.4.0

### Minor Changes

- faccfdd: ### @better-i18n/core

  **New:** `localePrefix` option in `LocaleConfig` — controls URL prefix strategy:
  - `"as-needed"` (default): default locale has no prefix (`/about`)
  - `"always"`: all locales get a prefix, including default (`/en/about`)

  `addLocalePrefix()` and `replaceLocaleInPath()` now respect this setting.
  Previously, default locale never got a prefix regardless of configuration.

  ### @better-i18n/use-intl

  Updated `@better-i18n/core` dependency to include `localePrefix` support.
  `useLocalePath().localePath()` now correctly adds prefix for default locale
  when `localePrefix="always"` is set on the provider.

## 0.3.0

### Minor Changes

- 1da02c8: Add LocaleDropdown component — accessible locale switcher with flag emojis, native language names, keyboard navigation, styled/unstyled variants, and CSS custom properties for theming

## 0.2.4

### Patch Changes

- fix: ensure .js extensions in ESM dist output for Node.js compatibility

## 0.2.3

### Patch Changes

- Fix CDN caching behavior for Cloudflare Workers
  - Use `no-store` cache option to bypass Cloudflare subrequest cache for CDN fetches
  - Reduce default cache TTL from 5 minutes to 60 seconds for fresher translations

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
