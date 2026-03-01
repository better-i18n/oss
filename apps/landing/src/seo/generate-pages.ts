/**
 * Build-time page generator for SEO.
 *
 * Fetches locales from the i18n manifest and blog posts from the content SDK,
 * then produces a page config array with hreflang alternateRefs for sitemap generation.
 *
 * This module runs inside vite.config.ts at BUILD TIME — it must not import React
 * or any browser-only API.
 */

import { createI18nCore } from "@better-i18n/core";
import { createClient } from "@better-i18n/sdk";
import type { ContentEntryListItem } from "@better-i18n/sdk";

import { SITE_URL, MARKETING_PAGES } from "./pages";
import type { ChangeFreq } from "./pages";

// ─── Types ──────────────────────────────────────────────────────────

export interface AlternateRef {
  readonly href: string;
  readonly hreflang: string;
}

export interface SitemapConfig {
  readonly priority: number;
  readonly changefreq: ChangeFreq;
  readonly lastmod?: string;
  readonly alternateRefs: readonly AlternateRef[];
}

export interface PageEntry {
  readonly path: string;
  readonly sitemap: SitemapConfig;
  readonly prerender?: { readonly enabled: boolean };
}

export interface BlogPostMeta {
  readonly slug: string;
  readonly publishedAt: string | null;
  readonly availableLanguages?: readonly string[];
}

export interface FeaturePageMeta {
  readonly slug: string;
  readonly availableLanguages?: readonly string[];
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Builds a relative path for a given locale and page path.
 * Used for prerender routes and internal routing.
 *
 * @example
 * buildPagePath("en", "features") => "/en/features"
 * buildPagePath("tr", "")         => "/tr"
 */
export function buildPagePath(locale: string, pagePath: string): string {
  const segments = [locale, pagePath].filter(Boolean);
  return "/" + segments.join("/");
}

/**
 * Builds a full URL for a given locale and page path.
 * Used for sitemap hreflang alternateRefs.
 *
 * @example
 * buildPageUrl("en", "features") => "https://better-i18n.com/en/features"
 * buildPageUrl("tr", "")         => "https://better-i18n.com/tr"
 */
export function buildPageUrl(locale: string, pagePath: string): string {
  const segments = [SITE_URL, locale, pagePath].filter(Boolean);
  return segments.join("/");
}

/**
 * Creates hreflang alternate refs for all locales plus x-default.
 * x-default points to the default locale (prefers "en", falls back to first locale).
 */
export function buildAlternateRefs(
  locales: readonly string[],
  pathBuilder: (locale: string) => string,
  defaultLocale = "en",
): readonly AlternateRef[] {
  const localeRefs: readonly AlternateRef[] = locales.map((locale) => ({
    href: pathBuilder(locale),
    hreflang: locale,
  }));

  const resolvedDefault = locales.includes(defaultLocale)
    ? defaultLocale
    : locales[0] ?? defaultLocale;

  const xDefaultRef: AlternateRef = {
    href: pathBuilder(resolvedDefault),
    hreflang: "x-default",
  };

  return [...localeRefs, xDefaultRef];
}

// ─── Generator: Marketing Pages ─────────────────────────────────────

/**
 * Generates a PageEntry for every marketing page x every locale,
 * each with a full set of hreflang alternateRefs.
 */
export function generateMarketingPages(
  locales: readonly string[],
): readonly PageEntry[] {
  return MARKETING_PAGES.flatMap((page) => {
    const alternateRefs = buildAlternateRefs(locales, (locale) =>
      buildPageUrl(locale, page.path),
    );

    return locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, page.path),
      sitemap: {
        priority: page.priority,
        changefreq: page.changefreq,
        alternateRefs,
      },
      prerender: page.prerender ? { enabled: true } : undefined,
    }));
  });
}

// ─── Generator: Blog Pages ──────────────────────────────────────────

/**
 * Generates blog listing pages (one per locale) and blog post detail pages
 * (one per post per available language).
 *
 * - Listing pages are prerendered.
 * - Detail pages are NOT prerendered (rendered on demand).
 * - Falls back to allLocales when a post has no availableLanguages.
 */
