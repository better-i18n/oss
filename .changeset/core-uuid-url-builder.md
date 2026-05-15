---
"@better-i18n/core": minor
---

Accept project UUID as an alternative to the `org/project` slug. When `projectId` (or legacy `project`) is a canonical UUID, `getProjectBaseUrl` produces `${cdnBaseUrl}/{uuid}` instead of `${cdnBaseUrl}/{org}/{project}` — a single-segment URL the CDN worker resolves to the same R2 file. UUID URLs are immune to project slug renames; the customer's app keeps working when someone edits the dashboard slug.

How to opt in:

```ts
// Slug (default) — same as before
createI18n({ projectId: "acme/dashboard", defaultLocale: "en" });

// UUID — new, immune to slug renames
createI18n({ projectId: "65d6ea91-7c00-44f3-a2a7-e864984f1cb3", defaultLocale: "en" });
```

`parseProject` and `NormalizedConfig` gain two fields:

- `pathSegment: string` — `"org/project"` or the lowercase UUID, used for URL construction.
- `isUuid: boolean` — `true` when the input was a UUID.

`workspaceId` / `projectSlug` remain on `NormalizedConfig` but are empty strings in UUID mode. Existing slug-mode code paths continue to work unchanged.

Downstream packages (`@better-i18n/next`, `/use-intl`, `/expo`, `/vite`, `/remix`, `/server`) inherit the new behavior automatically through `I18nCoreConfig` and pick it up when consumers update `@better-i18n/core` via caret semver — no separate changesets needed.
