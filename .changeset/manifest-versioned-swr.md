---
"@better-i18n/core": minor
"@better-i18n/use-intl": minor
---

**SWR freshness for client-side SDKs — manifest-versioned cache + revalidate on focus/visibility.**

Long-lived tabs (Vite SPAs, static builds) no longer need a full reload to pick up newly published translations. Publish-to-live window drops from "up to the client cache TTL" (previously unbounded against `localStorage`) to "next focus / visibility event" — typically a few hundred milliseconds.

### What changed

**`@better-i18n/core`**
- `getMessages()` cache keys now include the manifest-reported version for each locale (`files[locale].lastModified`, falling back to `manifest.updatedAt`). When the CDN publishes new content the version moves, every cached entry is orphaned, and the next call goes to origin. No stale hits, no TTL tuning.
- New `i18nCore.revalidate(locale)` — forces a manifest freshness check. Compares the cached manifest version with origin; if unchanged it exits without fetching messages. If changed it fetches fresh and notifies subscribers. Cheap: typical path is a single ETag-aware manifest fetch (~5KB, often 304).
- New `i18nCore.onMessagesUpdate(listener)` — subscribe to fresh messages from background revalidation. Returns an unsubscribe function.
- New `MessagesUpdateEvent` / `MessagesUpdateListener` types exported.
- Existing `getMessages` / `getManifest` / `getLocales` / `getLanguages` signatures unchanged — this release is additive.

**`@better-i18n/use-intl`**
- `BetterI18nProvider` subscribes to `i18nCore.onMessagesUpdate` and swaps fresh messages into state automatically when a background revalidation fetches newer content.
- `BetterI18nProvider` now wires `visibilitychange` and `focus` listeners to call `i18nCore.revalidate(locale)`. Dashboards and other long-lived SPA tabs now revalidate every time they regain focus. Infrastructure-agnostic — pure browser APIs, no Cloudflare / Worker coupling.
- The previous "skip the fetch when initial SSR messages match the current locale" short-circuit has been removed. `getMessages` is now always called on mount; with the new version-aware cache it's a memory-cache hit with zero CDN traffic, but it also lets core kick off a background revalidation if the cached version is stale.

### Migration

None required. The public surfaces of both packages are backwards compatible. The only runtime change consumers should notice is that stale content self-heals — you can delete any manual "refresh messages" hacks you wrote to work around the previous behavior.

### Companion platform change (BETTER-248)

This release assumes the CDN honors `Cache-Control` sanely and invalidates manifest / translation cache at the edge on publish. The required platform changes ship separately in `better-i18n-cdn` — manifest served with `s-maxage=0` and a Cloudflare Management API global purge on every `/purge` call. Without that change, this SDK still works correctly — it just inherits whatever staleness the CDN edge introduces (previously up to 10 minutes for manifest, now effectively zero).
