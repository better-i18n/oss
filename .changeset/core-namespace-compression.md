---
"@better-i18n/core": minor
---

Add selective namespace loading and CDN compression support

- `getMessages(locale, { namespaces: ['common', 'nav'] })` — fetches only specified namespaces from CDN (v2 projects only; v1 single-file projects silently ignore the option)
- Namespace-aware cache keys prevent selective fetches from polluting full-fetch cache
- `Accept-Encoding: gzip, br` on all CDN requests — reduces manifest 477KB → 26KB (94%) and translation files proportionally
- Split `manifestCacheTtlMs` and `messagesCacheTtlMs` in dev: manifest caches 30s (rarely changes), messages cache 0ms (always fresh). Both default to 5min in production
- New `messagesCacheTtlMs` field in `NormalizedConfig` for runtime inspection
