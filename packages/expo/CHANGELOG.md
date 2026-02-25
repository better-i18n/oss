# @better-i18n/expo

## 0.4.2

### Patch Changes

- 173335f: fix(expo): revert dynamic import() → require() to prevent Metro bundle crash

  Metro bundler crash when using `import()` for optional peer dependencies:

  ```
  The "to" argument must be of type string. Received undefined: node:path
    at Object.relative (node:path:1358:5)
    at @expo/metro-config/src/serializer/fork/js.ts:109
  ```

  **Root cause:** `import()` triggers Metro's lazy chunk mechanism. For missing
  modules, Metro sets the path to `undefined` → `path.relative(bundleDir, undefined)` crashes
  at serialization time (before the app even boots).

  **Fix:** Use `require()` instead. Metro creates stubs with real file paths for
  `require()` calls → `path.relative()` works → stub executes at runtime →
  `throw` is caught by the surrounding `try/catch`.

## 0.4.1

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

- Updated dependencies [12210eb]
  - @better-i18n/core@0.2.1

## 0.4.0

### Minor Changes

- de2de32: feat: support both colon-notation and dot-notation translation patterns

  All CDN namespaces are now merged into a unified `"translation"` namespace in addition
  to being registered as individual namespaces. This means both usage styles work without
  any configuration or workarounds:
  - `t('auth:login')` — colon-notation with explicit namespace (unchanged)
  - `t('auth.login')` — dot-notation via default `"translation"` namespace (new)
  - `useTranslation('auth')` + `t('login')` — scoped namespace hook (unchanged)

  `defaultNS` is now always `"translation"` instead of being resolved dynamically.
  Language switching (`changeLanguage`, `languageChanged`) pre-loads both the merged
  bundle and individual namespaces for the new locale.

  **staticData format**: Pass locale messages directly (`staticData: { en, tr }`) —
  no extra namespace wrapper is needed.

### Patch Changes

- Updated dependencies [5fd34e0]
  - @better-i18n/core@0.2.0

## 0.3.3

### Patch Changes

- fix: Normalize locale to lowercase for CDN compatibility (BCP 47 sub-locale fix)
- Updated dependencies
  - @better-i18n/core@0.1.10

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
