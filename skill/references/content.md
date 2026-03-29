---
title: Content CMS — Localized Models, SDK, and MCP
---

> **Docs:** https://docs.better-i18n.com/sdk.mdx · [Getting Started](https://docs.better-i18n.com/sdk/getting-started.mdx) · [Models & Entries](https://docs.better-i18n.com/sdk/models-and-entries.mdx) · [API Reference](https://docs.better-i18n.com/sdk/api-reference.mdx) · [TypeScript](https://docs.better-i18n.com/sdk/typescript.mdx)

# Content CMS

Better i18n's Content CMS stores structured, multilingual content — blog posts, landing pages, changelogs, product descriptions, legal docs. It's separate from translation keys (which are UI strings).

**API base:** `https://content.better-i18n.com`
**SDK:** `@better-i18n/sdk`
**MCP server:** `@better-i18n/mcp-content`

---

## Content SDK (`@better-i18n/sdk`)

```bash
npm install @better-i18n/sdk
```

### Create client (singleton)

```typescript
import { createClient } from "@better-i18n/sdk";

export const content = createClient({
  project: "acme/web",       // "org/project"
  apiKey: "bi18n_...",       // read-only key is fine for public content
  debug: false,
});
```

### Chainable query builder (recommended)

```typescript
// List published blog posts, newest first
const { data, error, total, hasMore } = await content
  .from("blog-posts")
  .eq("status", "published")
  .language("tr")
  .order("publishedAt", { ascending: false })
  .limit(10)
  .page(1);

// Single entry by slug
const { data: post, error } = await content
  .from("blog-posts")
  .language("fr")
  .single("hello-world");
```

**Available chain methods:**

| Method | Description |
|---|---|
| `.from("model-slug")` | Select content model |
| `.language("tr")` | Fetch translated content in this locale |
| `.eq("field", value)` | Filter by field value |
| `.status("published")` | Filter by entry status |
| `.order("publishedAt", { ascending: false })` | Sort: `publishedAt`, `createdAt`, `updatedAt`, `title` |
| `.limit(n)` | Max results, up to 100 |
| `.page(n)` | Pagination |
| `.fields(["title", "excerpt"])` | Select specific fields |
| `.expand(["author", "category"])` | Expand relation fields |
| `.single("slug")` | One entry by slug → `{ data, error }` |

### Entry type

```typescript
interface ContentEntry<CF = Record<string, unknown>> {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  title: string;
  body?: string;              // Markdown source
  bodyHtml?: string;          // rendered HTML (sanitize before rendering)
  bodyMarkdown?: string;      // same as body
  availableLanguages: string[];
  availableLanguageDetails: { code: string; label: string }[];
  translationStatus: Record<string, "translated" | "missing">;
  relations: Record<string, RelationValue | RelationValue[]>;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Custom fields are spread at top level
  [key: string]: unknown;
}
```

Note: Always sanitize `bodyHtml` with a library such as DOMPurify before injecting into the DOM.

### Next.js ISR pattern

```typescript
// app/blog/[slug]/page.tsx
import { content } from "@/lib/content";

export async function generateStaticParams() {
  const { data } = await content.from("blog-posts").eq("status", "published").limit(100);
  return (data ?? []).map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string; locale: string } }) {
  const { data: post } = await content
    .from("blog-posts")
    .language(params.locale ?? "en")
    .single(params.slug);

  if (!post) notFound();
  // Use a markdown renderer like next-mdx-remote or react-markdown instead of raw HTML
  return <article>{renderMarkdown(post.body ?? "")}</article>;
}
```

---

## Content MCP (`@better-i18n/mcp-content`) — 19 tools

### Workflow order

```
listContentModels → getContentModel → listContentEntries
                              ↓               ↓
                   createContentModel    getContentEntry
                   addField              updateContentEntry → bulkPublishEntries
```

### Read-only tools

**`listContentModels({ project })`**
List all models: slug, displayName, kind, entryCount, field count.

**`getContentModel({ project, modelSlug })`**
Full model definition: fields, includeBody, kind, slug. Call before adding fields to check for name collisions.

