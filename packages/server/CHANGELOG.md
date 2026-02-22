# @better-i18n/server

## 0.2.0

### Minor Changes

- 5fd34e0: feat: add @better-i18n/server — server-side i18n middleware for Hono and Node.js

  New package providing server-side internationalization with framework adapters:
  - `createServerI18n(config)` — singleton factory using `@better-i18n/core` TtlCache (shared across requests to avoid redundant CDN fetches)
  - `betterI18n(i18n)` — Hono middleware (Web Standards, no adapter needed); detects locale from Accept-Language and injects `translator` into context
  - `betterI18nMiddleware(i18n)` — Express/Fastify/Node.js compatible middleware via `fromNodeHeaders()` adapter
  - RFC 5646 `parseAcceptLanguage()` + `matchLocale()` — quality-weighted locale negotiation
  - Three export paths: `.` (core), `./hono`, `./node`

### Patch Changes

- Updated dependencies [5fd34e0]
  - @better-i18n/core@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.10
