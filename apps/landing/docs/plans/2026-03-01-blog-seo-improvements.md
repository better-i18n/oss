# Blog SEO Improvements Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Fix critical SEO gaps in blog detail pages — empty meta descriptions, missing schema fields, weak internal linking, and missing TOC.

**Architecture:** All changes are in the landing app's blog detail page (`$slug.tsx`), content layer (`content.ts`), HTML parser (`BlogContent.tsx`), and structured data utilities.

**Tech Stack:** TanStack Start, React, html-react-parser, marked, @better-i18n/sdk

---

### Task 1: Extract excerpt and populate meta descriptions

**Files:**
- Modify: `apps/landing/src/lib/content.ts` — add `excerpt` field to `BlogPost` and `BlogPostListItem`
- Modify: `apps/landing/src/routes/$locale/blog/$slug.tsx` — use excerpt in all description meta tags + article schema

**Requirements:**
1. Add `excerpt: string | null` to `BlogPost` and `BlogPostListItem` interfaces
2. In `getBlogPost()`, after converting body to HTML, extract the first ~155 characters of plain text from `entry.body` (strip markdown). Use a simple approach: strip markdown formatting, take first 155 chars, add ellipsis if truncated.
3. In `getBlogPosts()`, do the same extraction from the list item body field (if available) or leave null
4. In `$slug.tsx` head function, replace all empty `""` description values with the excerpt:
   - `{ name: "description", content: excerpt }` (line 87)
   - `{ property: "og:description", content: excerpt }` (line 89)
   - `{ name: "twitter:description", content: excerpt }` (line 103)
5. Pass excerpt to `getArticleSchema({ description: excerpt })` (line 63)

**Acceptance criteria:**
- Meta description, og:description, twitter:description all populated with excerpt text
- Article schema `description` field populated
- Excerpt is max 160 chars, plain text (no markdown/HTML), ends cleanly (word boundary + ellipsis)
- If body is null/empty, excerpt falls back to empty string (no crash)

---

### Task 2: Fix breadcrumb locale and add article:section/tag meta

**Files:**
- Modify: `apps/landing/src/routes/$locale/blog/$slug.tsx`

**Requirements:**
1. Fix breadcrumb schema URLs to include locale:
   ```typescript
   { name: "Home", url: `${SITE_URL}/${locale}` },
   { name: "Blog", url: `${SITE_URL}/${locale}/blog` },
   ```
2. Add `article:section` meta tag using post category:
   ```typescript
   { property: "article:section", content: post?.category || "" },
   ```
3. Add `article:tag` meta tag (same as category for now):
   ```typescript
   { property: "article:tag", content: post?.category || "" },
   ```

**Acceptance criteria:**
- Breadcrumb URLs include locale prefix (e.g., `/en/blog` not `/blog`)
- `article:section` meta tag present with category value
- `article:tag` meta tag present
- No crash if category is null (use empty string)

---

### Task 3: Enrich Article schema with readTime and wordCount

**Files:**
- Modify: `apps/landing/src/lib/structured-data.ts` — extend `ArticleSchemaOptions`
- Modify: `apps/landing/src/routes/$locale/blog/$slug.tsx` — pass new fields

**Requirements:**
1. Add optional fields to `ArticleSchemaOptions`:
   ```typescript
   wordCount?: number;
   timeRequired?: string; // ISO 8601 duration, e.g. "PT5M"
   articleSection?: string;
   ```
2. In `getArticleSchema()`, include these in the output when provided:
   ```typescript
   ...(options.wordCount && { wordCount: options.wordCount }),
   ...(options.timeRequired && { timeRequired: options.timeRequired }),
   ...(options.articleSection && { articleSection: options.articleSection }),
   ```
3. In `$slug.tsx`, compute wordCount from `post.body` (split by whitespace, count) and convert `post.readTime` (e.g., "5 min") to ISO 8601 duration (e.g., "PT5M"):
   ```typescript
   const wordCount = post.body ? post.body.split(/\s+/).filter(Boolean).length : undefined;
   const timeRequired = post.readTime ? `PT${parseInt(post.readTime)}M` : undefined;
   ```
4. Pass to schema: `wordCount`, `timeRequired`, `articleSection: post.category`

**Acceptance criteria:**
- Article schema includes `wordCount` (integer) when body exists
- Article schema includes `timeRequired` in ISO 8601 format when readTime exists
- Article schema includes `articleSection` when category exists
- No crash on null/undefined values

