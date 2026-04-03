---
"@better-i18n/core": minor
"@better-i18n/use-intl": minor
"@better-i18n/server": minor
---

Standardize locale detection across client and server

**@better-i18n/core:** New `getPersistedLocale(cookieName)` utility — reads the persisted locale cookie in non-React contexts (auth clients, analytics, module-level singletons). Validates against BCP 47, escapes cookie name for regex safety.

**@better-i18n/use-intl:** Re-exports `getPersistedLocale` from core. Provider now uses the shared implementation instead of an internal copy.

**@better-i18n/server:** `createBetterAuthProvider` gains `localeCookie` option. When set, reads the named cookie from the request before falling back to Accept-Language. Detection chain: `getLocale` > `localeCookie` > `Accept-Language` > `defaultLocale`. Pairs naturally with the provider's `persistLocale` prop.
