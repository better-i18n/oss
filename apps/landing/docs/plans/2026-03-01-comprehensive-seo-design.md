# Comprehensive SEO Improvement Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Comprehensive on-page SEO + Core Web Vitals optimization across all key landing pages (excluding blog, which has its own plan).

**Approach:** Foundation First — fix global infrastructure, then page-by-page optimization.

**Scope:** ~50 pages across 5 categories. Blog pages excluded (separate plan exists).

**Tech Stack:** TanStack Start, React, @better-i18n/use-intl, Tailwind CSS

---

## Phase 1: Global Infrastructure (All Pages Benefit)

### Task 1: Font Preloading & Resource Hints

**Files:**
- Modify: `apps/landing/src/routes/__root.tsx`

**Requirements:**
1. Add `<link rel="preload">` for Geist font files (woff2 format) to eliminate render-blocking font load
2. Add `dns-prefetch` hints for external domains:
   - `og.better-i18n.com` (OG image service)
   - `dash.better-i18n.com` (CTA links)
   - `docs.better-i18n.com` (documentation links)
3. Add `<meta name="theme-color" content="#0a0a0a">` for browser chrome styling
4. Evaluate Google Ads script — keep `async`, verify it doesn't block FCP

**Acceptance criteria:**
- Fonts preloaded before CSS parse (LCP improvement)
- No new render-blocking resources introduced
- `theme-color` meta present

---

### Task 2: Semantic HTML & Accessibility — Header

**Files:**
- Modify: `apps/landing/src/components/Header.tsx`

**Requirements:**
1. Add `aria-label="Main navigation"` to `<nav>` element
2. Add to each mega menu trigger button:
   - `aria-expanded={isOpen}` (requires state management or CSS-only approach)
   - `aria-haspopup="true"`
3. Add `role="menu"` to dropdown containers
4. Add `role="menuitem"` to dropdown link items
5. Logo `<img>` alt text: change from "Better I18N" to "Better i18n - Translation Management Platform" (more descriptive)

**Acceptance criteria:**
- Screen readers can navigate mega menus
- ARIA attributes correctly reflect open/close state
- No accessibility warnings in axe-core audit

---

### Task 3: Semantic HTML & Accessibility — Footer & Skip Link

**Files:**
- Modify: `apps/landing/src/components/Footer.tsx`
- Modify: `apps/landing/src/routes/__root.tsx` (or layout component)

**Requirements:**
1. Add skip-to-content link as first focusable element:
   ```html
   <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
     Skip to content
   </a>
   ```
2. Ensure Footer `<footer>` has `aria-label="Site footer"`
3. Footer link sections: add `aria-label` to each `<nav>` or use `<section>` with heading

**Acceptance criteria:**
- Tab key first focuses skip-to-content link
- Skip link jumps to `#main-content`
- Footer navigation is labeled for screen readers

---

### Task 4: `getPageHead()` Enhancements

**Files:**
- Modify: `apps/landing/src/lib/page-seo.ts`
- Modify: `apps/landing/src/lib/meta.ts`

**Requirements:**
1. Update `robots` meta content from `"index, follow"` to `"index, follow, max-image-preview:large, max-snippet:-1"` — enables large image previews in Google Discover and rich results
2. Add `og:locale:alternate` meta tags for each available locale (OG equivalent of hreflang)
3. Expand breadcrumb `labelMap` to include missing pages:
   - `integrations` → "Integrations"
   - `changelog` → "Changelog"
   - `blog` → "Blog"
   - `about` → "About"
   - `careers` → "Careers"
   - `crowdin` → "vs Crowdin"
   - `lokalise` → "vs Lokalise"
   - `phrase` → "vs Phrase"
   - `transifex` → "vs Transifex"
   - `privacy` → "Privacy Policy"
   - `terms` → "Terms of Service"
   - `status` → "Status"

**Acceptance criteria:**
- `max-image-preview:large` present on all pages
- `og:locale:alternate` tags generated for all available locales
- All breadcrumb segments have human-readable labels (no raw slug fallbacks)

---

### Task 5: Structured Data Quality

**Files:**
- Modify: `apps/landing/src/lib/structured-data.ts`

