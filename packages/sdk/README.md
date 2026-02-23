# @better-i18n/sdk

Content SDK for [Better i18n](https://better-i18n.com). A lightweight, typed client for fetching content models and entries from the headless CMS.

## Features

- 📦 **Zero Dependencies** — Runs anywhere with `fetch()`
- 🔒 **Type-Safe** — Full TypeScript types with generic custom fields
- 🌍 **Language-Aware** — Fetch localized content by language code
- 📄 **Pagination Built-in** — Paginated listing with total count and `hasMore`
- 🔍 **Filtering, Search & Sorting** — Filter by status, custom fields, full-text search
- ⚡ **Chainable Query Builder** — Supabase-style `from().eq().order().limit()` API
- 🛡️ **Error-Safe** — `{ data, error }` pattern — never throws on API errors

## Installation

```bash
npm install @better-i18n/sdk
```

## Quick Start

```typescript
import { createClient } from "@better-i18n/sdk";

const client = createClient({
  project: "acme/web-app",
  apiKey: process.env.BETTER_I18N_API_KEY!,
});

// List published blog posts (chainable API)
const { data: posts, error, total, hasMore } = await client
  .from("blog-posts")
  .eq("status", "published")
  .order("publishedAt", { ascending: false })
  .limit(10)
  .language("en");

// Get a single entry
const { data: post, error: postError } = await client
  .from("blog-posts")
  .expand("author", "category")
  .language("fr")
  .single("hello-world");

if (post) {
  console.log(post.title, post.body);
}
```

## Chainable Query Builder

The `from()` method returns an immutable, chainable query builder — inspired by Supabase JS.

Every chain method returns a **new** builder instance, so you can safely reuse base queries:

```typescript
const publishedPosts = client
  .from("blog-posts")
  .eq("status", "published");

// Reuse the base query
const recentPosts = await publishedPosts
  .order("publishedAt", { ascending: false })
  .limit(5);

const popularPosts = await publishedPosts
  .order("title", { ascending: true })
  .limit(10);
```

### Chain Methods

| Method | Description | Example |
| --- | --- | --- |
| `.select(...fields)` | Choose which fields to include | `.select("title", "body")` |
| `.eq(field, value)` | Filter by built-in field (status, etc.) | `.eq("status", "published")` |
| `.filter(field, value)` | Filter by custom field value | `.filter("category", "engineering")` |
| `.search(term)` | Full-text search on entry titles | `.search("kubernetes")` |
| `.language(code)` | Set language for localized content | `.language("fr")` |
| `.order(field, opts?)` | Set sort field and direction | `.order("publishedAt", { ascending: false })` |
| `.limit(n)` | Max entries per page (1-100) | `.limit(10)` |
| `.page(n)` | Page number (1-based) | `.page(2)` |
| `.expand(...fields)` | Expand relation fields | `.expand("author", "category")` |

### Terminal Methods

| Method | Description | Returns |
| --- | --- | --- |
| `.single(slug)` | Fetch a single entry by slug | `{ data, error }` |
| `await builder` | Execute list query (thenable) | `{ data, error, total, hasMore }` |

### Response Types

**List query returns `QueryResult<T[]>`:**

```typescript
{
  data: ContentEntryListItem[] | null;  // null on error
  error: Error | null;                   // null on success
  total: number;                         // total matching entries
  hasMore: boolean;                      // more pages available
}
```

**Single query returns `SingleQueryResult<ContentEntry>`:**

```typescript
{
  data: ContentEntry | null;  // null on error
  error: Error | null;        // null on success
}
```

### Examples

```typescript
// Full-text search
const { data: results } = await client
  .from("blog-posts")
  .search("kubernetes")
  .limit(5);

// Custom field filtering
const { data: techPosts } = await client
  .from("blog-posts")
  .filter("category", "engineering")
  .eq("status", "published")
  .language("en");

// Select specific fields + expand relations
const { data: entries } = await client
  .from("blog-posts")
  .select("title", "body")
  .expand("author")
  .order("publishedAt", { ascending: false });

// Pagination
const { data: page2, hasMore } = await client
  .from("blog-posts")
  .eq("status", "published")
  .limit(20)
  .page(2);
```

## Error Handling

The chainable API uses the `{ data, error }` pattern — it never throws on API errors:

```typescript
const { data, error } = await client
  .from("blog-posts")
  .eq("status", "published")
  .limit(10);

if (error) {
  console.error("Failed to fetch posts:", error.message);
  return;
}

// data is guaranteed non-null here
console.log(`Found ${data.length} posts`);
```

## Typed Custom Fields

Custom fields are returned flat — directly on the entry object (no `customFields` wrapper).
Use the generic type parameter for type-safe access:

```typescript
interface BlogFields {
  readingTime: string | null;
  category: string | null;
}

const { data: post } = await client
  .from("blog-posts")
  .single<BlogFields>("hello-world");

if (post) {
  post.readingTime; // string | null (typed!)
  post.category;    // string | null (typed!)
}
```

## Expanding Relations

Use `expand` to resolve related entries in a single request:

```typescript
const { data: posts } = await client
  .from("blog-posts")
  .expand("author", "category")
  .eq("status", "published");

if (posts) {
  posts[0].relations?.author?.title;    // "Alice Johnson"
  posts[0].relations?.author?.avatar;   // "https://..."
  posts[0].relations?.category?.title;  // "Engineering"
}
```

Each expanded relation is a `RelationValue` object with custom fields spread directly:

```typescript
type RelationValue = {
  id: string;
  slug: string;
  title: string;
  modelSlug: string;
} & Record<string, string | null>;
```

## Legacy API

The method-based API is still available for backward compatibility:

```typescript
// List content models
const models = await client.getModels();

// List entries (throws on error)
const { items, total, hasMore } = await client.getEntries("blog-posts", {
  status: "published",
  sort: "publishedAt",
  order: "desc",
  language: "en",
  limit: 10,
});

// Get single entry (throws on error)
const post = await client.getEntry("blog-posts", "hello-world", {
  language: "fr",
});
```

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project identifier in `org/project` format (e.g., `"acme/web-app"`) |
| `apiKey` | Yes | API key from [dashboard](https://dash.better-i18n.com) |
| `apiBase` | No | API base URL (default: `https://content.better-i18n.com`) |
| `debug` | No | Enable debug logging for request/response inspection |

## Documentation

Full documentation at [docs.better-i18n.com/sdk](https://docs.better-i18n.com/sdk)

## License

MIT © [Better i18n](https://better-i18n.com)
