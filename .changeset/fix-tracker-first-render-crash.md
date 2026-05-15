---
"@better-i18n/content": patch
---

Fix first-render crash in React/Expo adapters where useTrackView threw because ContentProvider initialized the tracker in useEffect (async) while useContent checked for null context during render (sync). Tracker is now created synchronously via useState initializer since createTracker is pure and SSR-safe.