export function generateBlogPages(
  posts: readonly BlogPostMeta[],
  allLocales: readonly string[],
): readonly PageEntry[] {
  const listingPages = generateBlogListingPages(allLocales);
  const detailPages = posts.flatMap((post) =>
    generateBlogDetailPages(post, allLocales),
  );

  return [...listingPages, ...detailPages];
}

function generateBlogListingPages(
  locales: readonly string[],
): readonly PageEntry[] {
  const alternateRefs = buildAlternateRefs(locales, (locale) =>
    buildPageUrl(locale, "blog"),
  );

  return locales.map((locale): PageEntry => ({
    path: buildPagePath(locale, "blog"),
    sitemap: {
      priority: 0.8,
      changefreq: "daily",
      alternateRefs,
    },
    prerender: { enabled: true },
  }));
}

function generateBlogDetailPages(
  post: BlogPostMeta,
  allLocales: readonly string[],
): readonly PageEntry[] {
  const postLocales =
    post.availableLanguages && post.availableLanguages.length > 0
      ? post.availableLanguages
      : allLocales;

  const alternateRefs = buildAlternateRefs(postLocales, (locale) =>
    buildPageUrl(locale, `blog/${post.slug}`),
  );

  return postLocales.map((locale): PageEntry => ({
    path: buildPagePath(locale, `blog/${post.slug}`),
    sitemap: {
      priority: 0.7,
      changefreq: "weekly",
      lastmod: post.publishedAt ?? undefined,
      alternateRefs,
    },
    prerender: undefined,
  }));
}

// ─── SDK response casting ───────────────────────────────────────────

/**
 * The API may return `availableLanguages` on list items even though the
 * TypeScript SDK type (`ContentEntryListItem`) does not declare it.
 * We cast to `unknown` first, then to a plain object to safely extract
 * the field without conflicting with the SDK's index signature.
 */
function toBlogPostMeta(item: ContentEntryListItem): BlogPostMeta {
  const raw = item as unknown as Record<string, unknown>;
  const availableLanguages = Array.isArray(raw.availableLanguages)
    ? (raw.availableLanguages as unknown[]).filter(
        (v): v is string => typeof v === "string",
      )
    : undefined;

  return {
    slug: item.slug,
    publishedAt: item.publishedAt,
    availableLanguages,
  };
}

// ─── Main export ────────────────────────────────────────────────────

export interface GeneratePagesOptions {
  readonly project: string;
  readonly apiKey: string;
}

/**
 * Build-time page generator.
 *
 * 1. Fetches available locales from the i18n CDN manifest.
 * 2. Fetches published blog posts from the content SDK.
 * 3. Produces a flat array of PageEntry objects with hreflang alternateRefs.
 *
 * Blog fetch failures are non-fatal — marketing pages are still generated.
 */
export async function generatePages(
  options: GeneratePagesOptions,
): Promise<readonly PageEntry[]> {
  const { project, apiKey } = options;

  // 1. Fetch available locales
  const i18n = createI18nCore({ project, defaultLocale: "en" });
  let locales: readonly string[];

  try {
    const fetched = await i18n.getLocales();
    locales = fetched.length > 0 ? fetched : ["en"];

    if (fetched.length === 0) {
      console.warn("[SEO] No locales returned from manifest, falling back to [\"en\"]");
    }
  } catch (error) {
    console.warn("[SEO] Failed to fetch locales, falling back to [\"en\"]:", error);
    locales = ["en"];
  }

  // 2. Fetch published blog posts
  let blogPosts: readonly BlogPostMeta[] = [];

  try {
    const client = createClient({ project, apiKey });
    const response = await client.getEntries("blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    blogPosts = response.items.map(toBlogPostMeta);
  } catch (error) {
    console.error("[SEO] Failed to fetch blog posts, continuing without blog pages:", error);
  }

  // 3. Generate all pages
  const marketingPages = generateMarketingPages(locales);
  const blogPages = generateBlogPages(blogPosts, locales);
  const allPages = [...marketingPages, ...blogPages];

  // 4. Log summary
  console.log(
    `[SEO] Generated ${allPages.length} pages: ${marketingPages.length} marketing + ${blogPages.length} blog (${locales.length} locales, ${blogPosts.length} posts)`,
  );

  return allPages;
}
