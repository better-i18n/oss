---
"@better-i18n/use-intl": patch
---

Pass storage and staticData through to core in BetterI18nProvider

- Provider now accepts and forwards storage, staticData, fetchTimeout, retryCount
- CDN failure falls back to storage/staticData instead of breaking
