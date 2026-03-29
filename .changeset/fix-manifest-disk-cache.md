---
"@better-i18n/core": patch
---

Fix manifest.json being served from browser disk cache for up to 4 hours.

The CDN response includes `max-age=14400` (4h) for browser caching. The existing `Cache-Control: no-store` request header only affects Cloudflare/proxy caches — it does not bypass the browser's own disk cache. Adding `cache: "no-store"` to the fetch options ensures the browser always fetches a fresh manifest, so newly published languages appear immediately without requiring a hard reload.
