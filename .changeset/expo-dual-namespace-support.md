---
"@better-i18n/expo": minor
---

feat: support both colon-notation and dot-notation translation patterns

All CDN namespaces are now merged into a unified `"translation"` namespace in addition
to being registered as individual namespaces. This means both usage styles work without
any configuration or workarounds:

- `t('auth:login')` — colon-notation with explicit namespace (unchanged)
- `t('auth.login')` — dot-notation via default `"translation"` namespace (new)
- `useTranslation('auth')` + `t('login')` — scoped namespace hook (unchanged)

`defaultNS` is now always `"translation"` instead of being resolved dynamically.
Language switching (`changeLanguage`, `languageChanged`) pre-loads both the merged
bundle and individual namespaces for the new locale.

**staticData format**: Pass locale messages directly (`staticData: { en, tr }`) —
no extra namespace wrapper is needed.
