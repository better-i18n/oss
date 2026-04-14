---
"@better-i18n/use-intl": patch
---

Pass all core config fields (including `namespaces`) through to `createI18nCore` via spread instead of listing each field individually. This ensures new core options like config-level `namespaces` automatically flow through without needing use-intl changes.
