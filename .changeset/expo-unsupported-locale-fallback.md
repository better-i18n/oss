---
"@better-i18n/expo": patch
---

Fix unsupported device locale causing raw translation keys. When a device locale (e.g. Spanish) doesn't exist in the project's supported languages, the SDK now automatically pre-loads the fallback locale (defaultLocale) so i18next's fallbackLng works correctly. Previously, only the unsupported locale's empty translations were loaded, causing all t() calls to return raw keys.
