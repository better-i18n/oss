# Multilingual SEO + Static Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hreflang-annotated sitemap generation, blog post sitemap inclusion, and marketing page prerendering using TanStack Start's native pages/sitemap/prerender config.

**Architecture:** Build-time page generation fetches locales + blog posts from Better i18n SDK, produces a `pages[]` array that TanStack Start uses for sitemap XML (with `alternateRefs` hreflang) and HTML prerendering. Marketing pages are prerendered; blog detail pages remain SSR.

**Tech Stack:** TanStack Start (pages/sitemap/prerender config), @better-i18n/sdk, @better-i18n/use-intl, Vite, Cloudflare Workers

---

## Task 1: Create Page Definition Constants

Extract the PAGES array from the sitemap route into a shared module so both the new page generator and any future code can reference the same source of truth.

**Files:**
- Create: `src/seo/pages.ts`
- Reference: `src/routes/sitemap[.]xml.ts` (lines 14-91 for PAGES array)

**Step 1: Create the shared pages definition**

```typescript
// src/seo/pages.ts

export const SITE_URL = "https://better-i18n.com";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface PageDefinition {
  readonly path: string;
  readonly priority: number;
  readonly changefreq: ChangeFreq;
  readonly prerender: boolean;
}

// Marketing/static pages — prerendered at build time
export const MARKETING_PAGES: readonly PageDefinition[] = [
  // Core pages
  { path: "", priority: 1.0, changefreq: "weekly", prerender: true },
  { path: "features", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "pricing", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "integrations", priority: 0.9, changefreq: "weekly", prerender: true },

  // Audience pages
  { path: "for-developers", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "for-translators", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "for-product-teams", priority: 0.9, changefreq: "weekly", prerender: true },

  // i18n Framework pages
  { path: "i18n", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/react", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/nextjs", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/vue", priority: 0.9, changefreq: "weekly", prerender: true },
  { path: "i18n/nuxt", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/angular", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/svelte", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/best-tms", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "i18n/best-library", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "i18n/for-developers", priority: 0.85, changefreq: "weekly", prerender: true },

  // i18n SEO content pages
  { path: "i18n/localization-software", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/content-localization-services", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/translation-management-system", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-platforms", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/global-market-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/website-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/react-intl", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/ecommerce-global-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/translation-solutions", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/international-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/cli-code-scanning", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/multilingual-website-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/formatting-utilities", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/react-native-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-vs-internationalization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-tools", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/content-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/software-localization", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/technical-multilingual-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/security-compliance", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/cultural-adaptation", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/local-seo-international", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/multilingual-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/international-seo-consulting", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/seo-international-audiences", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/website-translation", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/software-localization-services", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/technical-international-seo", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "i18n/localization-management", priority: 0.8, changefreq: "weekly", prerender: true },

  // Comparison pages
  { path: "compare", priority: 0.8, changefreq: "weekly", prerender: true },
  { path: "compare/crowdin", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/lokalise", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/phrase", priority: 0.85, changefreq: "weekly", prerender: true },
  { path: "compare/transifex", priority: 0.85, changefreq: "weekly", prerender: true },

  // Educational pages
  { path: "what-is", priority: 0.85, changefreq: "monthly", prerender: true },
  { path: "what-is-internationalization", priority: 0.85, changefreq: "monthly", prerender: true },
  { path: "what-is-localization", priority: 0.85, changefreq: "monthly", prerender: true },

  // Company pages
  { path: "about", priority: 0.7, changefreq: "monthly", prerender: true },
  { path: "careers", priority: 0.7, changefreq: "weekly", prerender: true },
  { path: "status", priority: 0.6, changefreq: "daily", prerender: false },
  { path: "changelog", priority: 0.8, changefreq: "daily", prerender: false },

  // Legal pages
  { path: "privacy", priority: 0.3, changefreq: "yearly", prerender: true },
  { path: "terms", priority: 0.3, changefreq: "yearly", prerender: true },
] as const;
```

**Step 2: Verify file created correctly**

Run: `cat src/seo/pages.ts | head -5`
Expected: imports and exports visible

**Step 3: Commit**

```bash
git add src/seo/pages.ts
git commit -m "refactor: extract page definitions into shared seo/pages module"
```

---

## Task 2: Create Build-Time Page Generator

Create the core `generatePages()` function that fetches locales + blog posts from SDK and produces the TanStack Start `pages[]` config with hreflang `alternateRefs`.

**Files:**
- Create: `src/seo/generate-pages.ts`
- Reference: `src/seo/pages.ts` (from Task 1)
- Reference: `src/lib/content.ts` (lines 100, 114 for blog model and getEntries pattern)
- Reference: `src/i18n.config.ts` (line 1-4 for project config)

**Step 1: Create the page generator**

