# @better-i18n/next

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
