# @better-i18n/admin

## 0.2.1

### Patch Changes

- ac22482: fix(analytics): make modelSlug optional in views() and stats()

  SDK was always passing modelSlug in the URL path, but the content tracker
  doesn't populate contentModelSlug (blob4 is empty in AE). This caused
  all analytics queries to return 0 results.

  Now modelSlug is optional — omit it to get all content.view events.

## 0.2.0

### Minor Changes

- b2ec66b: feat: add server-side admin SDK for programmatic platform access

  New `@better-i18n/admin` package — a typed, server-side SDK that wraps the Better i18n platform API. Scoped by `projectId` (same format as Content SDK: `"org/project"`), provides namespace-based access to projects, keys, translations, sync, languages, content (models + entries + fields), and analytics.

  ```ts
  import { createAdminClient } from "@better-i18n/admin";

  const admin = createAdminClient({
    apiKey: process.env.BETTER_I18N_API_KEY,
    projectId: "nomadvibe/packervibe",
  });

  const keys = await admin.keys.list({ search: "auth" });
  const views = await admin.analytics.views("blog-posts");
  await admin.translations.publish();
  ```