**`listContentEntries({ project, modelSlug, search?, languages?, status?, missingLanguage?, limit?, page? })`**
List entries with filters.

- **`missingLanguage`** — finds entries where a given language is NOT yet translated. Use this when finding untranslated content, not `language=`.
- `search`: string or string array for multi-term search
- `status`: `"draft"` | `"published"` | `"archived"` | `"all"`

**`getContentEntry({ project, modelSlug, slug, expand?, compact? })`**
Full entry with all translations and custom field values. `compact: true` reduces token count by ~70%.

### Entry write tools

**`createContentEntry({ project, modelSlug, slug, title, body?, status, translations, customFields? })`**
Create a new entry. **Pass ALL language translations in the same call** — do not create first and then loop-update per language.

```json
{
  "project": "acme/web",
  "modelSlug": "blog-posts",
  "slug": "our-new-feature",
  "title": "Our New Feature",
  "body": "# Our New Feature\n\nWe just shipped...",
  "status": "draft",
  "translations": {
    "tr": { "title": "Yeni Özelliğimiz", "body": "# Yeni Özelliğimiz\n\nAz önce gönderdik..." },
    "de": { "title": "Unser neues Feature", "body": "# Unser neues Feature\n\nWir haben gerade..." }
  }
}
```

**`updateContentEntry({ project, modelSlug, slug, ... })`**
Update a single entry's translation or metadata.

**`publishContentEntry({ project, modelSlug, slug })`**
Publish a single entry.

**`duplicateContentEntry({ project, modelSlug, slug, newSlug })`**
Copy an entry to a new slug (all translations copied).

**`bulkCreateEntries({ project, modelSlug, entries[] })`**
Create up to 20 entries at once.

**`bulkUpdateEntries({ project, modelSlug, updates[] })`**
Update up to 20 entries at once.

**`bulkPublishEntries({ project, modelSlug, slugs[] })`**
Publish up to 50 entries at once.

### Model management tools

**`createContentModel({ project, slug, displayName, description?, kind?, includeBody?, fields? })`**
Create a new model. `kind`: `"collection"` (multiple entries) | `"singleton"` (one entry, e.g. homepage).

**`updateContentModel({ project, modelSlug, displayName?, description?, icon? })`**
Updates display metadata only. Structural settings (`includeBody`, `kind`, `slug`) are never changed unless explicitly requested.

### Field management tools

**`addField({ project, modelSlug, name, displayName, type, required?, localized?, enumValues? })`**
Add a custom field. Always call `getContentModel` first to check for name collisions.

**Field types:** `text`, `textarea`, `richtext`, `number`, `boolean`, `date`, `datetime`, `enum`, `media`, `relation`, `user_select`

**`updateField({ project, modelSlug, fieldName, ... })`**
Update field properties.

**`reorderFields({ project, modelSlug, fieldNames[] })`**
Set field display order.

### Destructive tools

**`deleteContentEntry({ project, modelSlug, slug })`**
**HARD DELETE — irreversible. No soft-delete, no recovery.**

**`deleteContentModel({ project, modelSlug })`**
Delete entire model and ALL its entries.

**`removeField({ project, modelSlug, fieldName })`**
**DESTRUCTIVE — deletes ALL field values across ALL entries, irreversible.**

---

## Content model design rules

- **Taxonomy / lookup models** (categories, tags) — do NOT enable `includeBody`. Keep lightweight with only metadata fields.
- **Model updates are additive only** — add new fields; never change `includeBody`, `kind`, or `slug` unless explicitly requested.
- **Localized fields** — set `localized: true` on fields that differ per language (title, body, excerpt). Set `localized: false` for universal fields (publishedAt, featuredImageUrl, authorId).
- **Relation fields** are always `localized: false` — relations are language-independent.

---

## Bulk translate all missing content (AI agent workflow)

```
1. listContentModels                               → discover available models
2. listContentEntries({ missingLanguage: "tr" })   → find untranslated entries
3. getContentEntry(..., compact: true)             → read source content efficiently
4. [AI translates title + body + custom fields]
5. bulkUpdateEntries                               → write all translations
6. bulkPublishEntries                              → deploy
```
