---
"@better-i18n/use-intl": minor
---

Read persisted locale cookie on initialization for static/SPA builds

`BetterI18nProvider` now reads the `persistLocale` cookie during initialization, before falling back to `"en"`. Previously, the cookie was written on locale change but never read back — causing locale to reset on page refresh in static/SPA builds where SSR data is unavailable.

New resolution chain: `propLocale → ssrData → persistLocale cookie → localeCookie → "en"`