```typescript
// src/seo/generate-pages.ts

import { createClient } from "@better-i18n/sdk";
import { createI18nCore } from "@better-i18n/core";
import { MARKETING_PAGES, SITE_URL, type ChangeFreq } from "./pages";

// ─── Types ───────────────────────────────────────────────────────────

interface AlternateRef {
  readonly href: string;
  readonly hreflang: string;
}

interface SitemapConfig {
  readonly priority: number;
  readonly changefreq: ChangeFreq;
  readonly lastmod: string;
  readonly alternateRefs: readonly AlternateRef[];
}

interface PageEntry {
  readonly path: string;
  readonly sitemap: SitemapConfig;
  readonly prerender?: { readonly enabled: boolean };
}

interface BlogPostMeta {
  readonly slug: string;
  readonly publishedAt: string | null;
  readonly availableLanguages?: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────

function buildAlternateRefs(
  locales: readonly string[],
  pathBuilder: (locale: string) => string,
): readonly AlternateRef[] {
  const refs: AlternateRef[] = locales.map((locale) => ({
    href: pathBuilder(locale),
    hreflang: locale,
  }));

  // x-default points to English version
  refs.push({
    href: pathBuilder("en"),
    hreflang: "x-default",
  });

  return refs;
}

function buildPageUrl(locale: string, pagePath: string): string {
  return pagePath
    ? `${SITE_URL}/${locale}/${pagePath}`
    : `${SITE_URL}/${locale}`;
}

// ─── Generators ──────────────────────────────────────────────────────

function generateMarketingPages(locales: readonly string[]): readonly PageEntry[] {
  const today = new Date().toISOString().split("T")[0]!;

  return MARKETING_PAGES.flatMap((page) =>
    locales.map((locale): PageEntry => ({
      path: page.path ? `/${locale}/${page.path}` : `/${locale}`,
      sitemap: {
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: today,
        alternateRefs: buildAlternateRefs(locales, (l) => buildPageUrl(l, page.path)),
      },
      prerender: { enabled: page.prerender },
    })),
  );
}

function generateBlogPages(
  posts: readonly BlogPostMeta[],
  allLocales: readonly string[],
): readonly PageEntry[] {
  const pages: PageEntry[] = [];

  // Blog listing page per locale (prerendered)
  for (const locale of allLocales) {
    pages.push({
      path: `/${locale}/blog`,
      sitemap: {
        priority: 0.7,
        changefreq: "daily",
        lastmod: new Date().toISOString().split("T")[0]!,
        alternateRefs: buildAlternateRefs(allLocales, (l) => `${SITE_URL}/${l}/blog`),
      },
      prerender: { enabled: true },
    });
  }

  // Individual blog post pages (SSR only, not prerendered)
  for (const post of posts) {
    const postLocales = post.availableLanguages?.length
      ? post.availableLanguages
      : allLocales;

    const lastmod = post.publishedAt
      ? new Date(post.publishedAt).toISOString().split("T")[0]!
      : new Date().toISOString().split("T")[0]!;

    for (const locale of postLocales) {
      pages.push({
        path: `/${locale}/blog/${post.slug}`,
        sitemap: {
          priority: 0.7,
          changefreq: "weekly",
          lastmod,
          alternateRefs: buildAlternateRefs(
            postLocales,
            (l) => `${SITE_URL}/${l}/blog/${post.slug}`,
          ),
        },
        prerender: { enabled: false },
      });
    }
  }

  return pages;
}

// ─── Public API ──────────────────────────────────────────────────────

interface GeneratePagesOptions {
  readonly project: string;
  readonly apiKey: string;
}

export async function generatePages(options: GeneratePagesOptions): Promise<readonly PageEntry[]> {
  const { project, apiKey } = options;

  // Fetch locales from CDN
  const i18n = createI18nCore({ project, defaultLocale: "en" });
  const locales = await i18n.getLocales();

  if (locales.length === 0) {
    console.warn("[SEO] No locales found, falling back to ['en']");
  }
  const effectiveLocales = locales.length > 0 ? locales : ["en"];

  // Fetch published blog posts from Content API
  const client = createClient({ project, apiKey });
  let blogPosts: BlogPostMeta[] = [];

  try {
    const result = await client.getEntries("blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    blogPosts = result.items.map((item) => ({
      slug: item.slug,
      publishedAt: item.publishedAt,
      // availableLanguages may come from API even if not in TS type
      availableLanguages: (item as Record<string, unknown>).availableLanguages as string[] | undefined,
    }));
  } catch (error) {
    console.error("[SEO] Failed to fetch blog posts for sitemap:", error);
    // Continue without blog posts — marketing pages still generated
  }

  const marketingPages = generateMarketingPages(effectiveLocales);
  const blogPages = generateBlogPages(blogPosts, effectiveLocales);

  const allPages = [...marketingPages, ...blogPages];

  console.log(
    `[SEO] Generated ${allPages.length} pages: ` +
    `${marketingPages.length} marketing + ${blogPages.length} blog ` +
    `(${effectiveLocales.length} locales, ${blogPosts.length} posts)`,
  );

  return allPages;
}
```

