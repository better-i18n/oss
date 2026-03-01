# Comprehensive SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Comprehensive on-page SEO + Core Web Vitals optimization across all key landing pages (excluding blog, which has a separate plan).

**Architecture:** Foundation First approach — fix shared infrastructure (`__root.tsx`, `meta.ts`, `page-seo.ts`, `structured-data.ts`, `Header`, `Footer`, `MarketingLayout`) first so all 50+ pages benefit, then optimize individual page categories.

**Tech Stack:** TanStack Start (React meta-framework), React, @better-i18n/use-intl, Tailwind CSS, html `<head>` via TanStack Router `head()` function

---

## Phase 1: Global Infrastructure

### Task 1: Font Preloading & Resource Hints

**Files:**
- Modify: `apps/landing/src/routes/__root.tsx`

**Step 1: Add DNS prefetch and preconnect hints**

In `__root.tsx`, inside the `head()` function's `links` array (after the existing `preconnect` entries at lines 99-107), add:

```typescript
{
  rel: "dns-prefetch",
  href: "https://og.better-i18n.com",
},
{
  rel: "dns-prefetch",
  href: "https://dash.better-i18n.com",
},
{
  rel: "dns-prefetch",
  href: "https://docs.better-i18n.com",
},
```

**Step 2: Add theme-color meta tag**

In the `meta` array (after the `google` `notranslate` entry at line 96), add:

```typescript
{
  name: "theme-color",
  content: "#0a0a0a",
},
```

**Step 3: Verify build**

Run: `cd apps/landing && pnpm build`
Expected: Build succeeds without errors.

**Step 4: Commit**

```
feat(landing/seo): add DNS prefetch hints and theme-color meta
```

---

### Task 2: Semantic HTML & Accessibility — Header

**Files:**
- Modify: `apps/landing/src/components/Header.tsx`

**Step 1: Add aria-label to nav**

Change line 35:
```typescript
// Before
<nav>

// After
<nav aria-label="Main navigation">
```

**Step 2: Add aria-haspopup to mega menu buttons**

There are 3 mega menu trigger `<button>` elements (Product at ~line 63, Developers at ~line 167, Resources at ~line 252). Add `aria-haspopup="true"` to each:

```typescript
// Before (each button)
<button className="inline-flex items-center gap-1 text-sm/7 ...">

// After
<button aria-haspopup="true" className="inline-flex items-center gap-1 text-sm/7 ...">
```

**Step 3: Add role="menu" to dropdown containers**

Each mega menu has a dropdown panel `<div>` with the `bg-mist-50 rounded-xl border ...` class. Add `role="menu"` to the inner grid container:

For the Product mega menu (~line 70):
```typescript
// Before
<div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm">
  <div className="grid grid-cols-2 gap-2">

// After
<div className="bg-white rounded-lg border border-mist-200 p-2 shadow-sm" role="menu">
  <div className="grid grid-cols-2 gap-2">
```

Apply the same `role="menu"` to the Developers dropdown inner container and Resources dropdown inner containers.

**Step 4: Improve logo alt text**

Change line 45:
```typescript
// Before
alt="Better I18N"

// After
alt="Better i18n - Translation Management Platform"
```

**Step 5: Verify build**

Run: `cd apps/landing && pnpm build`
Expected: Build succeeds.

**Step 6: Commit**

```
feat(landing/seo): add ARIA attributes to Header navigation
```

---

### Task 3: Skip-to-Content Link & Footer Accessibility

**Files:**
- Modify: `apps/landing/src/components/MarketingLayout.tsx`
- Modify: `apps/landing/src/routes/$locale/index.tsx` (homepage uses its own layout)
- Modify: `apps/landing/src/components/Footer.tsx`

**Step 1: Add skip-to-content link and main-content ID in MarketingLayout**

In `MarketingLayout.tsx`, modify the return to add skip link and `id="main-content"` to `<main>`:

```typescript
return (
  <div className={cn("min-h-screen", bgClassName)}>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
    >
      Skip to content
    </a>
    <Header className={headerClassName} />
    <main id="main-content">{children}</main>
    {showCTA && <CTA />}
    <Footer />
  </div>
);
```

**Step 2: Add main-content ID to homepage**

In `apps/landing/src/routes/$locale/index.tsx`, change line 94:

```typescript
// Before
<main>

// After
<main id="main-content">
```

