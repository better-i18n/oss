---
"@better-i18n/core": patch
---

Fix: remove Cache-Control: no-store in production to leverage CF shared edge cache

**Root cause of excessive CDN requests on Shopify Hydrogen (Oxygen):**

Cloudflare Workers' `caches.default` (used by the CDN Worker as its L1 cache) is the **same storage** as CF's outer HTTP cache for subrequests. Previously, the SDK sent `Cache-Control: no-store` on every CDN fetch, which bypassed this shared cache — forcing every Hydrogen Worker isolate to execute the CDN Worker even on cache hits.

This caused ~45K daily CDN requests for a single Shopify Hydrogen deployment vs ~5K for equivalent Next.js customers, because Hydrogen on Oxygen distributes traffic across 50+ CF edge nodes, each with independent in-memory TtlCache (cold on every isolate recycle).

**Fix:** In production, `no-store` is omitted. CF's shared edge cache now serves cached translation responses without invoking the CDN Worker, dramatically reducing CDN hits on globally-distributed CF Workers deployments.

**Dev mode unchanged:** `no-store` is preserved when `NODE_ENV=development` so translations are immediately fresh after publish during development.

**Cache freshness after publish is unaffected:** `caches.default.delete()` purges the same shared cache, so the next request after publish fetches fresh data from R2.
