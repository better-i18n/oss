# @better-i18n/use-intl

## 0.4.0

### Minor Changes

- 1f44bbe: ### @better-i18n/use-intl

  **Breaking:** `useLocaleRouter` is no longer exported from the main entry point. Import it from the new `/router` sub-path:

  ```ts
  // Before
  import { useLocaleRouter } from "@better-i18n/use-intl";

  // After
  import { useLocaleRouter } from "@better-i18n/use-intl/router";
  ```

  **New:** `useLocalePath` — a router-agnostic hook for locale path building and navigation. Works with React Router, TanStack Router, or plain Vite apps without any router dependency.

  ```ts
  import { useLocalePath } from "@better-i18n/use-intl";

  const { localePath, navigate, locale, isReady } = useLocalePath();
  ```

  **Fixed:**
  - **SSR locale mismatch (critical):** When using `@better-i18n/vite` plugin with URL-based locale routing (e.g., `/:locale/*`), non-default locale URLs (like `/tr`) would display the default locale's messages instead of fetching the correct translations from CDN. The provider now correctly tracks the SSR data's locale separately from the prop locale.
  - **`setLocale()` dual-write:** When `onLocaleChange` is provided, the provider no longer calls `window.history.replaceState` internally — the consumer's router handles URL updates exclusively, preventing race conditions.
  - **`replaceState` locale detection:** The fallback URL updater now validates path segments against `supportedLocales` from SSR data, preventing false positives on 2-letter path segments like `/us/profile`.

  ### @better-i18n/vite
  - Inject `supportedLocales` and `localeCookie` into SSR data payload
  - Validate detected locale against CDN manifest before injecting — falls back to default locale if unsupported

## 0.3.0

### Minor Changes

- a1943a7: Add `@better-i18n/vite` plugin for zero-FOUC server-side translation injection.

  **New package: `@better-i18n/vite`**
  - Vite plugin that fetches translations server-side and injects them as `<script id="__better_i18n__">` into HTML
  - Locale detection from URL path, cookie, and Accept-Language header
  - Works in both dev server and production build modes
  - Single source of truth: configure `project` once in the plugin, provider reads it automatically

  **Updated: `@better-i18n/use-intl`**
  - Provider reads SSR-injected data synchronously from DOM on first render (zero FOUC)
  - `project` and `locale` props are now optional when using the Vite plugin
  - Backwards compatible: explicit props still take precedence over plugin data

  **Usage:**

  ```ts
  // vite.config.ts
  import { betterI18n } from "@better-i18n/vite";
  export default defineConfig({
    plugins: [betterI18n({ project: "acme/dashboard" }), react()],
  });
  ```

  ```tsx
  // App.tsx — no project/locale/messages props needed
  <BetterI18nProvider>
    <LocaleDropdown />
    <App />
  </BetterI18nProvider>
  ```

## 0.2.2

### Patch Changes

- 42ef203: Fix LocaleDropdown crash in non-router Vite apps and add missing setLocale to useLocale hook.

  **Bug fixes:**
  - `LocaleDropdown` and `LanguageSwitcher` no longer crash when used without TanStack Router — `useLocaleRouter()` now gracefully detects router context and falls back to provider-based locale switching
  - `useLocale()` now returns `setLocale` as documented (`{ locale, setLocale, isLoading }`)

  **New features:**
  - `BetterI18nProvider` accepts `onLocaleChange` callback for custom locale change handling
  - Provider manages internal locale state — plain Vite/React apps can switch locales without a router
  - `setLocale()` available via `useLocale()`, `useBetterI18n()`, and `useLocaleRouter()` contexts

  **No breaking changes** — existing TanStack Router integrations continue to work as before.

## 0.2.1

### Patch Changes

- 5847011: Fix LocaleDropdown auto-placement, dark mode support, and fixed positioning strategy. Replaces manual placement calculation with @floating-ui/react for reliable viewport-aware positioning. Adds CSS custom properties for dark mode theming with `.dark` class and `[data-theme="dark"]` support.

## 0.2.0

### Minor Changes

- 1da02c8: Add LocaleDropdown component — accessible locale switcher with flag emojis, native language names, keyboard navigation, styled/unstyled variants, and CSS custom properties for theming

### Patch Changes

- 649d15a: Fix TypeScript build error in middleware caused by type mismatch with @tanstack/react-start/server
- Updated dependencies [1da02c8]
  - @better-i18n/core@0.3.0

## 0.1.17

### Patch Changes

- fix: update core dependency to use semver range instead of exact pin

  Changes `workspace:*` to `workspace:^` so published versions use `^x.y.z` instead of exact `x.y.z`. This prevents downstream consumers from being locked to an old, potentially broken core version.

## 0.1.16

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.4

## 0.1.15

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.3

## 0.1.14

### Patch Changes

- Updated dependencies [f3403e1]
  - @better-i18n/core@0.2.2

## 0.1.13

### Patch Changes

- Updated dependencies [12210eb]
  - @better-i18n/core@0.2.1

## 0.1.12

### Patch Changes

- Updated dependencies [5fd34e0]
  - @better-i18n/core@0.2.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.10

## 0.1.10

### Patch Changes

- 3836f94: Pass storage and staticData through to core in BetterI18nProvider
  - Provider now accepts and forwards storage, staticData, fetchTimeout, retryCount
  - CDN failure falls back to storage/staticData instead of breaking

- Updated dependencies [3836f94]
  - @better-i18n/core@0.1.9

## 0.1.9

### Patch Changes

- 2744ff9: Ship compiled JavaScript instead of raw TypeScript source files. Packages now export pre-built `dist/` files with proper `.js`, `.d.ts`, and source maps — eliminating the need for `transpilePackages` workarounds in consumer projects.

## 0.1.8

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies [043c5f4]
- Updated dependencies [1f45586]
  - @better-i18n/core@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [c5c914a]
  - @better-i18n/core@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.5

## 0.1.4

### Patch Changes

- 2d400f0: Fix: Ensure packages are built before publishing
  - Added `prepublishOnly` hook to `@better-i18n/core` to build dist before publish
  - Fixed `@better-i18n/use-intl` to publish source files (consistent with `@better-i18n/next`)

- Updated dependencies [2d400f0]
  - @better-i18n/core@0.1.4

## 0.1.3

### Patch Changes

- 76855e2: Fix: Remove private workspace dependency from devDependencies

  Removed `@better-i18n/typescript-config: workspace:*` from devDependencies. This was causing installation failures for consumers because the private package doesn't exist on npm and `workspace:*` couldn't be resolved during publish.

- Updated dependencies [76855e2]
  - @better-i18n/core@0.1.3

## 0.1.2

### Patch Changes

- 1488817: Internal/core architecture update and middleware improvements. Moved glossary and encryption to internal package. Improved Next.js and TanStack Start middleware composability.
- Updated dependencies [1488817]
  - @better-i18n/core@0.1.2
