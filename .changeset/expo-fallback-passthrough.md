---
"@better-i18n/expo": patch
---

Add staticData, fetchTimeout, and retryCount passthrough to core

- initBetterI18n and BetterI18nBackend now accept staticData, fetchTimeout, retryCount
- staticData enables offline-first: bundled translations work on first launch without network
- Backend tests updated for core's global cache behavior
