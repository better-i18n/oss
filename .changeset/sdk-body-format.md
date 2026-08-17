---
"@better-i18n/sdk": minor
---

Add `.bodyFormat()` to the query builder.

The delivery API can return an entry body in three representations. Markdown
(the default) and HTML are projections of the stored document, and blocks that
plain Markdown has no syntax for — callouts, toggles, columns, equations,
media — are written as tags or flattened. `bodyFormat("plate")` returns the
stored document itself, which is lossless, for clients that render rich content
with their own components.

`ContentEntry` gained a second type parameter for the body type, defaulting to
`string`, so existing code is unaffected. Pass `ContentBodyNode[]` when querying
with `plate`:

```ts
const { data } = await client
  .from("blog-posts")
  .bodyFormat("plate")
  .single<Record<string, string | null>, ContentBodyNode[]>("hello-world");
```
