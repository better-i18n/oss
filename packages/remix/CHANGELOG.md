# @better-i18n/remix

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