**Step 2: Verify file created correctly**

Run: `npx tsc --noEmit src/seo/generate-pages.ts` (or use your project's type check)
Expected: No type errors

**Step 3: Commit**

```bash
git add src/seo/generate-pages.ts
git commit -m "feat(seo): add build-time page generator with hreflang support"
```

---

## Task 3: Update Vite Config with TanStack Start Pages/Sitemap/Prerender

Wire `generatePages()` into the `tanstackStart()` plugin config so TanStack Start generates the sitemap and prerenders pages at build time.

**Files:**
- Modify: `vite.config.ts` (lines 9-43)

**Step 1: Update vite.config.ts**

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";
import { generatePages } from "./src/seo/generate-pages";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Fetch pages at build time (locales + blog posts from SDK)
  const apiKey = env.BETTER_I18N_CONTENT_API_KEY;
  const project = env.BETTER_I18N_PROJECT || "better-i18n/landing";

  let pages: Awaited<ReturnType<typeof generatePages>> = [];
  if (mode === "production" && apiKey) {
    try {
      pages = await generatePages({ project, apiKey });
    } catch (error) {
      console.error("[SEO] Page generation failed:", error);
      // Build continues without prerender/sitemap — SSR still works
    }
  }

  return {
    define: {
      "import.meta.env.BETTER_I18N_CONTENT_API_KEY": JSON.stringify(
        env.BETTER_I18N_CONTENT_API_KEY,
      ),
      "import.meta.env.BETTER_I18N_PROJECT": JSON.stringify(
        env.BETTER_I18N_PROJECT,
      ),
    },
    resolve: {
      conditions: [
        "worker",
        "webworker",
        "browser",
        "module",
        "development|production",
      ],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      devtools(),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        pages: pages.map((p) => ({
          path: p.path,
          sitemap: p.sitemap,
          prerender: p.prerender,
        })),
        sitemap: {
          enabled: pages.length > 0,
          host: "https://better-i18n.com",
        },
        prerender: pages.length > 0
          ? {
              enabled: true,
              crawlLinks: false,
            }
          : undefined,
      }),
      viteReact(),
    ],
  };
});
```

**Step 2: Verify TypeScript compiles**

Run: `cd apps/landing && npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat(seo): wire page generator into TanStack Start sitemap and prerender config"
```

---

## Task 4: Remove Custom Sitemap Route

Delete the old custom sitemap handler — TanStack Start's native sitemap replaces it.

**Files:**
- Delete: `src/routes/sitemap[.]xml.ts`

**Step 1: Delete the old sitemap route**

```bash
rm src/routes/sitemap\[.\]xml.ts
```

**Step 2: Verify the route tree regenerates without errors**

Run: `cd apps/landing && npx vite build --mode development 2>&1 | head -20`
Expected: No errors about missing sitemap route

**Step 3: Commit**

```bash
git add -u src/routes/
git commit -m "refactor(seo): remove custom sitemap route, replaced by TanStack Start native sitemap"
```

---

## Task 5: Remove SITE_URL Export from meta.ts (DRY)

`SITE_URL` is now exported from `src/seo/pages.ts`. Update `src/lib/meta.ts` to import from there instead of defining its own copy.

**Files:**
- Modify: `src/lib/meta.ts` (line 3 — `const SITE_URL = "https://better-i18n.com"`)

**Step 1: Update meta.ts to import SITE_URL**

Replace line 3 in `src/lib/meta.ts`:
```typescript
// Before:
const SITE_URL = "https://better-i18n.com";

