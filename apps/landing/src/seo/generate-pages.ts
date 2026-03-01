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
  readonly title: string;
  readonly publishedAt: string | null;
  readonly availableLanguages?: readonly string[];
}

export interface SeoData {
  readonly locales: readonly string[];
  readonly blogPosts: readonly BlogPostMeta[];
  readonly featurePages: readonly FeaturePageMeta[];
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
 * All paths include a trailing slash to match TanStack Router's
 * trailing-slash behaviour and avoid 307 redirects.
 *
 * @example
 * buildPagePath("en", "features") => "/en/features/"
 * buildPagePath("tr", "")         => "/tr/"
 */
export function buildPagePath(locale: string, pagePath: string): string {
  const segments = [locale, pagePath].filter(Boolean);
  const path = "/" + segments.join("/");
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Builds a full URL for a given locale and page path.
 * Used for sitemap hreflang alternateRefs.
 *
 * All URLs include a trailing slash to match TanStack Router's
 * trailing-slash behaviour and avoid 307 redirects in hreflang.
 *
 * @example
 * buildPageUrl("en", "features") => "https://better-i18n.com/en/features/"
 * buildPageUrl("tr", "")         => "https://better-i18n.com/tr/"
 */
export function buildPageUrl(locale: string, pagePath: string): string {
  const segments = [SITE_URL, locale, pagePath].filter(Boolean);
  const url = segments.join("/");
  return url.endsWith("/") ? url : `${url}/`;
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

// ─── Generator: Feature Detail Pages ─────────────────────────────────

/**
 * Generates feature detail pages (one per feature per available language).
 * These are CMS-driven pages at /features/$slug.
 */
export function generateFeatureDetailPages(
  features: readonly FeaturePageMeta[],
  allLocales: readonly string[],
): readonly PageEntry[] {
  return features.flatMap((feature) => {
    const featureLocales =
      feature.availableLanguages && feature.availableLanguages.length > 0
        ? feature.availableLanguages
        : allLocales;

    const alternateRefs = buildAlternateRefs(featureLocales, (locale) =>
      buildPageUrl(locale, `features/${feature.slug}`),
    );

    return featureLocales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `features/${feature.slug}`),
      sitemap: {
        priority: 0.7,
        changefreq: "weekly",
        alternateRefs,
      },
      prerender: undefined,
    }));
  });
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
    title: item.title,
    publishedAt: item.publishedAt,
    availableLanguages,
  };
}

function toFeaturePageMeta(item: ContentEntryListItem): FeaturePageMeta {
  const raw = item as unknown as Record<string, unknown>;
  const availableLanguages = Array.isArray(raw.availableLanguages)
    ? (raw.availableLanguages as unknown[]).filter(
        (v): v is string => typeof v === "string",
      )
    : undefined;

  return {
    slug: item.slug,
    availableLanguages,
  };
}

// ─── Main exports ────────────────────────────────────────────────────

/**
 * Fetches all SEO data in parallel using Promise.allSettled.
 * Failures are non-fatal — each resource falls back to an empty default.
 * Logs a single summary line on completion.
 */
export async function fetchSeoData(options: {
  readonly project: string;
  readonly apiKey: string;
}): Promise<SeoData> {
  const { project, apiKey } = options;
  const i18n = createI18nCore({ project, defaultLocale: "en" });
  const client = createClient({ project, apiKey });

  const [localesResult, blogResult, featureResult] = await Promise.allSettled([
    i18n.getLocales(),
    client.getEntries("blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    }),
    client.getEntries("marketing-pages", { status: "published", limit: 100 }),
  ]);

  const locales =
    localesResult.status === "fulfilled" && localesResult.value.length > 0
      ? localesResult.value
      : ["en"];

  const blogPosts =
    blogResult.status === "fulfilled"
      ? blogResult.value.items.map(toBlogPostMeta)
      : [];

  const featurePages =
    featureResult.status === "fulfilled"
      ? featureResult.value.items
          .filter(
            (item) =>
              (item as unknown as Record<string, unknown>).page_type === "feature",
          )
          .map(toFeaturePageMeta)
      : [];

  console.log(
    `[SEO] Fetched: ${locales.length} locales, ${blogPosts.length} posts, ${featurePages.length} features`,
  );

  return { locales, blogPosts, featurePages };
}

/**
 * Generates all page entries from pre-fetched SEO data.
 * Pure function — no I/O.
 */
export function generatePages(data: SeoData): readonly PageEntry[] {
  const { locales, blogPosts, featurePages } = data;
  const marketingPages = generateMarketingPages(locales);
  const blogPages = generateBlogPages(blogPosts, locales);
  const featureDetailPages = generateFeatureDetailPages(featurePages, locales);
  const allPages = [...marketingPages, ...blogPages, ...featureDetailPages];
  console.log(`[SEO] Generated ${allPages.length} pages`);
  return allPages;
}
