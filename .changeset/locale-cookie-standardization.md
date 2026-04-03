---
"@better-i18n/core": minor
"@better-i18n/use-intl": minor
"@better-i18n/server": minor
---

Standardize locale cookie API — `localeCookie` everywhere

**BREAKING (0.x semver):** `persistLocale` prop renamed to `localeCookie` on `BetterI18nProvider`. `getPersistedLocale()` renamed to `getLocaleCookie()` in `@better-i18n/core`.

Consistent naming across the entire stack:
- **Client provider:** `<BetterI18nProvider localeCookie="preferred-locale" />`
- **Client utility:** `getLocaleCookie("preferred-locale")` from `@better-i18n/core`
- **Server plugin:** `createBetterAuthProvider(i18n, { localeCookie: "preferred-locale" })`
- **Vite plugin:** `localeCookie: "preferred-locale"` (already used this name)

**@better-i18n/core:** New `getLocaleCookie(cookieName)` utility for non-React contexts (auth clients, analytics, fetch wrappers). BCP 47 validated, regex-safe.

**@better-i18n/use-intl:** `localeCookie` prop reads cookie on init (SPA fallback) and writes on every locale change. Merged with Vite plugin's SSR cookie — single `cookieName` resolves prop > SSR data. Provider internals hardened: lazy init, stable i18nCore instance, BCP 47 URL segment detection.

**@better-i18n/server:** `createBetterAuthProvider` gains `localeCookie` option. Detection chain: `getLocale` > `localeCookie` > `Accept-Language` > `defaultLocale`.
