---
"@better-i18n/remix": minor
---

Add `localePrefix` config + `getLocaleFromRequest` / `buildLocalePath` / `replaceLocaleInPath`

`createRemixI18n` now accepts a `localePrefix` option (mirrors `@better-i18n/next` and `use-intl`) to control URL-based locale routing:

- `"as-needed"` (default): only non-default locales get a prefix (`/tr/about`, `/about`)
- `"always"`: every locale gets a prefix including the default (`/en/about`, `/tr/about`)
- `"never"`: no URL prefix; detection falls back to cookie → Accept-Language → default

New methods on the returned instance:

- `getLocaleFromRequest(request)` — replaces custom locale-detection helpers; CDN-independent
  (validates URL segment against CDN list with BCP 47 regex fallback on cold start / miss)
- `buildLocalePath(path, locale)` — builds locale-prefixed path respecting config
- `replaceLocaleInPath(path, newLocale)` — swaps locale prefix in an existing path

`detectLocale(request)` is now `@deprecated`; use `getLocaleFromRequest` instead.
