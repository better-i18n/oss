---
"@better-i18n/expo": patch
---

Deprecate BetterI18nBackend in favor of initBetterI18n

- Add `@deprecated` JSDoc to BetterI18nBackend class and its re-export
- Fix changeLanguage callback type from `any` to `i18next.Callback`
- Reorder exports: initBetterI18n first, deprecated backend last
- Rewrite all docs to use initBetterI18n as the primary API
