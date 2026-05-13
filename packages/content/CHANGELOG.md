# @better-i18n/content

## 0.2.0

### Minor Changes

- 31969f1: Initial release of the Content Analytics SDK. Track content views with framework adapters for Next.js, React, Expo, Svelte, Vue, and vanilla JS. Writes go to `content.better-i18n.com/v1/track`, ingested into Cloudflare Analytics Engine, queryable from the Better i18n dashboard.

  Features:
  - `sendBeacon` → `fetch keepalive` → `fetch` transport chain
  - SSR + build-time guards (no execution during Next.js static generation)
  - Property validation (throws in dev, strips in prod)
  - StrictMode-safe React init via `useEffect` + `useRef`
  - `useTrackView` hook for one-shot view tracking
  - Subpath exports per framework (`sideEffects: false`)
  - Test utilities at `@better-i18n/content/test`

  Phase 1: explicit `track()` only. Phase 2 (planned): batch queue with retry, identity merge, per-IP/project rate limits.
