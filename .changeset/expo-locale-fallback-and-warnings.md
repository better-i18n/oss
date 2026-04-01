---
"@better-i18n/expo": minor
---

Fix critical bug where unsupported device locales caused raw translation keys to appear. When a device language (e.g. Italian) isn't in the project's supported languages, the SDK now falls back to defaultLocale instead of loading empty translations. Also adds defense-in-depth warnings for missing storage, empty staticData, namespace drift, and useDeviceLocale without localeKey.
