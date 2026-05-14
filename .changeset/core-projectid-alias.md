---
"@better-i18n/core": minor
---

Accept `projectId` as the canonical field on `I18nCoreConfig`, with `project` retained as a legacy alias for backward compatibility.

**Why:** The dashboard, Analytics SDK (`@better-i18n/content`), and Content SDK (`@better-i18n/sdk`) all call this value "Project ID". `@better-i18n/core` (the foundation imported by `next`, `use-intl`, `expo`, `vite`, `remix`, and `server`) used `project`, causing copy-paste-from-docs friction.

All downstream framework adapters (`next`, `use-intl`, etc.) inherit `I18nCoreConfig`, so this change ripples through automatically — they all accept `projectId` now without their own changesets.

**Migration (optional, no urgency):**

```ts
// Before
createI18n({ project: "acme/web-app", defaultLocale: "en" })

// After (recommended)
createI18n({ projectId: "acme/web-app", defaultLocale: "en" })
```

The legacy `project` field continues to work indefinitely. Existing integrations require no changes.

Internal `NormalizedConfig.project` is preserved as the resolved canonical slug, so framework code reading `normalized.project` keeps working.
