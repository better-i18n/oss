---
"@better-i18n/core": patch
"@better-i18n/next": patch
---

Fix manifest and translations being served from browser disk cache.

The CDN sends `Cache-Control: public, max-age=14400` for manifest and `max-age=60` for translations. The existing `Cache-Control: no-store` **request header** only affects Cloudflare/proxy caches — it does not bypass the browser's own disk cache. Adding `cache: "no-store"` to the fetch options fixes this for both manifest and translations.

For the Next.js adapter, `createIsrFetch` now strips the `cache` property from init before adding `next: { revalidate }` — Next.js 14+ throws if both are present simultaneously.
