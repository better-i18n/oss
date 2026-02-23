---
"@better-i18n/sdk": major
---

feat!: Supabase-style chainable query builder + flat custom field access

### New API — chainable `from()` builder

```typescript
// List entries
const { data, error, total, hasMore } = await client
  .from("blog-posts")
  .eq("status", "published")
  .order("publishedAt", { ascending: false })
  .limit(10)
  .language("en");

// Single entry
const { data: post, error } = await client
  .from("blog-posts")
  .expand("author", "category")
  .language("fr")
  .single("hello-world");
```

- `ContentQueryBuilder` — immutable chainable builder with `.select()`, `.eq()`, `.filter()`, `.search()`, `.language()`, `.order()`, `.limit()`, `.page()`, `.expand()`, `.single()`
- `SingleQueryBuilder` — thenable builder for single-entry fetches
- All results use a `{ data, error }` pattern (never throws) — `QueryResult<T>` / `SingleQueryResult<T>`
- Internal HTTP layer extracted to `http.ts`; `createHttpClient` exported

### Breaking: flat custom field access

Custom fields are now spread directly on entry and relation objects instead of nested under `customFields`:

```typescript
// Before (v2)
entry.customFields.readTime
relation.customFields?.avatar

// After (v3)
entry.readTime
relation.avatar
```

- `ContentEntry<CF>` changed to intersection type `& CF` — `customFields` property removed
- `ContentEntryListItem<CF>` changed to intersection type `& CF` — `customFields` property removed
- `RelationValue` changed to `& Record<string, string | null>` — `customFields` property removed
- `RelationValue.customFields` removed; relation custom fields are now top-level properties

### Deprecations

- `client.getEntries()` — use `client.from(model)` instead
- `client.getEntry()` — use `client.from(model).single(slug)` instead
- `createContentAPIClient` — use `createHttpClient` from `./http.js` instead