**Requirements:**
1. `SoftwareApplicationSchema`: add `datePublished: "2025-01-01"` and `dateModified: "2026-03-01"` fields
2. `WebSiteSchema`: update `SearchAction` target URL to point to actual search endpoint (or remove if no site search exists)
3. Review `aggregateRating` — if not based on real data, consider removing to avoid Google penalization. If real, document the source.
4. `ProductSchema.priceValidUntil` — ensure it's always in the future (dynamic or at least 1 year ahead)

**Acceptance criteria:**
- No Google Search Console structured data warnings
- `dateModified` reflects actual last update
- `SearchAction` points to a working URL or is removed
- `aggregateRating` is either verified real or removed

---

## Phase 2: Core Page SEO (6 Pages)

### Task 6: Homepage SEO

**Files:**
- Modify: `apps/landing/src/routes/$locale/index.tsx`
- Modify: `apps/landing/src/components/Hero.tsx`

**Requirements:**
1. Add `id="main-content"` to `<main>` element
2. Hero section: add `aria-labelledby="hero-title"` and `id="hero-title"` to `<h1>`
3. Logo grid: add descriptive `aria-label="Companies using Better i18n"` to container
4. Logo `<img>` elements: add explicit `width` and `height` attributes (CLS prevention)
5. Add `fetchpriority="high"` to above-the-fold hero logo images
6. Add `loading="lazy"` to below-the-fold section images (Testimonials, etc.)
7. Each major section component should have an `id` attribute for anchor linking:
   - `#features`, `#frameworks`, `#integrations`, `#use-cases`, `#pricing`, `#testimonials`

