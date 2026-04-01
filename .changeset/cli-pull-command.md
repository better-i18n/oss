---
"@better-i18n/cli": minor
---

Add `pull` command to download translations from CDN to local JSON files. Essential for mobile apps where bundled translations serve as offline fallback during App Store Review, airplane mode, or slow networks. Supports auto-detection from `i18n.config.ts` or `initBetterI18n()` calls, and a new `pull` config section for output directory and locale filtering.
