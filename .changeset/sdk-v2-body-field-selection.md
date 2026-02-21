---
"@better-i18n/sdk": major
---

**Breaking:** Simplified `ContentEntry` type and unified body field.

### Breaking Changes

**`ContentEntry`**
- `body` is now `string | null` (Markdown string) — was `Record<string, any> | null` (Plate JSON)
- Removed: `bodyHtml`, `bodyMarkdown` — use `body` instead
- Removed: `featuredImage`, `tags`, `author`, `excerpt`, `metaTitle`, `metaDescription` — these fields do not exist in the database and were never populated

**`ContentEntryListItem`**
- Removed: `excerpt`, `featuredImage`, `tags`, `author` — same reason as above
- Added: `body?: string | null` — Markdown body, only present when requested via `fields`
- Added: `customFields?: Record<string, string | null>` — custom field values, only present when requested

### New Features

**Field selection** — `fields` option on both `getEntries` and `getEntry`:

```typescript
// Only fetch what you need
const { items } = await client.getEntries("blog-posts", {
  fields: ["title", "body", "category"],
});

const post = await client.getEntry("blog-posts", "hello-world", {
  fields: ["title", "body"],
});
```

When `fields` is omitted, all fields are returned (no breaking change for read-all usage).
Base fields (`id`, `slug`, `status`, `publishedAt`, `sourceLanguage`, `availableLanguages`) are always included.

### Migration

```typescript
// Before
post.bodyMarkdown  // string | null
post.bodyHtml      // string | null
post.body          // Record<string, any> | null  ← Plate JSON

// After
post.body          // string | null  ← Markdown string
```
