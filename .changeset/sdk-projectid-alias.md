---
"@better-i18n/sdk": minor
---

Accept `projectId` as the canonical field name in `createClient`, with `project` retained as a legacy alias for backward compatibility.

**Why:** The Analytics SDK (`@better-i18n/content`) uses `projectId` and the dashboard / Settings panel call it "Project ID". Naming the field `project` in the Content SDK while the same concept is `projectId` everywhere else caused integrator confusion. Aligning on `projectId` also signals that the value is a stable identifier — renaming the project's display name in the dashboard does not change the slug.

**Migration (optional, no urgency):**

```ts
// Before
createClient({ project: "acme/web-app", apiKey: "bi18n_..." })

// After (recommended)
createClient({ projectId: "acme/web-app", apiKey: "bi18n_..." })
```

The legacy `project` field continues to work indefinitely. Existing integrations need no changes.
