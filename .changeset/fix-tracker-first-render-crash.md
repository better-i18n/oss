---
"@better-i18n/content": patch
---

Fix first-render crash in React/Expo/Vue adapters:

- **Sync tracker init**: ContentProvider now creates the tracker synchronously via `useState` initializer instead of deferring to `useEffect`. Since `createTracker` is pure and SSR-safe (`track()` is a no-op outside browser), this is safe in all environments.
- **Graceful degradation**: `useContent()` no longer throws when called outside a provider. Instead it logs a one-time `console.warn` and returns a no-op context — matching the pattern used by PostHog, Segment, and other production analytics SDKs. Svelte adapter already had this behavior.
