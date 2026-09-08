---
"@better-i18n/core": patch
---

Fetch translations from the immutable CDN snapshot when the manifest advertises `files[locale].version` (`/v/{version}/{locale}/{ns}.json`, served with a one-year `immutable` Cache-Control). Projects whose manifest has no version keep requesting the exact legacy URLs; nothing changes for them. `resolveTranslationUrl` and `localeSnapshotVersion` are exported for adapters that build URLs themselves.
