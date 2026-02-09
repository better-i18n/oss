---
"@better-i18n/next": minor
---

Add full cookie-based locale support for `localePrefix: "never"` mode

- **Middleware bypass**: When `localePrefix` is `"never"`, skip `next-intl`'s `createMiddleware()` which tries URL rewriting. Instead, create a plain `NextResponse.next()` and set the `x-middleware-request-x-next-intl-locale` header directly from cookie/browser detection.
- **Cookie fallback in `createNextIntlRequestConfig`**: When `requestLocale` is undefined (common in "never" mode), read locale from `cookies().get(cookieName)` before falling back to `defaultLocale`.
- **`useSetLocale` hook**: New client hook that sets locale cookie and triggers UI update. Works in two modes:
  - With `BetterI18nProvider`: instant client-side switching (fetches new messages from CDN, no page refresh)
  - Standalone with config: cookie + `router.refresh()` fallback
- **`BetterI18nProvider`**: New provider that wraps `NextIntlClientProvider` and enables instant locale switching without server round-trip. Fetches translation messages from CDN on the client.
- **`cookieName` config**: New optional config field (default: `"locale"`) for customizing the cookie name used for locale persistence.
