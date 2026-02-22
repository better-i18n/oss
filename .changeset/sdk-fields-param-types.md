---
"@better-i18n/sdk": patch
---

fix: extend SDK types for fields param and optional list item fields

- Add `fields?: string[]` to `ListEntriesOptions` to allow requesting specific fields in entry list responses
- Add optional `body?` and `customFields?` fields to `ContentEntryListItem` (present only when explicitly requested via `fields`)
- Fix `ClientConfig` JSDoc URL (`dash.better-i18n.com` → `content.better-i18n.com`)
- Update README with fields param usage example
