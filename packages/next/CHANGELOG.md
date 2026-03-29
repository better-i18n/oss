# @better-i18n/next

## 0.7.3

### Patch Changes

- 3a5b2b6: Single UI source for LocaleDropdown across all adapters

  Introduces `@better-i18n/core/react` — a new optional React export containing
  `LocaleDropdownBase`, a pure presentational component with no routing hooks.

  **New exports from `@better-i18n/core/react`:**
  - `LocaleDropdownBase` — props-driven UI, no hooks, works with any router
  - `LOCALE_DROPDOWN_CSS` — injectable CSS string for custom rendering pipelines
  - `DATA_ATTRS` — typed constants for all `data-better-locale-*` attributes
  - `CSS_VARS` — typed constants for all `--better-locale-*` custom properties
  - `LocaleDropdownBaseProps`, `LocaleDropdownRenderContext`, `LocaleDropdownTriggerContext` — full type surface

  **Adapter changes (all backwards compatible):**
  - `@better-i18n/use-intl`: `LocaleDropdown` → thin wrapper (TanStack Router hooks)
  - `@better-i18n/remix`: `LocaleDropdown` → thin wrapper (React Router hooks)
  - `@better-i18n/next`: `LocaleDropdown` → thin wrapper (cookie + router.refresh)
  - Eliminates ~1200 lines of duplicated UI code across the three adapters
  - Bundle size: `@better-i18n/core` main entry remains zero-dep; React UI loads only via `./react`

- 6bf6952: Fix: auto-disable cache in dev mode, raise default prod TTL to 5 minutes

  In development (`NODE_ENV=development`), the SDK now bypasses all caching so published translations are visible immediately on the next page refresh.

  In production, the default `manifestCacheTtlMs` is raised from 60s to 5 minutes. This significantly reduces CDN requests for globally-distributed deployments like Shopify Hydrogen on Oxygen, where traffic is spread across many Cloudflare edge nodes (each with an independent in-memory cache).

  For Next.js, ISR `revalidate` values are also set to `0` in dev mode, bypassing Next.js Data Cache entirely during development.

- 11c3426: Fix manifest and translations being served from browser disk cache.

  The CDN sends `Cache-Control: public, max-age=14400` for manifest and `max-age=60` for translations. The existing `Cache-Control: no-store` **request header** only affects Cloudflare/proxy caches — it does not bypass the browser's own disk cache. Adding `cache: "no-store"` to the fetch options fixes this for both manifest and translations.

  For the Next.js adapter, `createIsrFetch` now strips the `cache` property from init before adding `next: { revalidate }` — Next.js 14+ throws if both are present simultaneously.

- Updated dependencies [3a5b2b6]
- Updated dependencies [6bf6952]
- Updated dependencies [11c3426]
  - @better-i18n/core@0.6.0

## 0.7.2

### Patch Changes

- Updated dependencies [1c8bc9b]
  - @better-i18n/core@0.5.0

## 0.7.1

### Patch Changes

- Updated dependencies [faccfdd]
  - @better-i18n/core@0.4.0

## 0.7.0

### Minor Changes

- 3d1af97: ### Cookie override fix & locale switching improvements
  - **Fix cookie overriding URL locale** in `localePrefix: "always"` and `"as-needed"` modes. Uses React `cache()` to bridge locale across multiple `getRequestConfig` calls per request — the first call's resolved locale is cached and reused when `requestLocale` is undefined in secondary render passes.
  - **Fix locale switcher URL navigation** — `setLocale()` now uses `router.replace()` to update the URL path in URL-based modes instead of only `router.refresh()`.
  - **Move `createRevalidateHandler` to dedicated subpath** — import from `@better-i18n/next/revalidate` instead of the barrel to prevent `next/cache` server-only imports from leaking into client bundles.
  - **Dynamic import for `next/headers`** — `cookies()` is now lazily imported only in `"never"` mode, preventing module-level server-only import issues.
  - **Middleware enhancement** — injects `x-better-i18n-locale` request header in URL-based modes for future-proofing.

