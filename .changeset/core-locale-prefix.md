---
"@better-i18n/core": minor
"@better-i18n/use-intl": patch
---

### @better-i18n/core

**New:** `localePrefix` option in `LocaleConfig` — controls URL prefix strategy:
- `"as-needed"` (default): default locale has no prefix (`/about`)
- `"always"`: all locales get a prefix, including default (`/en/about`)

`addLocalePrefix()` and `replaceLocaleInPath()` now respect this setting.
Previously, default locale never got a prefix regardless of configuration.

### @better-i18n/use-intl

Updated `@better-i18n/core` dependency to include `localePrefix` support.
`useLocalePath().localePath()` now correctly adds prefix for default locale
when `localePrefix="always"` is set on the provider.
