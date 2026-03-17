/**
 * Build-time page generator for Help Center SEO.
 *
 * Fetches locales, collections, and articles from the CDN/Content SDK at BUILD TIME,
 * then produces a page config array with hreflang alternateRefs for sitemap + prerender.
 *
 * This module runs inside vite.config.ts — it must not import React or browser-only APIs.
 */

import { createI18nCore } from "@better-i18n/core";
import { createClient } from "@better-i18n/sdk";
import type { ContentEntryListItem } from "@better-i18n/sdk";

// ─── Constants ───────────────────────────────────────────────────────

const SITE_URL = "https://help.better-i18n.com";

// ─── Types ──────────────────────────────────────────────────────────

export interface AlternateRef {
  readonly href: string;
  readonly hreflang: string;
}

export interface SitemapConfig {
  readonly priority: number;
  readonly changefreq: "daily" | "weekly" | "monthly" | "yearly";
  readonly lastmod?: string;
  readonly alternateRefs: readonly AlternateRef[];
  readonly noindex?: boolean;
}

export interface PageEntry {
  readonly path: string;
  readonly sitemap: SitemapConfig;
  readonly prerender?: { readonly enabled: boolean };
}

interface CollectionMeta {
  readonly slug: string;
}

interface ArticleMeta {
  readonly slug: string;
  readonly collectionSlug: string | null;
}

export interface SeoData {
  readonly locales: readonly string[];
  readonly collections: readonly CollectionMeta[];
  readonly articles: readonly ArticleMeta[];
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Builds a relative path with trailing slash.
 * @example buildPagePath("en", "faq") => "/en/faq/"
 */
function buildPagePath(locale: string, pagePath: string): string {
  const segments = [locale, pagePath].filter(Boolean);
  const path = "/" + segments.join("/");
  return path.endsWith("/") ? path : `${path}/`;
}

/**
 * Builds a full URL with trailing slash.
 * @example buildPageUrl("en", "faq") => "https://help.better-i18n.com/en/faq/"
 */
function buildPageUrl(locale: string, pagePath: string): string {
  const segments = [SITE_URL, locale, pagePath].filter(Boolean);
  const url = segments.join("/");
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Creates hreflang alternate refs for all locales plus x-default (en).
 */
function buildAlternateRefs(
  locales: readonly string[],
  pathBuilder: (locale: string) => string,
): readonly AlternateRef[] {
  const refs: AlternateRef[] = locales.map((locale) => ({
    href: pathBuilder(locale),
    hreflang: locale,
  }));

  const defaultLocale = locales.includes("en") ? "en" : locales[0] ?? "en";
  refs.push({ href: pathBuilder(defaultLocale), hreflang: "x-default" });

  return refs;
}

// ─── Page Generators ────────────────────────────────────────────────

function generateStaticPages(
  locales: readonly string[],
  lastmod: string,
): readonly PageEntry[] {
  const staticPages = [
    { path: "", priority: 1.0, changefreq: "daily" as const },
    { path: "faq", priority: 0.7, changefreq: "weekly" as const },
  ];

  return staticPages.flatMap((page) => {
    const alternateRefs = buildAlternateRefs(locales, (locale) =>
      buildPageUrl(locale, page.path),
    );

    return locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, page.path),
      sitemap: {
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod,
        alternateRefs,
      },
      prerender: { enabled: true },
    }));
  });
}

function generateCollectionPages(
  collections: readonly CollectionMeta[],
  locales: readonly string[],
  lastmod: string,
): readonly PageEntry[] {
  return collections.flatMap((collection) => {
    const alternateRefs = buildAlternateRefs(locales, (locale) =>
      buildPageUrl(locale, collection.slug),
    );

    return locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, collection.slug),
      sitemap: {
        priority: 0.8,
        changefreq: "weekly",
        lastmod,
        alternateRefs,
      },
      prerender: { enabled: true },
    }));
  });
}

function generateArticlePages(
  articles: readonly ArticleMeta[],
  locales: readonly string[],
  lastmod: string,
): readonly PageEntry[] {
  return articles
    .filter((a) => a.collectionSlug)
    .flatMap((article) => {
      const pagePath = `${article.collectionSlug}/${article.slug}`;
      const alternateRefs = buildAlternateRefs(locales, (locale) =>
        buildPageUrl(locale, pagePath),
      );

      return locales.map((locale): PageEntry => ({
        path: buildPagePath(locale, pagePath),
        sitemap: {
          priority: 0.6,
          changefreq: "weekly",
          lastmod,
          alternateRefs,
        },
        prerender: { enabled: true },
      }));
    });
}

// ─── SDK Response Casting ───────────────────────────────────────────

function toCollectionMeta(item: ContentEntryListItem): CollectionMeta {
  return { slug: item.slug };
}

function toArticleMeta(item: ContentEntryListItem): ArticleMeta {
  const raw = item as unknown as Record<string, unknown>;
  const relations = raw.relations as Record<string, { slug?: string } | null | undefined> | undefined;
  return {
    slug: item.slug,
    collectionSlug: relations?.collection?.slug ?? null,
  };
}

// ─── Main Exports ───────────────────────────────────────────────────

/**
 * Fetches all SEO data at build time using Promise.allSettled.
 * Failures are non-fatal — each resource falls back to an empty default.
 */
export async function fetchSeoData(options: {
  readonly project: string;
  readonly apiKey: string;
}): Promise<SeoData> {
  const { project, apiKey } = options;
  const i18n = createI18nCore({ project, defaultLocale: "en" });
  const client = createClient({ project, apiKey });

  const [localesResult, collectionsResult, articlesResult] = await Promise.allSettled([
    i18n.getLocales(),
    client.getEntries("help-collection", {
      status: "published",
      limit: 100,
      sort: "createdAt",
      order: "asc",
    }),
    client.getEntries("help-article", {
      status: "published",
      limit: 100,
      sort: "createdAt",
      order: "asc",
      expand: ["collection"],
    }),
  ]);

  const locales =
    localesResult.status === "fulfilled" && localesResult.value.length > 0
      ? localesResult.value
      : ["en"];

  const collections =
    collectionsResult.status === "fulfilled"
      ? collectionsResult.value.items.map(toCollectionMeta)
      : [];

  const articles =
    articlesResult.status === "fulfilled"
      ? articlesResult.value.items.map(toArticleMeta)
      : [];

  console.log(
    `[SEO] Fetched: ${locales.length} locales, ${collections.length} collections, ${articles.length} articles`,
  );

  return { locales, collections, articles };
}

/**
 * Generates all page entries from pre-fetched SEO data. Pure function — no I/O.
 */
export function generatePages(data: SeoData, buildDate?: string): readonly PageEntry[] {
  const { locales, collections, articles } = data;
  const lastmod = buildDate || new Date().toISOString().split("T")[0];

  const allPages = [
    ...generateStaticPages(locales, lastmod),
    ...generateCollectionPages(collections, locales, lastmod),
    ...generateArticlePages(articles, locales, lastmod),
  ];

  console.log(`[SEO] Generated ${allPages.length} pages`);
  return allPages;
}
