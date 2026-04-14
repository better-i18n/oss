---
"@better-i18n/next": minor
---

Expose full `getMessages(locale, { namespaces })` signature from core — previously narrowed to `(locale: string)` only. Config-level `namespaces` option now flows through to both internal core instances. Reduces code duplication in `createNextI18nCore` with shared `coreFields` object.
