---
"@better-i18n/next": patch
---

Pass storage and staticData through to core on client side

- useManifestLanguages now uses full fallback chain
- setLocale uses createI18nCore().getMessages() instead of raw fetch
- normalizeConfig passes storage, staticData, fetchTimeout, retryCount to core
