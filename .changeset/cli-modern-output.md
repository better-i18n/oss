---
"@better-i18n/cli": minor
---

Auto-detect i18n hooks, fix config parsing, modernize terminal output

- **Auto-detect hooks**: `useT`, `useTranslations`, `useTranslation`, `useScopedT` recognized without `translationFunctions` config
- **Fix config parsing**: Balanced bracket matching for `ignorePatterns` with regex character classes (e.g., `/[Bb]etter/`)
- **Fix unbound count**: Non-translation calls (useState, useEffect, etc.) no longer inflate the unbound translator count
- **Modern output**: Framed score card with dim borders, inline category bars, cleaner diagnostics
