# @better-i18n/server

## 0.4.0

### Minor Changes

- 0407289: Standardize locale cookie API — `localeCookie` everywhere

  **BREAKING (0.x semver):** `persistLocale` prop renamed to `localeCookie` on `BetterI18nProvider`. `getPersistedLocale()` renamed to `getLocaleCookie()` in `@better-i18n/core`.

  Consistent naming across the entire stack:
  - **Client provider:** `<BetterI18nProvider localeCookie="preferred-locale" />`
  - **Client utility:** `getLocaleCookie("preferred-locale")` from `@better-i18n/core`
  - **Server plugin:** `createBetterAuthProvider(i18n, { localeCookie: "preferred-locale" })`
  - **Vite plugin:** `localeCookie: "preferred-locale"` (already used this name)

  **@better-i18n/core:** New `getLocaleCookie(cookieName)` utility for non-React contexts (auth clients, analytics, fetch wrappers). BCP 47 validated, regex-safe.

  **@better-i18n/use-intl:** `localeCookie` prop reads cookie on init (SPA fallback) and writes on every locale change. Merged with Vite plugin's SSR cookie — single `cookieName` resolves prop > SSR data. Provider internals hardened: lazy init, stable i18nCore instance, BCP 47 URL segment detection.

  **@better-i18n/server:** `createBetterAuthProvider` gains `localeCookie` option. Detection chain: `getLocale` > `localeCookie` > `Accept-Language` > `defaultLocale`.

### Patch Changes

- Updated dependencies [0407289]
  - @better-i18n/core@0.7.0

## 0.3.3

### Patch Changes

- 89dd681: Remove "bun" export conditions that referenced unpublished src/ files

  All packages had `"bun": "./src/*.ts"` conditions in their exports map, but `src/` is not included in the npm package (`files: ["dist"]`). Bun runtime resolves the "bun" condition before "default", causing module resolution failures for customers using Bun to build their apps.

- Updated dependencies [89dd681]
  - @better-i18n/core@0.6.2

## 0.3.2

### Patch Changes

- 38e0634: Fix TypeScript type incompatibility with better-auth@1.3 — handler parameter changed from HookContext to unknown for structural compatibility with BetterAuthPlugin type

## 0.3.1

### Patch Changes

- 91d3264: Fix TypeScript build error in node.ts that prevented npm publish since v0.2.2

## 0.3.0

### Minor Changes

- 92b920f: Add Better Auth localization provider at `@better-i18n/server/providers/better-auth`. Translates auth error messages via CDN — add translations from the dashboard, no redeployment needed.

## 0.2.9

### Patch Changes

- Updated dependencies [817c761]
  - @better-i18n/core@0.6.1

## 0.2.8

### Patch Changes

- Updated dependencies [3a5b2b6]
- Updated dependencies [6bf6952]
- Updated dependencies [11c3426]
  - @better-i18n/core@0.6.0

## 0.2.7

### Patch Changes

- Updated dependencies [1c8bc9b]
  - @better-i18n/core@0.5.0

## 0.2.6

### Patch Changes

- Updated dependencies [faccfdd]
  - @better-i18n/core@0.4.0

## 0.2.5

### Patch Changes

- Updated dependencies [1da02c8]
  - @better-i18n/core@0.3.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.4

## 0.2.3

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.3

## 0.2.2

### Patch Changes

- Updated dependencies [f3403e1]
  - @better-i18n/core@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [12210eb]
  - @better-i18n/core@0.2.1

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
