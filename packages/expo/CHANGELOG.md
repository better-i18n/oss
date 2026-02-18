# @better-i18n/expo

## 0.3.2

### Patch Changes

- 6024288: Deprecate BetterI18nBackend in favor of initBetterI18n
  - Add `@deprecated` JSDoc to BetterI18nBackend class and its re-export
  - Fix changeLanguage callback type from `any` to `i18next.Callback`
  - Reorder exports: initBetterI18n first, deprecated backend last
  - Rewrite all docs to use initBetterI18n as the primary API

## 0.3.1

### Patch Changes

- 3836f94: Add staticData, fetchTimeout, and retryCount passthrough to core
  - initBetterI18n and BetterI18nBackend now accept staticData, fetchTimeout, retryCount
  - staticData enables offline-first: bundled translations work on first launch without network
  - Backend tests updated for core's global cache behavior

- Updated dependencies [3836f94]
  - @better-i18n/core@0.1.9

## 0.3.0

### Minor Changes

- 24dd2a0: Add namespace auto-registration in backend plugin

  When the CDN returns multi-namespace data (nested or flat format), the backend now automatically registers sibling namespaces in i18next's resource store via `addResourceBundle()`. This eliminates the need for manual namespace discovery on the app side — all namespaces from a single CDN response are immediately available to i18next.

## 0.2.1

### Patch Changes

- Fix package entry points to resolve from dist/ instead of missing src/

  Root-level main/types/exports now point to dist/ directly. Added "bun" conditional export for monorepo development.

- Updated dependencies
  - @better-i18n/core@0.1.8

## 0.2.0

### Minor Changes

- 043c5f4: Add `@better-i18n/expo` - i18next backend plugin for Expo/React Native with offline caching

  **@better-i18n/expo:**
  - i18next `BackendModule` with network-first strategy (always fresh translations)
  - Persistent offline fallback via MMKV or AsyncStorage (auto-detected, zero config)
  - Device locale detection via expo-localization
  - `initBetterI18n()` convenience helper for one-liner setup

  **@better-i18n/core:**
  - Add `Cache-Control: no-cache` header to CDN fetch requests for proper cache revalidation

### Patch Changes

- 1f45586: Fix broken package entry points — `main`/`exports` now point to `dist/` directly

  `bun publish` does not apply `publishConfig` overrides, causing `main: "./src/index.ts"` to be published while `src/` is not included in the tarball. This broke Metro (React Native) and any bundler that doesn't fall back to `publishConfig`.
  - Root-level `main`/`types` now point to `./dist/index.js` and `./dist/index.d.ts`
  - Added `"bun"` conditional export for monorepo dev (`./src/index.ts`)
  - Removed broken `publishConfig` field overrides (kept `access: "public"` only)

- Updated dependencies [043c5f4]
- Updated dependencies [1f45586]
  - @better-i18n/core@0.1.7
