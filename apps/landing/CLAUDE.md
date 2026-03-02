# Better i18n Landing — SEO & AI Visibility Engine

## Purpose

This is **not** a typical landing page. It's an SEO marketing machine and AI visibility engine for [better-i18n.com](https://better-i18n.com). Every page, route, and content piece exists to:

1. **Rank for i18n/localization keywords** — programmatic SEO pages targeting framework guides, comparison pages, industry verticals, and educational content
2. **Feed AI models** — `llms.txt` is auto-generated at build time so LLMs (ChatGPT, Claude, Perplexity) can reference Better i18n accurately
3. **Drive conversions** — persona pages (for-developers, for-agencies, etc.) funnel users to the dashboard

## Stack

- **Framework:** TanStack Start (React 19) + TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4
- **Content:** Better i18n Content SDK (`@better-i18n/sdk`) — blog posts + marketing pages from CMS
- **i18n:** `@better-i18n/use-intl` + `@better-i18n/core` — dogfooding our own product
- **Hosting:** Cloudflare Workers (custom worker entry with security headers)
- **Build:** Vite 7 + esbuild (worker bundle)
- **Testing:** Vitest + Testing Library

## Commands

```
bun run dev          # Dev server on :3001
bun run build        # Production build (SSG + sitemap + llms.txt)
bun run test         # Vitest
bun run deploy       # Build + Cloudflare deploy
wrangler dev         # Preview production worker on :8990
wrangler tail        # Stream production logs
```

## Key Architecture

### Routing: `src/routes/$locale/`

All marketing routes are locale-prefixed. Root `__root.tsx` handles:
- Locale detection from URL path
- Auto-redirect non-locale paths → `/{defaultLocale}/{path}` (301)
- i18n message loading via `getMessages()` server function
- `BetterI18nProvider` wrapping

**Route pattern for new pages:**
```tsx
export const Route = createFileRoute("/$locale/page-name")({
  loader: createPageLoader(),
  head: ({ loaderData }) => getPageHead({
    messages: loaderData?.messages || {},
    locale: loaderData?.locale || "en",
    pageKey: "pageName",
    pathname: "/page-name",
    pageType: "default",  // or "framework" | "comparison" | "educational"
  }),
  component: PageComponent,
});
```

### SEO Pipeline: `src/seo/`

Build-time SEO generation (runs in `vite.config.ts`):
- `pages.ts` — Single source of truth for all marketing page definitions (priority, changefreq, prerender)
- `generate-pages.ts` — Fetches locales + blog posts + features from API, generates sitemap entries with hreflang
- `llms-txt.ts` — Generates `/llms.txt` for AI model consumption

**When adding a new page:** Update `MARKETING_PAGES` in `pages.ts` AND `PAGE_TITLES` in `llms-txt.ts`.

### SEO Utilities: `src/lib/`

- `page-seo.ts` — `getPageHead()` generates complete head data (meta, OG, canonical, hreflang, structured data)
- `structured-data.ts` — JSON-LD schema generators (Organization, Article, FAQ, HowTo, Product, TechArticle, etc.)
- `meta.ts` — Meta tag formatters, OG image URL builder, canonical/alternate link generators
- `content.ts` — Better i18n Content SDK client for blog posts + marketing pages

### Content from CMS

Blog posts and marketing pages are fetched from Better i18n Content API:
- **Models:** `blog-posts`, `marketing-pages`
- **SDK:** `@better-i18n/sdk` with `createClient({ project, apiKey })`
- **Relations:** `author`, `category` (use `expand: ["author", "category"]`)
- **Markdown rendering:** `marked` for body → HTML conversion

### Components: `src/components/`

- `MarketingLayout.tsx` — Header + Footer + optional CTA wrapper
- `FrameworkComparison.tsx` — Reusable sections for i18n framework pages
- `CmsPersonaPage.tsx` — Dynamic persona pages from CMS content
- `ComparisonTable.tsx` — Feature comparison tables for vs-competitor pages
- `blog/` — Blog-specific components (BlogContent, TableOfContents, ReadingProgress, etc.)

## Environment Variables

```
BETTER_I18N_CONTENT_API_KEY  # Content SDK API key (required for build + runtime)
BETTER_I18N_PROJECT          # Project identifier: "better-i18n/landing"
```

## Better i18n MCP Integration

This project uses Better i18n MCP tools for content and translation management. Available via Claude Code:

### Content MCP (`better-i18n-content`)
- `listContentModels` / `getContentModel` — Inspect CMS schema
- `listContentEntries` / `getContentEntry` — Read blog posts, marketing pages
- `createContentEntry` / `updateContentEntry` — Create/edit content
- `publishContentEntry` / `bulkPublishEntries` — Publish workflow
- Content models: `blog-posts`, `marketing-pages`

### Translation MCP (`better-i18n`)
- `listKeys` / `getTranslations` — Read translation keys
- `createKeys` / `updateKeys` — Manage translations
- `publishTranslations` — Push translations live
- `getPendingChanges` — Review unpublished changes
- Project: `better-i18n/landing`

### Typical MCP Workflows
- **New blog post:** `createContentEntry` → write content → `publishContentEntry`
- **Translation update:** `updateKeys` → `getPendingChanges` → `publishTranslations`
- **New marketing page:** Add route file + update `pages.ts` + `llms-txt.ts` + create CMS entry

## Content Strategy

### Page Categories
| Category | Path Pattern | Purpose |
|---|---|---|
| Framework guides | `/i18n/{framework}` | Target "[framework] i18n" keywords |
| Comparison pages | `/compare/{competitor}` | Target "vs [competitor]" keywords |
| Persona pages | `/for-{role}` | Target role-based intent |
| SEO pillar pages | `/i18n/{topic}` | Target high-volume i18n/l10n keywords |
| Educational | `/what-is-*`, `/i18n/complete-guide` | Target informational queries |
| Blog | `/blog/{slug}` | Fresh content, long-tail keywords |

### Structured Data
Every page gets JSON-LD schemas via `structured-data.ts`:
- All pages: Organization + BreadcrumbList
- Homepage: + SoftwareApplication + WebSite
- Framework pages: + TechArticle
- Comparison pages: + WebPage with Speakable
- Blog posts: + Article/BlogPosting
- Pricing: + Product with Offers

## Conventions

- **Translations:** Use `useT("namespace")` hook, keys follow `namespace.section.key` pattern
- **SEO meta:** Always use `getPageHead()` — never manually construct head data
- **New page checklist:** Route file + `pages.ts` + `llms-txt.ts` + i18n keys + structured data
- **Immutable patterns:** All SEO types use `readonly` properties
- **Path alias:** `@/` maps to `src/`
