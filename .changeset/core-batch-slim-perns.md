---
"@better-i18n/core": minor
---

Three additive performance improvements for v2 (namespaced) CDN delivery. All changes are backward compatible — older manifests and SDK consumers see zero behavioral change.

- **Selective namespace loading + per-namespace caching:** `getMessages()` accepts an optional `namespaces` array. Each namespace is cached individually, so cross-page navigation reuses shared namespaces (common, nav, footer) instead of refetching everything. Full-fetch path (no `namespaces` option) is untouched.
- **Batch namespace fetching (tRPC-style):** When the manifest declares `batch: true`, multiple uncached namespaces are fetched in a single HTTP request via `/{locale}/batch.json?ns=...`. Falls back automatically to parallel individual fetches if the batch endpoint fails or returns an unexpected shape.
- **Slim manifest support:** Detects manifests that expose namespaces as a top-level `string[]` (~1KB) instead of per-locale objects with URLs/sizes (~240KB). URLs are constructed deterministically. Both formats continue to work.