And add skip link before `<Header />` (line 93):

```typescript
<>
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
  >
    Skip to content
  </a>
  <Header />
  <main id="main-content">
```

**Step 3: Add aria-label to Footer**

In `Footer.tsx`, change line 92:

```typescript
// Before
<footer className="py-16 bg-mist-950/[0.025]">

// After
<footer aria-label="Site footer" className="py-16 bg-mist-950/[0.025]">
```

**Step 4: Verify build and commit**

```
feat(landing/seo): add skip-to-content link and footer ARIA label
```

---

### Task 4: Enhanced Meta Tags & Breadcrumbs

**Files:**
- Modify: `apps/landing/src/lib/meta.ts`
- Modify: `apps/landing/src/lib/page-seo.ts`

**Step 1: Update robots meta tag**

In `meta.ts`, change line 157 in `formatMetaTags()`:

```typescript
// Before
{ name: "robots", content: "index, follow" },

// After
{ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
```

**Step 2: Add og:locale:alternate support to formatMetaTags**

Add a new optional `locales` field to the function, and generate `og:locale:alternate` tags. Modify `formatMetaTags`:

```typescript
export function formatMetaTags(
  meta: LocalizedMetaResult,
  options: Partial<MetaOptions> & { locales?: string[] } = {}
) {
  const tags = [
    // ... existing tags (lines 134-157, with the robots change from Step 1)
  ];

  // Add article-specific meta tags (existing code lines 161-171)

  // Add og:locale:alternate tags for other locales
  if (options.locales) {
    const currentLocale = options.locale || "en";
    for (const loc of options.locales) {
      if (loc !== currentLocale) {
        tags.push({ property: "og:locale:alternate", content: loc });
      }
    }
  }

  return tags;
}
```

**Step 3: Pass locales through getPageHead**

In `page-seo.ts`, update the `getPageHead` function to pass `locales` to `formatMetaTags`:

```typescript
// In getPageHead(), change the return statement's meta line:
// Before (line 175)
meta: formatMetaTags(meta, { locale }),

// After
meta: formatMetaTags(meta, { locale, locales }),
```

**Step 4: Expand breadcrumb labelMap**

In `page-seo.ts`, expand the `labelMap` object (lines 146-158) to include all missing pages:

```typescript
const labelMap: Record<string, string> = {
  features: "Features",
  pricing: "Pricing",
  integrations: "Integrations",
  "what-is": "What is i18n",
  "for-developers": "For Developers",
  "for-translators": "For Translators",
  "for-product-teams": "For Product Teams",
  compare: "Compare",
  i18n: "Frameworks",
  "what-is-internationalization": "What is Internationalization",
  "what-is-localization": "What is Localization",
  "best-tms": "Best TMS",
  "best-library": "Best i18n Library",
  blog: "Blog",
  about: "About",
  careers: "Careers",
  changelog: "Changelog",
  status: "Status",
  crowdin: "vs Crowdin",
  lokalise: "vs Lokalise",
  phrase: "vs Phrase",
  transifex: "vs Transifex",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "for-developers": "For Developers",
  "cli-code-scanning": "CLI Code Scanning",
  "localization-software": "Localization Software",
  "translation-management-system": "Translation Management System",
  "content-localization-services": "Content Localization Services",
  "localization-platforms": "Localization Platforms",
  "website-localization": "Website Localization",
  "react-intl": "React Intl",
  "international-seo": "International SEO",
  "multilingual-seo": "Multilingual SEO",
  "software-localization": "Software Localization",
  "content-localization": "Content Localization",
  "localization-tools": "Localization Tools",
  "website-translation": "Website Translation",
  "localization-management": "Localization Management",
  "react-native-localization": "React Native Localization",
  "localization-vs-internationalization": "Localization vs Internationalization",
  "formatting-utilities": "Formatting Utilities",
  "security-compliance": "Security & Compliance",
  "cultural-adaptation": "Cultural Adaptation",
  react: "React",
  nextjs: "Next.js",
  vue: "Vue",
  nuxt: "Nuxt",
  angular: "Angular",
  svelte: "Svelte",
};
```

**Step 5: Verify build and commit**

```
feat(landing/seo): enhance meta tags with max-image-preview, og:locale:alternate, and complete breadcrumbs
```

---

### Task 5: Structured Data Quality Fixes

