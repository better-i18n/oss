# AI Visibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Execute the AI Visibility Content Strategy by creating new hub pages, comparison pages, blog posts, pillar content, and cluster articles to achieve AI citations across ChatGPT, Perplexity, and Google AI Overviews.

**Architecture:** File-based routing with TanStack Start. Hub pages as route files in `src/routes/$locale/i18n/`, comparison pages in `src/routes/$locale/compare/`. Blog content via Better i18n Content CMS. All pages registered in `src/seo/pages.ts` (sitemap) and `src/seo/llms-txt.ts` (AI visibility).

**Tech Stack:** TanStack Start, React, TypeScript, Tailwind CSS, Cloudflare Workers, Better i18n Content CMS

---

## Phase 1a: New Hub Pages + Compare Pages (Code)

### Task 7: Create 5 new framework hub pages

**Files:**
- Create: `src/routes/$locale/i18n/django.tsx`
- Create: `src/routes/$locale/i18n/ruby.tsx`
- Create: `src/routes/$locale/i18n/javascript.tsx`
- Create: `src/routes/$locale/i18n/android.tsx`
- Create: `src/routes/$locale/i18n/ios.tsx`
- Reference: `src/routes/$locale/i18n/angular.tsx` (pattern to follow)

Follow the exact pattern from `angular.tsx`:
- `createFileRoute` with `createPageLoader()` and `getPageHead()`
- Components: `MarketingLayout`, `FrameworkHero`, `FeatureList`, `CodeExample`, `ComparisonRelatedTopics`, `OtherFrameworks`, `FrameworkCTA`
- All text via `useT("marketing")` with appropriate key prefixes
- Each page needs: pageKey, pathname, pageType="framework", structuredDataOptions with framework name/description/dependencies

### Task 8: Create 2 new comparison pages

**Files:**
- Create: `src/routes/$locale/compare/smartling.tsx`
- Create: `src/routes/$locale/compare/xtm.tsx`
- Reference: `src/routes/$locale/compare/crowdin.tsx` (pattern to follow)

Follow the exact pattern from `crowdin.tsx`:
- Components: `ComparisonHero`, `ComparisonTable`, `Differentiator`, `OtherComparisons`, `CTASection`
- Icons from `@central-icons-react/round-outlined-radius-2-stroke-2`
- pageType="comparison", structuredDataOptions with competitorName
- 10 factual feature comparisons per page
- 4 differentiator blocks per page

### Task 9: Register all new pages in pages.ts and llms-txt.ts

**Files:**
- Modify: `src/seo/pages.ts` — add entries to MARKETING_PAGES
- Modify: `src/seo/llms-txt.ts` — add PAGE_TITLES entries and STATIC_SECTIONS entries

pages.ts additions:
- 5 i18n hub entries after svelte (priority 0.8, weekly, prerender true)
- 2 compare entries after transifex (priority 0.85, weekly, prerender true)

llms-txt.ts additions:
- 5 PAGE_TITLES entries for hub pages
- 2 PAGE_TITLES entries for compare pages
- 5 entries in Framework Guides section
- 2 entries in Comparisons section

### Task 10: Verify build succeeds with all new pages

Run `bun run build` or dev server to verify:
- Route tree regenerates with new routes
- No type errors from new files
- Pages render correctly

---

## Phase 1b: Blog Posts (CMS Content)

### Tasks 11-16: Create 6 blog posts in CMS

Blog posts created in Better i18n Content CMS under `blog-posts` model:
- MTPE Guide (`/blog/mtpe-guide`)
- ResX File Format (`/blog/resx-file-format`)
- ICU Message Format (`/blog/icu-message-format`)
- Database Localization (`/blog/database-localization`)
- Salesforce Localization (`/blog/salesforce-localization`)
- Webflow Localization (`/blog/webflow-localization`)

Each blog post follows the AI-first content architecture:
- H2: TL;DR / Key Takeaways (first 30% = AI citation zone)
- H2: Main Topic Deep Dive (statistics-heavy)
- H2: Practical How-To Section
- H2: Comparison/Alternatives (table format)
- H2: FAQ (FAQPage schema)

---

## Phase 2: Pillar Pages (Week 3-5)

### Tasks 17-21: Create 5 pillar pages

- P1: Multilingual SEO Strategy Guide → expand `/i18n/multilingual-seo` (3,500 words)
- P2: Complete Guide to i18n & L10n → new `/i18n/complete-guide` (4,000 words)
- P3: AI Translation Tools in 2026 → blog post (3,000 words)
- P4: Software Localization Guide → expand `/i18n/software-localization` (3,500 words)
- P5: Translation Tools Compared → blog post (3,000 words)

---

## Phase 3: Cluster Expansion (Week 5-10)

### Tasks 22-26: Create ~45 cluster articles

8-10 cluster articles per pillar, published via CMS blog.

---

## Phase 4: Authority Amplification (Week 10+)

- G2 and Capterra profile optimization
- Reddit participation strategy
- Dev.to cross-posting
- GitHub starter template repositories
- AI citation monitoring setup