// After:
import { SITE_URL } from "@/seo/pages";
```

Also check and update any other file that imports `SITE_URL` from `@/lib/meta` — the old export should be re-exported for backward compatibility OR all imports updated.

**Step 2: Search for other SITE_URL imports**

Run: `grep -r "SITE_URL" src/ --include="*.ts" --include="*.tsx"`
Expected: List of files importing SITE_URL. Update all to import from `@/seo/pages`, or keep a re-export in `meta.ts`.

**Step 3: Verify no broken imports**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 4: Commit**

```bash
git add src/lib/meta.ts src/seo/pages.ts
git commit -m "refactor: deduplicate SITE_URL constant into seo/pages module"
```

---

## Task 6: Build and Verify Sitemap Output

Run a production build and verify the generated sitemap.xml contains hreflang annotations.

**Files:**
- No changes — verification only

**Step 1: Run production build**

Run: `cd apps/landing && bun run build`
Expected: Build succeeds, `[SEO] Generated N pages` log visible

**Step 2: Check generated sitemap exists**

Run: `ls -la dist/client/sitemap.xml`
Expected: File exists

**Step 3: Verify sitemap contains hreflang**

Run: `head -50 dist/client/sitemap.xml`
Expected: XML with `<xhtml:link rel="alternate" hreflang="..." href="..."/>` inside `<url>` elements

**Step 4: Verify blog posts are in sitemap**

Run: `grep "blog/" dist/client/sitemap.xml | head -10`
Expected: Blog post URLs present with hreflang annotations

**Step 5: Count total URLs**

Run: `grep -c "<url>" dist/client/sitemap.xml`
Expected: Number matching (marketing pages × locales) + (blog listing × locales) + (blog posts × available languages)

**Step 6: Verify prerendered HTML exists**

Run: `ls dist/client/en/features/index.html 2>/dev/null || echo "not prerendered"`
Expected: File exists (marketing page prerendered)

Run: `ls dist/client/en/blog/*/index.html 2>/dev/null || echo "not prerendered"`
Expected: "not prerendered" (blog details are SSR only)

---

## Task 7: Verify robots.txt Sitemap Reference

Ensure `robots.txt` points to the correct sitemap location.

**Files:**
- Verify: `public/robots.txt` (line 2)

**Step 1: Check current robots.txt**

The current `robots.txt` points to `https://better-i18n.com/sitemap.xml`. If TanStack Start generates sitemap at a different path (check `sitemap.outputPath` default), update accordingly.

Run: `cat public/robots.txt`
Expected: `Sitemap: https://better-i18n.com/sitemap.xml`

If the path changed, update `robots.txt` to match the new location.

**Step 2: Commit if changed**

```bash
git add public/robots.txt
git commit -m "chore: update robots.txt sitemap path"
```

---

## Task 8: Integration Test — Full Build + Sitemap Validation

Do a final end-to-end validation of the complete SEO setup.

**Files:**
- No changes — validation only

**Step 1: Full production build**

Run: `cd apps/landing && bun run build`
Expected: Clean build with SEO page generation logs

**Step 2: Validate sitemap XML structure**

Check that every `<url>` has:
- `<loc>` with a valid URL
- `<lastmod>` with a date
- `<changefreq>` and `<priority>`
- `<xhtml:link>` alternateRefs for all locales + x-default

Run: `xmllint --noout dist/client/sitemap.xml 2>&1 || echo "xmllint not available, manual check needed"`

**Step 3: Spot-check a marketing page entry**

Run: `grep -A 20 "en/features" dist/client/sitemap.xml | head -25`
Expected:
```xml
<url>
  <loc>https://better-i18n.com/en/features</loc>
  <lastmod>2026-03-01</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
  <xhtml:link rel="alternate" hreflang="en" href="https://better-i18n.com/en/features"/>
  <xhtml:link rel="alternate" hreflang="es" href="https://better-i18n.com/es/features"/>
  ...
  <xhtml:link rel="alternate" hreflang="x-default" href="https://better-i18n.com/en/features"/>
</url>
```

**Step 4: Spot-check a blog post entry**

Run: `grep -A 15 "blog/" dist/client/sitemap.xml | head -20`
Expected: Blog post URL with hreflang alternateRefs (only for availableLanguages)

**Step 5: Verify HTML hreflang still works (dual signal)**

Run: `cat dist/client/en/features/index.html | grep -i hreflang | head -5`
Expected: `<link rel="alternate" hreflang="..." href="..."/>` tags in HTML head

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat(seo): complete multilingual sitemap with hreflang + marketing page prerender

- TanStack Start native sitemap with xhtml:link hreflang alternateRefs
- Blog posts included in sitemap with per-language availability
- Marketing pages prerendered as static HTML
- HTML head hreflang tags preserved (dual signal)
- Custom sitemap route replaced by framework-native generation"
```

---

## Summary

| Task | What | Files | Prerender |
|------|------|-------|-----------|
| 1 | Extract PAGES to shared module | Create `src/seo/pages.ts` | — |
| 2 | Build-time page generator | Create `src/seo/generate-pages.ts` | — |
| 3 | Wire into Vite config | Modify `vite.config.ts` | — |
| 4 | Remove old sitemap route | Delete `src/routes/sitemap[.]xml.ts` | — |
| 5 | DRY SITE_URL constant | Modify `src/lib/meta.ts` | — |
| 6 | Build & verify output | Verification only | Check |
| 7 | Verify robots.txt | Verify `public/robots.txt` | — |
| 8 | Integration test | Validation only | Check |

**Estimated pages generated:** ~90 marketing × ~10 locales + ~10 blog × ~10 languages = ~1000+ URLs in sitemap, all with hreflang.