**Acceptance criteria:**
- CLS score improved (explicit image dimensions)
- LCP improved (fetchpriority on hero images)
- All sections linkable via anchor (#features, etc.)
- `main-content` ID present for skip link

---

### Task 7: Pricing Page SEO

**Files:**
- Modify: `apps/landing/src/routes/$locale/pricing.tsx`

**Requirements:**
1. Convert FAQ section from static `<div>` to `<details>`/`<summary>` accordion — Google prefers native HTML5 for FAQ rich results
2. Each FAQ item: `<details>` with `<summary>` containing question, answer in `<div>`
3. Trust badges: add `aria-label` to container
4. Verify FAQ structured data matches rendered FAQ items exactly (content mismatch causes rich result rejection)

**Acceptance criteria:**
- FAQ renders as native `<details>`/`<summary>` accordion
- FAQ structured data content matches visible FAQ text 1:1
- Trust section accessible

---

### Task 8: Features Page SEO

**Files:**
- Modify: `apps/landing/src/routes/$locale/features.tsx`

**Requirements:**
1. Change `pageType` from `"educational"` to `"default"` — features page is a product page, not educational content. Or create a new `"product"` page type with appropriate schema.
2. Add internal links from each feature card to related detail pages:
   - "AI Translation" → `/$locale/for-translators`
   - "Git Integration" → `/$locale/for-developers`
   - "CDN Delivery" → `/$locale/integrations`
3. Feature grid: wrap in `<ul role="list">` with `<li>` items for better semantic structure
4. Add FAQ structured data with common feature questions

**Acceptance criteria:**
- `pageType` accurately represents the page
- Feature cards link to relevant detail pages (internal linking)
- Semantic list structure for feature grid

---

### Task 9: Audience Pages SEO (for-developers, for-translators, for-product-teams)

**Files:**
- Modify: `apps/landing/src/routes/$locale/for-developers.tsx`
- Modify: `apps/landing/src/routes/$locale/for-translators.tsx`
- Modify: `apps/landing/src/routes/$locale/for-product-teams.tsx`

**Requirements:**
1. Add FAQ structured data to each page (3-5 questions relevant to each audience)
2. Add cross-links between all 3 audience pages (each page links to the other 2)
3. Add `article:section` meta tag with segment identifier (e.g., "Developers", "Translators", "Product Teams")
4. Each page should link to relevant framework guides and comparison pages

**Acceptance criteria:**
- FAQ structured data present on all 3 pages
- Each audience page links to the other 2
- `article:section` meta tag present
- Contextual links to framework guides and comparisons

---

## Phase 3: Framework Guide Pages (6 Pages)

### Task 10: Framework Pages — TechArticle Schema & FAQ

**Files:**
- Modify: `apps/landing/src/routes/$locale/i18n/react.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/nextjs.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/vue.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/nuxt.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/angular.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/svelte.tsx`

**Requirements:**
1. Enrich `structuredDataOptions` with `dependencies` array:
   - React: `["react", "@better-i18n/use-intl"]`
   - Next.js: `["next", "@better-i18n/use-intl"]`
   - Vue: `["vue", "@better-i18n/vue"]`
   - etc.
2. Set appropriate `proficiencyLevel` per framework
3. Add FAQ structured data (3-5 questions per framework from i18n messages):
   - "How to set up i18n in [Framework]?"
   - "Is Better i18n compatible with [Framework] [latest version]?"
   - "What i18n libraries work with [Framework]?"
4. Add HowTo structured data for the code example / setup section
5. Add contextual links to comparison pages from each framework page

**Acceptance criteria:**
- TechArticle schema includes dependencies and proficiency level
- FAQ rich results eligible
- HowTo schema for setup instructions
- Each framework page links to comparison pages

---

## Phase 4: Comparison Pages (4 Pages)

### Task 11: Comparison Pages — Schema & Content

**Files:**
- Modify: `apps/landing/src/routes/$locale/compare/crowdin.tsx`
- Modify: `apps/landing/src/routes/$locale/compare/lokalise.tsx`
- Modify: `apps/landing/src/routes/$locale/compare/phrase.tsx`
- Modify: `apps/landing/src/routes/$locale/compare/transifex.tsx`

**Requirements:**
1. Add FAQ structured data to each comparison page:
   - "Is Better i18n better than [Competitor]?"
   - "How to migrate from [Competitor] to Better i18n?"
   - "What's the pricing difference between Better i18n and [Competitor]?"
2. Add prose content section (200-300 words) between hero and comparison table:
   - Brief overview of comparison context
   - Key differentiators in paragraph form
   - Migration mention
   (Content from i18n messages so it's translatable)
3. Comparison table: add `role="table"`, `role="row"`, `role="cell"` for accessibility
4. Add internal links to relevant framework guides from each comparison page

**Acceptance criteria:**
- FAQ structured data present on all 4 pages
- Prose content section with 200+ words
- Table is accessible with ARIA roles
- Internal links to framework guides

---

## Phase 5: Technical SEO & Core Web Vitals

### Task 12: Image Optimization Across All Pages

**Files:**
- Modify: `apps/landing/src/components/Hero.tsx`
- Modify: Other components with images (Features, Integrations, etc.)

**Requirements:**
1. All `<img>` elements must have explicit `width` and `height` attributes (CLS prevention)
2. Above-the-fold images: `fetchpriority="high"`, no `loading="lazy"`
3. Below-the-fold images: `loading="lazy"`, `decoding="async"`
4. Header logo: add `width` and `height` attributes
5. All images must have descriptive `alt` text (not just brand names)

**Acceptance criteria:**
- Zero CLS from image loading
- LCP images prioritized
- All images have alt text
- No missing width/height on any `<img>`

---

### Task 13: robots.txt & Miscellaneous

**Files:**
- Check/Create: `apps/landing/public/robots.txt`
- Check: Sitemap URL in robots.txt

**Requirements:**
1. Ensure `robots.txt` exists and contains:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://better-i18n.com/sitemap.xml
   ```
2. Verify sitemap URL is accessible and returns valid XML
3. Add `<meta name="theme-color" content="#0a0a0a">` to root (if not done in Task 1)

**Acceptance criteria:**
- `robots.txt` accessible at `/robots.txt`
- Sitemap URL correct and functional
- No blocked resources that should be indexed

---

## Summary

| Phase | Tasks | Pages Affected | Impact |
|-------|-------|----------------|--------|
| 1. Global Infrastructure | 5 tasks | All 50+ pages | Highest (multiplied across all) |
| 2. Core Pages | 4 tasks | 6 pages | High (revenue pages) |
| 3. Framework Guides | 1 task | 6 pages | High (organic traffic) |
| 4. Comparison Pages | 1 task | 4 pages | High (purchase intent) |
| 5. Technical SEO | 2 tasks | All pages | Medium (CWV scores) |

**Total: 13 tasks, Foundation First order.**
