# Multilingual SEO + Static Generation Design

## Problem

The landing app serves 90+ marketing pages across multiple locales but:
- Sitemap lacks `xhtml:link hreflang` annotations (Google can't infer language relationships from sitemap)
- Blog posts are missing from sitemap entirely
- All pages are SSR-only (no static generation, higher TTFB)
- SEO metadata is generated at runtime on every request

## Solution

Use TanStack Start's native `pages` + `prerender` + `sitemap` config to:
1. Generate pages array at build time from SDK data (locales + blog posts)
2. Prerender marketing pages as static HTML
3. Generate sitemap.xml with `hreflang` alternateRefs per page
4. Keep blog detail pages as SSR for fresh content

## Architecture

```
Build Time:
  SDK.getLocales() -> ["en", "es", "fr", ...]
  SDK.getEntries("blog-posts") -> [{ slug, publishedAt, availableLanguages }]
      |
  generatePages() -> pages[] (marketing x locales + blog x languages)
      |
  TanStack Start prerender -> static HTML (marketing pages only)
  TanStack Start sitemap  -> sitemap.xml (ALL pages with hreflang)

Runtime:
  Blog detail -> SSR (SDK fetch + markdown render)
  Marketing   -> Static HTML from dist/client/
```

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SSG scope | Marketing pages prerendered | Best TTFB for Core Web Vitals |
| Blog detail | SSR only | Fresh content without rebuild |
| Blog in sitemap | Full metadata | slug + lastmod + availableLanguages + priority |
| Sitemap structure | Single sitemap (TanStack native) | Under 50K URLs; index addable later |
| Approach | TanStack Start Native | Framework-native, minimal custom code |
| HTML hreflang | Kept (dual signal) | Sitemap + HTML = strongest signal to Google |

## Files to Change

### New Files
- `src/seo/generate-pages.ts` - Build-time page generation logic

### Modified Files
- `vite.config.ts` - Add `tanstackStart({ pages, sitemap, prerender })` config

### Deleted Files
- `src/routes/sitemap[.]xml.ts` - Replaced by TanStack native sitemap

### Unchanged Files
- `src/lib/meta.ts` - HTML hreflang preserved (dual signal)
- `src/lib/structured-data.ts` - Schema.org preserved
- `public/robots.txt` - Updated only if sitemap path changes

## Page Generation Logic

### Marketing Pages (90+)

For each page in PAGES array, for each locale:
```typescript
{
  path: `/${locale}/${page.path}`,
  sitemap: {
    priority: page.priority,
    changefreq: page.changefreq,
    lastmod: today,
    alternateRefs: [
      ...allLocales.map(l => ({ href: `${SITE_URL}/${l}/${page.path}`, hreflang: l })),
      { href: `${SITE_URL}/en/${page.path}`, hreflang: "x-default" }
    ]
  },
  prerender: { enabled: true }
}
```

### Blog Posts

For each published blog post, for each available language:
```typescript
{
  path: `/${lang}/blog/${post.slug}`,
  sitemap: {
    priority: 0.7,
    changefreq: "weekly",
    lastmod: post.publishedAt,
    alternateRefs: [
      ...post.availableLanguages.map(l => ({
        href: `${SITE_URL}/${l}/blog/${post.slug}`,
        hreflang: l
      })),
      { href: `${SITE_URL}/en/blog/${post.slug}`, hreflang: "x-default" }
    ]
  },
  prerender: { enabled: false }  // SSR for blog detail
}
```

### Blog Listing Pages

For each locale:
```typescript
{
  path: `/${locale}/blog`,
  sitemap: {
    priority: 0.7,
    changefreq: "daily",
    alternateRefs: allLocaleRefs
  },
  prerender: { enabled: true }  // listing is prerendered
}
```

## Build Pipeline

1. `vite build` triggers TanStack Start plugin
2. Plugin calls `generatePages()` which fetches from SDK
3. Prerender processes pages with `prerender.enabled: true`
4. Sitemap generates from ALL pages (prerendered + SSR)
5. `bun run build:worker` compiles Cloudflare Worker
6. Worker serves static HTML for prerendered routes, SSR for rest

## Error Handling

- SDK fetch failure at build time: fail the build (blog posts must be in sitemap)
- Fallback locales: if SDK returns empty, use `["en"]` as minimum
- Blog post with no availableLanguages: only include source language

## Future Enhancements

- Sitemap index when URL count exceeds 10K
- Webhook-triggered rebuilds on CMS publish
- ISR (Incremental Static Regeneration) if TanStack Start adds support
