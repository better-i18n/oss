---
"@better-i18n/core": patch
"@better-i18n/next": patch
---

Fix: auto-disable cache in dev mode, raise default prod TTL to 5 minutes

In development (`NODE_ENV=development`), the SDK now bypasses all caching so published translations are visible immediately on the next page refresh.

In production, the default `manifestCacheTtlMs` is raised from 60s to 5 minutes. This significantly reduces CDN requests for globally-distributed deployments like Shopify Hydrogen on Oxygen, where traffic is spread across many Cloudflare edge nodes (each with an independent in-memory cache).

For Next.js, ISR `revalidate` values are also set to `0` in dev mode, bypassing Next.js Data Cache entirely during development.
