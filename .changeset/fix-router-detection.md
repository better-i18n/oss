---
"@better-i18n/use-intl": patch
---

Fix LocaleDropdown crash in non-router Vite apps and add missing setLocale to useLocale hook.

**Bug fixes:**
- `LocaleDropdown` and `LanguageSwitcher` no longer crash when used without TanStack Router — `useLocaleRouter()` now gracefully detects router context and falls back to provider-based locale switching
- `useLocale()` now returns `setLocale` as documented (`{ locale, setLocale, isLoading }`)

**New features:**
- `BetterI18nProvider` accepts `onLocaleChange` callback for custom locale change handling
- Provider manages internal locale state — plain Vite/React apps can switch locales without a router
- `setLocale()` available via `useLocale()`, `useBetterI18n()`, and `useLocaleRouter()` contexts

**No breaking changes** — existing TanStack Router integrations continue to work as before.