## 0.6.3

### Patch Changes

- 5bbfcf0: Fix `localePrefix: "never"` mode middleware and client-side locale switching. Middleware now performs internal rewrites correctly bypassing next-intl delegation, and `useSetLocale` properly handles URL navigation for prefix modes vs cookie-only refresh for "never" mode.

## 0.6.2

### Patch Changes

- 5847011: Fix LocaleDropdown auto-placement, dark mode support, and fixed positioning strategy. Replaces manual placement calculation with @floating-ui/react for reliable viewport-aware positioning. Adds CSS custom properties for dark mode theming with `.dark` class and `[data-theme="dark"]` support.
- cc92649: Fix `localePrefix: "never"` mode middleware and client-side locale switching. Middleware now performs internal rewrites correctly bypassing next-intl delegation, and `useSetLocale` properly handles URL navigation for prefix modes vs cookie-only refresh for "never" mode.

## 0.6.1

### Patch Changes

- Fix build failure caused by @types/react version mismatch in monorepo (React 18 types hoisted over React 19)

## 0.6.0

### Minor Changes

- 1da02c8: Add LocaleDropdown component — accessible locale switcher with flag emojis, native language names, keyboard navigation, styled/unstyled variants, and CSS custom properties for theming

### Patch Changes

- Updated dependencies [1da02c8]
  - @better-i18n/core@0.3.0

## 0.5.10

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.4

## 0.5.9

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.2.3

## 0.5.8

### Patch Changes

- Updated dependencies [f3403e1]
  - @better-i18n/core@0.2.2

## 0.5.7

### Patch Changes

- Updated dependencies [12210eb]
  - @better-i18n/core@0.2.1

## 0.5.6

### Patch Changes

- Updated dependencies [5fd34e0]
  - @better-i18n/core@0.2.0

## 0.5.5

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.10

## 0.5.4

### Patch Changes

- 3836f94: Pass storage and staticData through to core on client side
  - useManifestLanguages now uses full fallback chain
  - setLocale uses createI18nCore().getMessages() instead of raw fetch
  - normalizeConfig passes storage, staticData, fetchTimeout, retryCount to core

- Updated dependencies [3836f94]
  - @better-i18n/core@0.1.9

## 0.5.3

### Patch Changes

- 2744ff9: Ship compiled JavaScript instead of raw TypeScript source files. Packages now export pre-built `dist/` files with proper `.js`, `.d.ts`, and source maps — eliminating the need for `transpilePackages` workarounds in consumer projects.

## 0.5.2

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.8

## 0.5.1

### Patch Changes

- Updated dependencies [043c5f4]
- Updated dependencies [1f45586]
  - @better-i18n/core@0.1.7

## 0.5.0

### Minor Changes

- 4dbd081: Add full cookie-based locale support for `localePrefix: "never"` mode
  - **Middleware bypass**: When `localePrefix` is `"never"`, skip `next-intl`'s `createMiddleware()` which tries URL rewriting. Instead, create a plain `NextResponse.next()` and set the `x-middleware-request-x-next-intl-locale` header directly from cookie/browser detection.
  - **Cookie fallback in `createNextIntlRequestConfig`**: When `requestLocale` is undefined (common in "never" mode), read locale from `cookies().get(cookieName)` before falling back to `defaultLocale`.
  - **`useSetLocale` hook**: New client hook that sets locale cookie and triggers UI update. Works in two modes:
    - With `BetterI18nProvider`: instant client-side switching (fetches new messages from CDN, no page refresh)
    - Standalone with config: cookie + `router.refresh()` fallback
  - **`BetterI18nProvider`**: New provider that wraps `NextIntlClientProvider` and enables instant locale switching without server round-trip. Fetches translation messages from CDN on the client.
  - **`cookieName` config**: New optional config field (default: `"locale"`) for customizing the cookie name used for locale persistence.

## 0.4.0

### Minor Changes

