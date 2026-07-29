---
"@better-i18n/core": patch
---

Fix `getMessages` silently returning a partial namespace set when the CDN batch endpoint truncates its response (e.g. when the combined payload is large, dropping alphabetically-later namespaces). The batch response is now required to contain every requested namespace; on any shortfall the SDK rejects it and falls back to individual per-namespace fetches (one request each, no aggregate size cap), so pages never render with missing translations.
