# @better-i18n/use-intl

## 0.8.0

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

### Patch Changes

- Updated dependencies [0407289]
  - @better-i18n/core@0.7.0

## 0.7.0

### Minor Changes

- 89dd681: Read persisted locale cookie on initialization for static/SPA builds

  `BetterI18nProvider` now reads the `persistLocale` cookie during initialization, before falling back to `"en"`. Previously, the cookie was written on locale change but never read back — causing locale to reset on page refresh in static/SPA builds where SSR data is unavailable.

  New resolution chain: `propLocale → ssrData → persistLocale cookie → localeCookie → "en"`

### Patch Changes

- 89dd681: Remove "bun" export conditions that referenced unpublished src/ files

  All packages had `"bun": "./src/*.ts"` conditions in their exports map, but `src/` is not included in the npm package (`files: ["dist"]`). Bun runtime resolves the "bun" condition before "default", causing module resolution failures for customers using Bun to build their apps.

- Updated dependencies [89dd681]
  - @better-i18n/core@0.6.2

## 0.6.0

### Minor Changes

- 6468495: Add locale persistence so returning visitors get their previously chosen language

  **use-intl:** New `persistLocale` prop on `BetterI18nProvider`. When enabled, sets a cookie on every locale change (including initial page load). Works with any hosting provider — no Cloudflare/geo-IP dependency required.

  **remix:** New `getLocaleCookieHeader(locale, request?)` method on `RemixI18n`. Returns a `Set-Cookie` header value for locale persistence, or `null` when cookie already matches (avoids redundant headers).

## 0.5.1

### Patch Changes

- a4fe0ff: Animated locale dropdown with ElevenLabs-style hover effects
  - Round flags (18×18, border-radius 50%) instead of rectangular
  - Dropdown menu entrance animation (scale + fade, 150ms cubic-bezier spring)
  - Item hover: CSS ::before pseudo-element with scale(0.97→1) + opacity animation
  - Trigger button: same spring hover effect via CSS pseudo-element
  - Deeper shadow and 14px border-radius for a more modern menu
  - Menu padding 6px for proper item breathing room
  - Active item: bold weight, persistent background via [data-active] CSS selector
  - All animations handled via CSS — zero JS overhead, respects prefers-reduced-motion if added by consumer

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

- Updated dependencies [3a5b2b6]
- Updated dependencies [6bf6952]
- Updated dependencies [11c3426]
  - @better-i18n/core@0.6.0

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

### Patch Changes

- Updated dependencies [1c8bc9b]
  - @better-i18n/core@0.5.0

## 0.4.1

### Patch Changes

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

- Updated dependencies [faccfdd]
  - @better-i18n/core@0.4.0

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
