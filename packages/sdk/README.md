# @better-i18n/sdk

Content SDK for [Better i18n](https://better-i18n.com). A lightweight, typed client for fetching content models and entries from the headless CMS.

## Features

- 📦 **Zero Dependencies** — Runs anywhere with `fetch()`
- 🔒 **Type-Safe** — Full TypeScript types with generic custom fields
- 🌍 **Language-Aware** — Fetch localized content by language code
- 📄 **Pagination Built-in** — Paginated listing with total count and `hasMore`
- 🔍 **Filtering & Sorting** — Filter by status, sort by date or title
- ⚡ **Lightweight** — Thin wrapper over REST API

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

// List content models
const models = await client.getModels();

// List published blog posts
const { items, total, hasMore } = await client.getEntries("blog-posts", {
  status: "published",
  sort: "publishedAt",
  order: "desc",
  language: "en",
  limit: 10,
});

// Get a single entry with localized content
const post = await client.getEntry("blog-posts", "hello-world", {
  language: "fr",
});
console.log(post.title, post.body);
```

## API

| Method | Description |
| --- | --- |
| `getModels()` | List all content models with entry counts |
| `getEntries(modelSlug, options?)` | Paginated list of entries for a model |
| `getEntry(modelSlug, entrySlug, options?)` | Full content entry with all fields |

### `getEntries` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `string` | source language | Language code for localized content |
| `status` | `"draft" \| "published" \| "archived"` | all | Filter by entry status |
| `sort` | `"publishedAt" \| "createdAt" \| "updatedAt" \| "title"` | `"updatedAt"` | Sort field |
| `order` | `"asc" \| "desc"` | `"desc"` | Sort direction |
| `page` | `number` | `1` | Page number (1-based) |
| `limit` | `number` | `50` | Entries per page (1-100) |
| `fields` | `string[]` | all fields | Fields to include in response |
| `expand` | `string[]` | none | Relation field names to expand |

### `getEntry` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `language` | `string` | source language | Language code for localized content |
| `fields` | `string[]` | all fields | Fields to include in response |
| `expand` | `string[]` | none | Relation field names to expand |

### Response Types

**`getEntries` returns `PaginatedResponse<ContentEntryListItem>`:**

```typescript
{
  items: ContentEntryListItem[]; // id, slug, title, publishedAt, customFields, relations?
  total: number;                 // total matching entries
  hasMore: boolean;              // more pages available
}
```

**`getEntry` returns `ContentEntry<CF>`:**

```typescript
{
  id, slug, status, publishedAt, sourceLanguage, availableLanguages,
  title, body, customFields, relations?
}
```

## Typed Custom Fields

Use the generic type parameter for type-safe custom fields:

```typescript
interface BlogFields {
  readingTime: string | null;
  category: string | null;
}

const post = await client.getEntry<BlogFields>("blog-posts", "hello-world");
post.customFields.readingTime; // string | null (typed!)
post.customFields.category;   // string | null (typed!)
```

## Expanding Relations

Use `expand` to resolve related entries in a single request. Expanded relations are available under the `relations` key.

```typescript
const { items } = await client.getEntries("blog-posts", {
  expand: ["author", "category"],
});

// Access expanded relation fields
items[0].relations?.author?.title;                       // "Alice Johnson"
items[0].relations?.author?.modelSlug;                  // "users"
items[0].relations?.author?.customFields?.avatar;       // "https://..."
items[0].relations?.category?.title;                    // "Engineering"
```

Each expanded relation is a `RelationValue` object:

```typescript
interface RelationValue {
  id: string;
  slug: string;
  title: string;
  modelSlug: string;
  customFields?: Record<string, string | null>;
}
```

## Configuration

| Option | Required | Description |
| --- | --- | --- |
| `project` | Yes | Project identifier in `org/project` format (e.g., `"acme/web-app"`) |
| `apiKey` | Yes | API key from [dashboard](https://dash.better-i18n.com) |
| `apiBase` | No | API base URL (default: `https://content.better-i18n.com`) |

## Documentation

Full documentation at [docs.better-i18n.com/sdk](https://docs.better-i18n.com/sdk)

## License

MIT © [Better i18n](https://better-i18n.com)
