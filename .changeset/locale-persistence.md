---
"@better-i18n/use-intl": minor
"@better-i18n/remix": minor
---

Add locale persistence so returning visitors get their previously chosen language

**use-intl:** New `persistLocale` prop on `BetterI18nProvider`. When enabled, sets a cookie on every locale change (including initial page load). Works with any hosting provider — no Cloudflare/geo-IP dependency required.

**remix:** New `getLocaleCookieHeader(locale, request?)` method on `RemixI18n`. Returns a `Set-Cookie` header value for locale persistence, or `null` when cookie already matches (avoids redundant headers).
