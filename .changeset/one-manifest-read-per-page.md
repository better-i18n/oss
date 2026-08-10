---
"@better-i18n/core": patch
---

Stop reading the manifest three times per page load.

Two independent causes, both on the critical path of a fresh document:

- `getManifestWithCache` had no in-flight coalescing, so callers that start in
  the same tick each missed the empty cache and each opened their own request.
  On mount the provider's `getLanguages()` and its revalidation do exactly
  that. Concurrent callers now share one promise per cache key.
- `revalidate()` fetched the manifest twice: once to learn the version it was
  replacing, then again with `forceRefresh` to learn the current one. The core
  now records which published version each locale's messages were built from
  when it loads them, so the freshness check is a single forced read compared
  against that. It also no longer fetches messages when nothing has been loaded
  for the locale yet, which used to race the initial load.

Measured on a prerendered site: three manifest requests per page load, two of
them overlapping, roughly a second of the critical path.
