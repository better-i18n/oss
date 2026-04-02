---
"@better-i18n/use-intl": patch
---

Harden cookie fallback and fix core instance stability

- Escape cookie name in RegExp to prevent injection/SyntaxError
- Validate cookie value against BCP 47 pattern
- Move locale resolution to useState lazy initializer (perf)
- Fix TtlCache recreation on every locale switch by removing locale from i18nCore deps
- Support BCP 47 subtags (pt-BR, zh-Hans) in URL segment detection