**Files:**
- Modify: `apps/landing/src/lib/structured-data.ts`

**Step 1: Add dates to SoftwareApplicationSchema**

In `getSoftwareApplicationSchema()` (line 61), add `datePublished` and `dateModified`:

```typescript
export function getSoftwareApplicationSchema(reviews?: SoftwareAppReview[]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    datePublished: "2025-01-01",
    dateModified: "2026-03-01",
    offers: {
      // ... rest unchanged
```

**Step 2: Remove SearchAction from WebSiteSchema**

The `SearchAction` currently points to `/docs?q=` which is an external domain. Remove the `potentialAction` entirely since there is no site-internal search:

```typescript
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}
```

**Step 3: Verify build and commit**

```
fix(landing/seo): add dates to SoftwareApplication schema, remove invalid SearchAction
```

---

## Phase 2: Core Page SEO

### Task 6: Homepage SEO Enhancements

**Files:**
- Modify: `apps/landing/src/components/Hero.tsx`

**Step 1: Add hero title ID for aria-labelledby**

In `Hero.tsx`, add `id="hero-title"` to `<h1>` at line 36:

```typescript
<h1
  id="hero-title"
  className="text-3xl/[1.1] font-semibold ..."
```

And add `aria-labelledby="hero-title"` to the hero `<section>` at line 14:

```typescript
<section aria-labelledby="hero-title" className="flex flex-col gap-16 ...">
```

**Step 2: Add image dimensions to logo grid**

For each logo `<img>` in the logo grid (lines 99-127), add `width` and `height` attributes and `loading="lazy"`:

```typescript
<img
  src="/carna.png"
  alt="Carna - Better i18n customer"
  width={112}
  height={28}
  loading="lazy"
  className="h-7 w-auto opacity-50 grayscale"
/>
```

Apply to all 4 logos (Carna, Nomad Work, Hellospace, Cloudflare). Improve alt text to be more descriptive (add "- Better i18n customer" or similar).

**Step 3: Add aria-label to logo grid container**

Add `aria-label` to the logo grid container div at line 93:

```typescript
<div aria-label="Trusted by leading companies" className="w-full mt-[-24px] mb-8 overflow-hidden">
```

**Step 4: Verify build and commit**

```
feat(landing/seo): enhance Hero with ARIA, image dimensions, and descriptive alt text
```

---

### Task 7: Pricing Page — FAQ Accordion

**Files:**
- Modify: `apps/landing/src/routes/$locale/pricing.tsx`

**Step 1: Convert FAQItem to details/summary**

Replace the `FAQItem` component (lines 124-131):

```typescript
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border-b border-mist-200 pb-6 group">
      <summary className="text-base font-medium text-mist-950 cursor-pointer list-none flex items-center justify-between">
        {question}
        <span className="text-mist-400 group-open:rotate-180 transition-transform text-sm">
          &#9662;
        </span>
      </summary>
      <p className="mt-3 text-sm text-mist-700 leading-relaxed">{answer}</p>
    </details>
  );
}
```

**Step 2: Update FAQ container**

Change the FAQ container `<div className="space-y-6">` (line 74) to remove spacing since `<details>` handles its own:

```typescript
<div className="space-y-4">
```

**Step 3: Verify build and commit**

```
feat(landing/seo): convert pricing FAQ to native details/summary accordion
```

---

### Task 8: Features Page — Fix pageType & Add Semantic Structure

**Files:**
- Modify: `apps/landing/src/routes/$locale/features.tsx`

**Step 1: Change pageType from educational to default**

In the `head()` function (lines 11-23), change `pageType`:

```typescript
// Before
pageType: "educational",

// After
pageType: "default",
```

Remove `structuredDataOptions` since default type doesn't use them.

**Step 2: Wrap feature grid in semantic list**

Change the additional features grid (lines 56-83) to use `<ul>` and `<li>`:

```typescript
<ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <li>
    <FeatureItem ... />
  </li>
  {/* repeat for each FeatureItem */}
</ul>
```

**Step 3: Verify build and commit**

```
fix(landing/seo): correct Features pageType and add semantic list structure
```

---

### Task 9: Audience Pages — Cross-linking & article:section

**Files:**
- Modify: `apps/landing/src/routes/$locale/for-developers.tsx`
- Modify: `apps/landing/src/routes/$locale/for-translators.tsx`
- Modify: `apps/landing/src/routes/$locale/for-product-teams.tsx`