---

### Task 4: Add Table of Contents (TOC) component

**Files:**
- Create: `apps/landing/src/components/blog/TableOfContents.tsx`
- Modify: `apps/landing/src/components/blog/BlogContent.tsx` — add id attributes to headings
- Modify: `apps/landing/src/routes/$locale/blog/$slug.tsx` — render TOC

**Requirements:**
1. In `BlogContent.tsx`, extend the `replace` function to also process `<h2>` and `<h3>` elements:
   - Generate a slug id from heading text (lowercase, replace spaces with hyphens, strip non-alphanumeric)
   - Add `id={slug}` attribute to the heading element
   - Return the modified element (keep original tag name and children, just add id)
2. Create `TableOfContents.tsx`:
   - Props: `html: string` (the raw blog HTML)
   - Parse the HTML to extract H2 and H3 headings (use regex or html-react-parser)
   - Render a sticky/scrollable `<nav aria-label="Table of contents">` with:
     - H2s as top-level items
     - H3s indented under their parent H2
   - Each item is an `<a href="#slug">` anchor link
   - Style: subtle sidebar style, small text, mist colors
3. In `$slug.tsx`, render TOC in a sidebar layout for desktop (lg:), inline above content for mobile:
   - Wrap article content in a flex layout on desktop: TOC sidebar (sticky, w-64) + content
   - On mobile, render TOC above content as a collapsible section
   - Only show TOC if there are 3+ headings

**Acceptance criteria:**
- H2/H3 headings in blog content have `id` attributes for anchor linking
- TOC extracts headings and renders as nested nav list
- TOC links scroll to the correct heading
- Proper semantic HTML: `<nav aria-label="Table of contents">`
- TOC hidden when fewer than 3 headings
- Responsive: sidebar on desktop, inline on mobile

---

### Task 5: Add related blog posts (blog-to-blog internal linking)

**Files:**
- Create: `apps/landing/src/components/blog/RelatedPosts.tsx`
- Modify: `apps/landing/src/lib/content.ts` — add `getRelatedPosts()` function
- Modify: `apps/landing/src/routes/$locale/blog/$slug.tsx` — fetch and render related posts

**Requirements:**
1. In `content.ts`, add `getRelatedPosts(currentSlug: string, category: string | null, locale: string, limit?: number)`:
   - Fetch blog posts filtered by same category (if category exists)
   - Exclude the current post by slug
   - Limit to 3 posts
   - If category is null or fewer than 3 results, fetch latest posts as fallback
   - Return `BlogPostListItem[]`
2. Create `RelatedPosts.tsx`:
   - Props: `posts: BlogPostListItem[]`, `locale: string`
   - Render a section with `<h2>` "Related Posts" (i18n via useTranslations)
   - Each post as a card with: title, category badge, author, date, read time
   - Each card links to `/$locale/blog/$slug`
   - Grid layout: 1 col mobile, 3 col desktop
   - Style consistent with blog listing page cards
3. In `$slug.tsx`:
   - In loader, fetch related posts using `getRelatedPosts(params.slug, post.category, params.locale)`
   - Render `<RelatedPosts>` after article footer, before `<RelatedPages>`
   - Add server function for related posts fetch

**Acceptance criteria:**
- 3 related posts shown after blog content
- Posts from same category prioritized
- Current post excluded from related posts
- Fallback to latest posts if category is empty or has <3 posts
- Each related post card links to the correct locale blog URL
- Proper semantic HTML with heading hierarchy (h2)

---

### Task 6: Image alt validation in BlogContent

**Files:**
- Modify: `apps/landing/src/components/blog/BlogContent.tsx`

**Requirements:**
1. Extend the `replace` function to also process `<img>` elements:
   - If `<img>` has no `alt` attribute or `alt` is empty, add a descriptive fallback:
     - Use the `title` attribute if present
     - Otherwise use "Blog post image" as generic fallback
   - Add `loading="lazy"` if not present (performance)
   - Add `decoding="async"` if not present
2. Ensure existing images with proper alt tags are not modified

**Acceptance criteria:**
- All `<img>` in blog content have non-empty `alt` attributes
- Images without alt get a reasonable fallback
- `loading="lazy"` and `decoding="async"` added to all content images
- Images that already have these attributes are not double-set
