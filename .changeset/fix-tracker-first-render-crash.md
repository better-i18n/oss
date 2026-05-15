---
"@better-i18n/content": minor
---

Analytics SDK overhaul — three critical fixes:

- **Sync tracker init**: ContentProvider now creates the tracker synchronously via `useState` initializer instead of deferring to `useEffect`. Fixes first-render crash when `useTrackView` is used.
- **Graceful degradation**: `useContent()` no longer throws when called outside a provider. Logs a one-time warning and returns a no-op context — matching PostHog/Segment pattern.
- **sendBeacon auth fix**: `apiKey` is now included in the event body so `sendBeacon` (which cannot set custom headers) can authenticate. `fetch` fallbacks also send `x-api-key` header for backwards compatibility.