**Step 1: Add article:section meta to for-developers**

In `for-developers.tsx`, the `head()` function already uses `getPageHead` with `customStructuredData`. We need to add `article:section` meta. Since `getPageHead` returns `{ meta, links, scripts }`, we can spread and add:

After the `return getPageHead(...)` call, intercept the result to append meta:

```typescript
const headData = getPageHead({
  messages,
  locale,
  pageKey: "forDevelopers",
  pathname: "/for-developers",
  customStructuredData: [...educationalScripts, ...howToScript],
});

return {
  ...headData,
  meta: [
    ...headData.meta,
    { property: "article:section", content: "Developers" },
  ],
};
```

**Step 2: Repeat for for-translators and for-product-teams**

Apply the same pattern:
- `for-translators.tsx`: `{ property: "article:section", content: "Translators" }`
- `for-product-teams.tsx`: `{ property: "article:section", content: "Product Teams" }`

(First read these files to understand their current `head()` structure, then apply the same intercept pattern.)

**Step 3: Verify build and commit**

```
feat(landing/seo): add article:section meta to audience pages
```

---

## Phase 3: Framework Guide Pages

### Task 10: Framework Pages — TechArticle Schema Enrichment

**Files:**
- Modify: `apps/landing/src/routes/$locale/i18n/react.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/nextjs.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/vue.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/nuxt.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/angular.tsx`
- Modify: `apps/landing/src/routes/$locale/i18n/svelte.tsx`
- Modify: `apps/landing/src/lib/structured-data.ts`
- Modify: `apps/landing/src/lib/page-seo.ts`

**Step 1: Extend TechArticleSchema to accept dependencies**

In `structured-data.ts`, the `getTechArticleSchema` function (line 376) already accepts `dependencies?: string[]` and includes it in the output (line 415). Verify this is working.

**Step 2: Extend framework page type to pass dependencies**

In `page-seo.ts`, the `getFrameworkPageStructuredData` function (line 438) and the `framework` case in `getStructuredDataForPageType` (line 83) currently don't pass `dependencies`. Update the `structuredDataOptions` interface to include `dependencies`:

```typescript
structuredDataOptions?: {
  competitorName?: string;
  framework?: string;
  frameworkDescription?: string;
  dependencies?: string[];  // ADD THIS
  title?: string;
  description?: string;
  url?: string;
};
```

Update `getFrameworkPageStructuredData` to accept and pass dependencies:

```typescript
export function getFrameworkPageStructuredData(
  framework: string,
  description: string,
  dependencies?: string[]
) {
  return formatStructuredData([
    getOrganizationSchema(),
    getTechArticleSchema({
      headline: `${framework} Internationalization (i18n) Guide`,
      description,
      url: `${SITE_URL}/i18n/${framework.toLowerCase()}`,
      proficiencyLevel: "Intermediate",
      dependencies,
    }),
  ]);
}
```

Update the `framework` case in `getStructuredDataForPageType`:

```typescript
case "framework":
  return options?.framework && options?.frameworkDescription
    ? getFrameworkPageStructuredData(
        options.framework,
        options.frameworkDescription,
        options.dependencies
      )
    : getDefaultStructuredData();
```

**Step 3: Add dependencies to each framework page**

In `react.tsx`, update `structuredDataOptions`:

```typescript
structuredDataOptions: {
  framework: "React",
  frameworkDescription: "Type-safe React internationalization with hooks, lazy loading, and seamless integration.",
  dependencies: ["react", "@better-i18n/use-intl"],
},
```

In `nextjs.tsx`:
```typescript
dependencies: ["next", "react", "@better-i18n/use-intl"],
```

In `vue.tsx`:
```typescript
dependencies: ["vue", "@better-i18n/vue"],
```

In `nuxt.tsx`:
```typescript
dependencies: ["nuxt", "vue", "@better-i18n/nuxt"],
```

In `angular.tsx`:
```typescript
dependencies: ["@angular/core", "@better-i18n/angular"],
```

In `svelte.tsx`:
```typescript
dependencies: ["svelte", "@better-i18n/svelte"],
```

**Step 4: Verify build and commit**

```
feat(landing/seo): enrich framework pages with TechArticle dependencies
```

---

## Phase 4: Comparison Pages

### Task 11: Comparison Table Accessibility