- bc2d6f5: feat: add `i18n.betterMiddleware(callback?)` for unified config

  Now you can define your i18n config once and use it everywhere:

  ```typescript
  // i18n/config.ts
  export const i18n = createI18n({
    project: "acme/app",
    defaultLocale: "en",
    localePrefix: "always",
  });

  // middleware.ts
  export default i18n.betterMiddleware(async (request, { locale }) => {
    // Auth logic here
  });

  // i18n/request.ts
  export default i18n.requestConfig;
  ```

  **Changes:**
  - Added `betterMiddleware(callback?)` method to the i18n instance
  - Deprecated `i18n.middleware` in favor of `betterMiddleware()`
  - Config is now shared between middleware, request config, and data fetching

## 0.3.0

### Minor Changes

- c5c914a: feat: Clerk-style middleware callback pattern for better auth integration

  **New Clerk-style API:**
  - `createBetterI18nMiddleware` now accepts an optional callback as second argument
  - Callback receives `{ locale, response }` context, allowing auth logic with full locale access
  - Return `NextResponse` from callback to short-circuit (e.g., redirect to login)
  - Return `void` to continue with i18n response (headers preserved!)

  ```typescript
  export default createBetterI18nMiddleware(
    config,
    async (req, { locale, response }) => {
      if (needsLogin) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
      }
      // Return nothing = i18n response is used automatically
    },
  );
  ```

  **Deprecation:**
  - `composeMiddleware` is now deprecated (shows warning in development)
  - Migrate to the callback pattern for reliable header preservation

  **Other improvements:**
  - Adds `localePrefix` option to `I18nMiddlewareConfig`
  - Sets `x-middleware-request-x-next-intl-locale` header for full next-intl compatibility
  - Exports new `MiddlewareContext` and `MiddlewareCallback` types

### Patch Changes

- Updated dependencies [c5c914a]
  - @better-i18n/core@0.1.6

## 0.2.4

### Patch Changes

- fix: add next-intl middleware compatibility for `getRequestConfig({ requestLocale })`
  - `createBetterI18nMiddleware` now delegates to next-intl's `createMiddleware` internally
  - Adds `localePrefix` option to `I18nMiddlewareConfig` (supports "as-needed", "always", "never")
  - Sets `x-middleware-request-x-next-intl-locale` header required by next-intl's `requestLocale`
  - Maintains backwards compatibility with `x-locale` header
  - Caches middleware instance for performance (recreates only when locales change)

- Updated dependencies
  - @better-i18n/core@0.1.5

## 0.2.3

### Patch Changes

- Updated dependencies [2d400f0]
  - @better-i18n/core@0.1.4

## 0.2.2

### Patch Changes

- 76855e2: Fix: Remove private workspace dependency from devDependencies

  Removed `@better-i18n/typescript-config: workspace:*` from devDependencies. This was causing installation failures for consumers because the private package doesn't exist on npm and `workspace:*` couldn't be resolved during publish.

- Updated dependencies [76855e2]
  - @better-i18n/core@0.1.3

## 0.2.1

### Patch Changes

- Fix: `workspace:*` protocol now correctly resolved to `^0.1.2` during publish
- Switched from `npm publish` (via changeset) to `bun publish` for proper workspace protocol handling

## 0.2.0

### Minor Changes

- **Architecture refactor**: Removed ~220 lines of duplicate code by leveraging `@better-i18n/core`
- **New export**: `createNextI18nCore` - Low-level factory with Next.js ISR support
- **ISR optimization**: Separate revalidation times for manifest (3600s) and messages (30s)
- **Deleted files**: `core.ts`, `logger.ts`, `manifest.ts` (now imported from `@better-i18n/core`)
- **Improved docs**: Updated API reference with full configuration options

### Breaking Changes

None - all existing exports remain backwards compatible.

## 0.1.3

### Patch Changes

- 1488817: Internal/core architecture update and middleware improvements. Moved glossary and encryption to internal package. Improved Next.js and TanStack Start middleware composability.
- 0accc3a: new middleware
- Updated dependencies [1488817]
  - @better-i18n/core@0.1.2
