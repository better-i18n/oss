---
"@better-i18n/core": minor
---

Add config-level `namespaces` option for selective CDN fetching. When set, `getMessages(locale)` only fetches the specified namespaces instead of all. Per-call `getMessages(locale, { namespaces })` overrides the config default. Also prefer batch endpoint for full v2 fetches when `manifest.batch` is true (single HTTP request instead of N parallel requests).
