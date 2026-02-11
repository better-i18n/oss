---
"@better-i18n/expo": minor
"@better-i18n/core": patch
---

Add `@better-i18n/expo` - i18next backend plugin for Expo/React Native with offline caching

**@better-i18n/expo:**
- i18next `BackendModule` with network-first strategy (always fresh translations)
- Persistent offline fallback via MMKV or AsyncStorage (auto-detected, zero config)
- Device locale detection via expo-localization
- `initBetterI18n()` convenience helper for one-liner setup

**@better-i18n/core:**
- Add `Cache-Control: no-cache` header to CDN fetch requests for proper cache revalidation
