---
"@better-i18n/core": patch
---

Treat empty CDN responses as failures to activate the fallback chain. The CDN always returns HTTP 200 even for non-existent locales (with `{}` or `{ fallback: true }`), which previously bypassed the storage → staticData fallback chain. Empty and fallback-marker responses now throw, allowing persistent storage and bundled translations to serve as safety nets. This fixes raw translation keys appearing when a locale doesn't exist in the project.
