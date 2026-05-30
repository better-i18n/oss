---
"@better-i18n/next": minor
"@better-i18n/core": minor
---

Add an explicit locale-choice marker so tenant/org default locales never override a deliberate user choice.

`useSetLocale()` now writes an explicit-marker cookie (default `` `${cookieName}_explicit` ``) that the middleware only reads — never writes. The middleware callback context gains two fields:

- `detectedFrom`: `"path" | "cookie" | "geo" | "header" | "default"`
- `isExplicit`: `true` when the explicit marker is present (the user picked the language via the switcher)

This lets you apply a per-tenant default language only for users who never chose for themselves:

```ts
createBetterI18nMiddleware(config, async (request, { locale, isExplicit }) => {
  const tenant = readTenant(request);
  if (!isExplicit && tenant?.defaultLocale && locale !== tenant.defaultLocale) {
    return NextResponse.redirect(rewriteLocale(request, tenant.defaultLocale));
  }
});
```

Fully additive and backward-compatible: existing `({ locale, response })` callbacks keep working, and the new `detection.explicitCookieName` option defaults to `` `${cookieName}_explicit` ``.
