# @better-i18n/vite

## 0.2.2

### Patch Changes

- Updated dependencies [faccfdd]
  - @better-i18n/core@0.4.0

## 0.2.1

### Patch Changes

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

## 0.2.0

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
