---
"@better-i18n/next": minor
---

### Cookie override fix & locale switching improvements

- **Fix cookie overriding URL locale** in `localePrefix: "always"` and `"as-needed"` modes. Uses React `cache()` to bridge locale across multiple `getRequestConfig` calls per request — the first call's resolved locale is cached and reused when `requestLocale` is undefined in secondary render passes.
- **Fix locale switcher URL navigation** — `setLocale()` now uses `router.replace()` to update the URL path in URL-based modes instead of only `router.refresh()`.
- **Move `createRevalidateHandler` to dedicated subpath** — import from `@better-i18n/next/revalidate` instead of the barrel to prevent `next/cache` server-only imports from leaking into client bundles.
- **Dynamic import for `next/headers`** — `cookies()` is now lazily imported only in `"never"` mode, preventing module-level server-only import issues.
- **Middleware enhancement** — injects `x-better-i18n-locale` request header in URL-based modes for future-proofing.
