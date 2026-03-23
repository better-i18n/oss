---
"@better-i18n/core": minor
"@better-i18n/use-intl": minor
---

### @better-i18n/core

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
