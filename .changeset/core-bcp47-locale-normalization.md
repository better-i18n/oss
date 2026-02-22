---
"@better-i18n/core": minor
---

feat: BCP 47 sub-locale normalization for CDN compatibility

- Normalize sub-locale tags to lowercase before CDN manifest and message fetches (`pt-BR` → `pt-br`, `zh_TW` → `zh-tw`)
- Apply `normalizeLocale()` in `cdn.ts` prior to cache key construction and fetch
- Normalize locale values in `detection.ts` locale matching so Accept-Language headers resolve correctly against manifest
- Export 7 locale utility helpers from `utils/locale.ts` via `index.ts`: `normalizeLocale`, `extractLocale`, `getLocaleFromPath`, `hasLocalePrefix`, `removeLocalePrefix`, `addLocalePrefix`, `replaceLocaleInPath`, `createLocalePath`
