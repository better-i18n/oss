# @better-i18n/remix

## 0.6.2

### Patch Changes

- Updated dependencies [0407289]
  - @better-i18n/core@0.7.0

## 0.6.1

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

- Updated dependencies [817c761]
  - @better-i18n/core@0.6.1

## 0.5.0

### Minor Changes

- 3ea1cae: Add `localePrefix` config + `getLocaleFromRequest` / `buildLocalePath` / `replaceLocaleInPath`

  `createRemixI18n` now accepts a `localePrefix` option (mirrors `@better-i18n/next` and `use-intl`) to control URL-based locale routing:
  - `"as-needed"` (default): only non-default locales get a prefix (`/tr/about`, `/about`)
  - `"always"`: every locale gets a prefix including the default (`/en/about`, `/tr/about`)
  - `"never"`: no URL prefix; detection falls back to cookie → Accept-Language → default

  New methods on the returned instance:
  - `getLocaleFromRequest(request)` — replaces custom locale-detection helpers; CDN-independent
    (validates URL segment against CDN list with BCP 47 regex fallback on cold start / miss)
  - `buildLocalePath(path, locale)` — builds locale-prefixed path respecting config
  - `replaceLocaleInPath(path, newLocale)` — swaps locale prefix in an existing path

  `detectLocale(request)` is now `@deprecated`; use `getLocaleFromRequest` instead.

### Patch Changes

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

## 0.4.3

### Patch Changes

- Updated dependencies [1c8bc9b]
  - @better-i18n/core@0.5.0

## 0.4.2

### Patch Changes

- Updated dependencies [faccfdd]
  - @better-i18n/core@0.4.0

## 0.4.1

### Patch Changes

- 5847011: Fix LocaleDropdown auto-placement, dark mode support, and fixed positioning strategy. Replaces manual placement calculation with @floating-ui/react for reliable viewport-aware positioning. Adds CSS custom properties for dark mode theming with `.dark` class and `[data-theme="dark"]` support.

## 0.4.0

### Minor Changes

- 1da02c8: Add LocaleDropdown component — accessible locale switcher with flag emojis, native language names, keyboard navigation, styled/unstyled variants, and CSS custom properties for theming

### Patch Changes

- Updated dependencies [1da02c8]
  - @better-i18n/core@0.3.0

## 0.3.1

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.4

## 0.3.0

### Minor Changes

- 60e0930: feat(remix): add react provider and i18next entrypoints for hook-based translations
  - `@better-i18n/remix/react` — `RemixI18nProvider`, `useTranslations`, `useLocale`, `useLanguages`, `LanguageSwitcher`
  - `@better-i18n/remix/i18next` — `buildI18nextConfig`, `loadResources` for i18next integration
  - Updated docs with tabbed examples for both use-intl and i18next patterns

## 0.2.1

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.3

## 0.2.0

### Minor Changes

- cd63402: feat: add @better-i18n/remix package for Remix & Shopify Hydrogen i18n integration