**Files:**
- Modify: `apps/landing/src/components/ComparisonTable.tsx`

**Step 1: Add ARIA table roles**

Update `ComparisonTable` component (line 17):

```typescript
export function ComparisonTable({ competitorName, features, featureLabel }: ComparisonTableProps) {
  return (
    <div role="table" aria-label={`Feature comparison: Better i18n vs ${competitorName}`} className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
      {/* Header */}
      <div role="row" className="grid grid-cols-3 bg-mist-50 border-b border-mist-200">
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-600">{featureLabel ?? "Feature"}</div>
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-950 text-center border-l border-mist-200 bg-mist-100">
          Better i18n
        </div>
        <div role="columnheader" className="p-4 text-sm font-medium text-mist-600 text-center border-l border-mist-200">
          {competitorName}
        </div>
      </div>

      {/* Rows */}
      {features.map((feature, index) => (
        <div
          key={index}
          role="row"
          className={`grid grid-cols-3 border-b border-mist-100 last:border-b-0 ${
            feature.highlight ? "bg-emerald-50/50" : ""
          }`}
        >
          <div role="cell" className="p-4 text-sm text-mist-700">{feature.name}</div>
          <div role="cell" className="p-4 text-center border-l border-mist-100 bg-mist-50/50">
            <FeatureValue value={feature.betterI18n} highlight />
          </div>
          <div role="cell" className="p-4 text-center border-l border-mist-100">
            <FeatureValue value={feature.competitor} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Verify build and commit**

```
feat(landing/seo): add ARIA table roles to ComparisonTable for accessibility
```

---

## Phase 5: Technical SEO & Core Web Vitals

### Task 12: Image Optimization

**Files:**
- Modify: `apps/landing/src/components/Header.tsx` (logo image)
- Modify: `apps/landing/src/components/Hero.tsx` (logo grid images — already done in Task 6)

**Step 1: Add dimensions to Header logo**

In `Header.tsx`, update the logo `<img>` (line 43):

```typescript
// Before
<img
  src="https://better-i18n.com/cdn-cgi/image/width=48/logo.png"
  alt="Better i18n - Translation Management Platform"
  className="w-6 h-6"
/>

// After
<img
  src="https://better-i18n.com/cdn-cgi/image/width=48/logo.png"
  alt="Better i18n - Translation Management Platform"
  width={24}
  height={24}
  className="w-6 h-6"
/>
```

**Step 2: Verify build and commit**

```
fix(landing/seo): add explicit dimensions to Header logo image
```

---

### Task 13: robots.txt Verification

**Files:**
- Modify: `apps/landing/public/robots.txt` (if needed)

**Step 1: Verify current robots.txt**

The current `robots.txt` already contains:
- `Sitemap: https://better-i18n.com/sitemap.xml`
- `Disallow: /api/` and `Disallow: /_/`
- `llms.txt` reference

This is already good. No changes needed unless sitemap URL is wrong.

**Step 2: Verify sitemap is accessible**

Run: `curl -s -o /dev/null -w "%{http_code}" https://better-i18n.com/sitemap.xml`
Expected: `200`

If it fails, investigate the sitemap route. The sitemap is generated by TanStack Start's build-time page generation, so it should work if the build is correct.

**Step 3: No commit needed if no changes**

---

## Summary Checklist

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Font preload & resource hints | `__root.tsx` | |
| 2 | Header ARIA attributes | `Header.tsx` | |
| 3 | Skip-to-content & Footer ARIA | `MarketingLayout.tsx`, `index.tsx`, `Footer.tsx` | |
| 4 | Meta tags & breadcrumbs | `meta.ts`, `page-seo.ts` | |
| 5 | Structured data fixes | `structured-data.ts` | |
| 6 | Homepage SEO | `Hero.tsx` | |
| 7 | Pricing FAQ accordion | `pricing.tsx` | |
| 8 | Features page fixes | `features.tsx` | |
| 9 | Audience pages cross-linking | `for-developers.tsx`, `for-translators.tsx`, `for-product-teams.tsx` | |
| 10 | Framework schema enrichment | 6 framework files, `structured-data.ts`, `page-seo.ts` | |
| 11 | Comparison table accessibility | `ComparisonTable.tsx` | |
| 12 | Image optimization | `Header.tsx` | |
| 13 | robots.txt verification | `public/robots.txt` | |
