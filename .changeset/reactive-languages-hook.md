---
"@better-i18n/expo": minor
---

Add reactive `useLanguages()` hook and `refreshLanguages()` to prevent empty language list on fast cold starts

`getLanguages()` is synchronous and returns `[]` before `initBetterI18n` completes. In production builds (no Metro overhead), users can navigate to language settings before init finishes, seeing an empty list.

New exports:
- `useLanguages()` — React hook using `useSyncExternalStore` that returns `[]` initially and automatically re-renders when languages are loaded
- `refreshLanguages()` — Re-fetches language list from CDN, updates cache, and notifies all subscribers (useful for pull-to-refresh)
- `subscribeLanguages(listener)` — Low-level subscription for non-React consumers
- `getLanguagesSnapshot()` — Snapshot function for `useSyncExternalStore` compatibility
