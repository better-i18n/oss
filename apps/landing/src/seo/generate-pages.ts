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
import type { ContentEntryListItem, ListEntriesOptions } from "@better-i18n/sdk";

import { SITE_URL, MARKETING_PAGES } from "./pages";
import type { ChangeFreq } from "./pages";
import { getLocaleTier, TIER_PRIORITY_MULTIPLIER } from "./locale-tiers";
import type { LocaleTier } from "./locale-tiers";
import { ALL_LOCALE_CODES } from "../lib/tools/locales";
import { ALL_FORMAT_PAIR_SLUGS } from "../lib/tools/formats";

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
  readonly noindex?: boolean;
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
  readonly excerpt?: string;
  readonly availableLanguages?: readonly string[];
}

/**
 * Flattened i18n messages: `{ "llms.tagline": "...", "schema.slogan": "..." }`
 * Produced by flattening the CDN's namespaced format at build time.
 */
export type FlatMessages = Readonly<Record<string, string>>;

export interface SeoData {
  readonly locales: readonly string[];
  readonly blogPosts: readonly BlogPostMeta[];
  readonly featurePages: readonly FeaturePageMeta[];
  /** Per-locale i18n messages fetched from CDN (locale → flat key-value map) */
  readonly i18nMessages: ReadonlyMap<string, FlatMessages>;
  /** Per-locale translation coverage ratio (0–1) relative to English key count */
  readonly localeCoverage: ReadonlyMap<string, number>;
}

export interface FeaturePageMeta {
  readonly slug: string;
  readonly availableLanguages?: readonly string[];
  readonly publishedAt?: string;
}

// ─── Constants ───────────────────────────────────────────────────────

/**
 * Locales with translation coverage below this threshold (30%) are considered
 * thin content and will be marked as noindex to prevent Google penalties.
 */
export const THIN_CONTENT_THRESHOLD = 0.5;

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
 *
 * Tier and coverage rules:
 * - **Tier 3** locales are excluded from the sitemap entirely.
 * - **Tier 2** locales get reduced sitemap priority but are prerendered.
 * - Locales below THIN_CONTENT_THRESHOLD or in tier 3 are marked noindex.
 * - **Tier 1** and **tier 2** locales are prerendered.
 */
export function generateMarketingPages(
  locales: readonly string[],
  buildDate?: string,
  localeCoverage?: ReadonlyMap<string, number>,
): readonly PageEntry[] {
  const lastmod = buildDate || new Date().toISOString().split("T")[0];

  // Tier 3 locales are excluded from sitemap generation
  const sitemapLocales = locales.filter((l) => getLocaleTier(l) !== "tier3");

  // Pages with sitemap: false are excluded from sitemap generation
  // but may still be prerendered (they remain routable).
  const sitemapPages = MARKETING_PAGES.filter(
    (p) => !("sitemap" in p) || p.sitemap !== false,
  );

  return sitemapPages.flatMap((page) => {
    // hreflang alternates only reference locales present in the sitemap
    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, page.path),
    );

    return sitemapLocales.map((locale): PageEntry => {
      const tier: LocaleTier = getLocaleTier(locale);
      const coverage = localeCoverage?.get(locale) ?? 1.0;
      const isThinContent = coverage < THIN_CONTENT_THRESHOLD;
      const shouldNoindex = isThinContent || tier === "tier3";

      const priorityMultiplier = TIER_PRIORITY_MULTIPLIER[tier];
      const adjustedPriority = Math.round(page.priority * priorityMultiplier * 100) / 100;

      // Prerender tier 1 and tier 2 locales so crawlers see full HTML
      // (on-demand SSR on Cloudflare Workers sends an empty Suspense shell)
      const shouldPrerender = page.prerender && (tier === "tier1" || tier === "tier2");

      return {
        path: buildPagePath(locale, page.path),
        sitemap: {
          priority: adjustedPriority,
          changefreq: page.changefreq,
          lastmod,
          alternateRefs,
          ...(shouldNoindex ? { noindex: true } : {}),
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });
  });
}

// ─── Generator: Blog Pages ──────────────────────────────────────────

/**
 * Generates blog listing pages (one per locale) and blog post detail pages
 * (one per post per available language).
 *
 * - Listing pages are prerendered.
 * - Detail pages are prerendered for tier 1 and tier 2 locales.
 * - Falls back to allLocales when a post has no availableLanguages.
 */
export function generateBlogPages(
  posts: readonly BlogPostMeta[],
  allLocales: readonly string[],
): readonly PageEntry[] {
  const listingPages = generateBlogListingPages(posts, allLocales);
  const detailPages = posts.flatMap((post) =>
    generateBlogDetailPages(post, allLocales),
  );

  return [...listingPages, ...detailPages];
}

/**
 * Generates blog listing pages with pagination support.
 *
 * For each locale:
 * - Page 1: /{locale}/blog/ (priority 0.8)
 * - Page 2+: /{locale}/blog/page/{N}/ (priority 0.6)
 *
 * hreflang rule: Page N only includes locales that actually have N pages.
 * Example: /en/blog/page/7/ won't have /tr/blog/page/7/ in hreflang
 * if Turkish only has 2 pages worth of content.
 */
function generateBlogListingPages(
  posts: readonly BlogPostMeta[],
  allLocales: readonly string[],
): readonly PageEntry[] {
  const pages: PageEntry[] = [];

  // Only tier 1 and tier 2 locales get sitemap entries for blog listings
  const sitemapLocales = allLocales.filter(
    (l) => getLocaleTier(l) !== "tier3",
  );

  // Count posts per locale (still count all locales for hreflang accuracy)
  const localePostCounts = new Map<string, number>();
  for (const locale of allLocales) {
    const count = posts.filter(
      (p) =>
        p.availableLanguages?.includes(locale) ||
        (!p.availableLanguages?.length && locale === "en"),
    ).length;
    localePostCounts.set(locale, count);
  }

  for (const locale of sitemapLocales) {
    const count = localePostCounts.get(locale) ?? 0;
    if (count === 0) continue;

    // hreflang alternates only reference sitemap-eligible locales with posts
    const validLocalesForPage1 = sitemapLocales.filter(
      (l) => (localePostCounts.get(l) ?? 0) > 0,
    );

    // Page 1: /{locale}/blog/
    pages.push({
      path: buildPagePath(locale, "blog"),
      sitemap: {
        priority: 0.8,
        changefreq: "daily",
        alternateRefs: buildAlternateRefs(validLocalesForPage1, (l) =>
          buildPageUrl(l, "blog"),
        ),
      },
      // SSR — no prerender
    });

    // Page 2+: excluded from sitemap entirely.
    // These pages are noindex and add no SEO value — keeping them out
    // of the sitemap avoids bloat and wasted crawl budget.
  }

  return pages;
}

function generateBlogDetailPages(
  post: BlogPostMeta,
  _allLocales: readonly string[],
): readonly PageEntry[] {
  // Only generate pages for languages the post is actually published in.
  // Falling back to allLocales would create sitemap entries for non-existent
  // translations, causing soft 404s and thin content warnings in Google Search Console.
  const rawLocales =
    post.availableLanguages && post.availableLanguages.length > 0
      ? post.availableLanguages
      : ["en"];

  // Apply locale tier filtering: tier 3 locales are excluded from sitemap
  // and marked noindex, same as marketing pages. Without this filter, blog
  // posts bypass the tier system and leak tier 3 pages into the sitemap.
  const sitemapLocales = rawLocales.filter(
    (l) => getLocaleTier(l) !== "tier3",
  );

  // hreflang alternates only reference locales present in the sitemap
  const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
    buildPageUrl(locale, `blog/${post.slug}`),
  );

  // Generate sitemap entries for tier 1 and tier 2 locales
  const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
    const tier = getLocaleTier(locale);
    // Prerender tier 1 and tier 2 blog posts so crawlers see full HTML
    // (on-demand SSR on Cloudflare Workers sends an empty Suspense shell)
    const shouldPrerender = tier === "tier1" || tier === "tier2";

    return {
      path: buildPagePath(locale, `blog/${post.slug}`),
      sitemap: {
        priority: 0.7,
        changefreq: "weekly",
        lastmod: post.publishedAt ?? undefined,
        alternateRefs,
      },
      prerender: shouldPrerender ? { enabled: true } : undefined,
    };
  });

  // Tier 3 locales still get page entries (for prerender/SSR) but are
  // excluded from the sitemap and marked noindex to prevent Google indexing.
  const tier3Locales = rawLocales.filter(
    (l) => getLocaleTier(l) === "tier3",
  );
  const tier3Entries = tier3Locales.map((locale): PageEntry => ({
    path: buildPagePath(locale, `blog/${post.slug}`),
    sitemap: {
      priority: 0,
      changefreq: "weekly",
      lastmod: post.publishedAt ?? undefined,
      alternateRefs,
      noindex: true,
    },
  }));

  return [...sitemapEntries, ...tier3Entries];
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
    const rawLocales =
      feature.availableLanguages && feature.availableLanguages.length > 0
        ? feature.availableLanguages
        : allLocales;

    // Apply locale tier filtering: tier 3 locales get noindex entries
    const sitemapLocales = rawLocales.filter(
      (l) => getLocaleTier(l) !== "tier3",
    );

    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, `features/${feature.slug}`),
    );

    const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
      const tier = getLocaleTier(locale);
      const shouldPrerender = tier === "tier1" || tier === "tier2";

      return {
        path: buildPagePath(locale, `features/${feature.slug}`),
        sitemap: {
          priority: 0.7,
          changefreq: "weekly",
          lastmod: feature.publishedAt ?? undefined,
          alternateRefs,
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });

    // Tier 3 locales: noindex, excluded from sitemap priority
    const tier3Locales = rawLocales.filter(
      (l) => getLocaleTier(l) === "tier3",
    );
    const tier3Entries = tier3Locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `features/${feature.slug}`),
      sitemap: {
        priority: 0,
        changefreq: "weekly",
        lastmod: feature.publishedAt ?? undefined,
        alternateRefs,
        noindex: true,
      },
    }));

    return [...sitemapEntries, ...tier3Entries];
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
    ? (raw.availableLanguages as unknown[]).flatMap((v): string[] => {
      if (typeof v === "string") return [v];
      if (v !== null && typeof v === "object") {
        const code = (v as Record<string, unknown>).code;
        if (typeof code === "string") return [code];
      }
      return [];
    })
    : undefined;

  const excerpt = typeof raw.excerpt === "string" ? raw.excerpt : undefined;

  return {
    slug: item.slug,
    title: item.title,
    publishedAt: item.publishedAt,
    excerpt,
    availableLanguages,
  };
}

function toFeaturePageMeta(item: ContentEntryListItem): FeaturePageMeta {
  const raw = item as unknown as Record<string, unknown>;
  const availableLanguages = Array.isArray(raw.availableLanguages)
    ? (raw.availableLanguages as unknown[]).flatMap((v): string[] => {
      if (typeof v === "string") return [v];
      if (v !== null && typeof v === "object") {
        const code = (v as Record<string, unknown>).code;
        if (typeof code === "string") return [code];
      }
      return [];
    })
    : undefined;

  return {
    slug: item.slug,
    availableLanguages,
    publishedAt: item.publishedAt ?? undefined,
  };
}

// ─── Paginated Fetch ─────────────────────────────────────────────────

/**
 * Fetches ALL entries from a content model by paginating through API results.
 * The Content API has a max limit of 100 items per request.
 * For 202 blog posts, this makes 3 API calls (100 + 100 + 2).
 */
async function fetchAllEntries(
  client: ReturnType<typeof createClient>,
  model: string,
  options: Pick<ListEntriesOptions, "status" | "sort" | "order">,
): Promise<readonly ContentEntryListItem[]> {
  const allItems: ContentEntryListItem[] = [];
  let page = 1;

  while (true) {
    const result = await client.getEntries(model, {
      ...options,
      limit: 100,
      page,
    });
    allItems.push(...result.items);
    if (!result.hasMore) break;
    page++;
  }

  return allItems;
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
    fetchAllEntries(client, "blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
    }),
    client.getEntries("marketing-pages", { status: "published", limit: 100 }),
  ]);

  const locales =
    localesResult.status === "fulfilled" && localesResult.value.length > 0
      ? localesResult.value
      : ["en"];

  const blogPosts =
    blogResult.status === "fulfilled"
      ? blogResult.value.map(toBlogPostMeta)
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

  // Fetch i18n messages for all locales (used by llms-txt and structured-data).
  // CDN returns namespaced format: { "llms": { "tagline": "..." } }
  // We flatten to: { "llms.tagline": "..." } for easy key lookup.
  const i18nMessages = new Map<string, FlatMessages>();
  const messageResults = await Promise.allSettled(
    locales.map(async (locale) => {
      const namespacedMessages = await i18n.getMessages(locale);
      const flat: Record<string, string> = {};
      for (const [ns, keys] of Object.entries(namespacedMessages)) {
        for (const [key, value] of Object.entries(keys)) {
          if (typeof value === "string") {
            flat[`${ns}.${key}`] = value;
          }
        }
      }
      return { locale, messages: flat } as const;
    }),
  );
  for (const result of messageResults) {
    if (result.status === "fulfilled") {
      i18nMessages.set(result.value.locale, result.value.messages);
    }
  }

  // Calculate per-locale translation coverage relative to English key count.
  // English is the source locale and always has coverage = 1.0.
  const enKeys = i18nMessages.get("en");
  const enKeyCount = enKeys ? Object.keys(enKeys).length : 0;
  const localeCoverage = new Map<string, number>();
  for (const locale of locales) {
    if (locale === "en" || enKeyCount === 0) {
      localeCoverage.set(locale, 1.0);
    } else {
      const localeKeys = i18nMessages.get(locale);
      const localeKeyCount = localeKeys ? Object.keys(localeKeys).length : 0;
      localeCoverage.set(locale, localeKeyCount / enKeyCount);
    }
  }

  const thinLocales = locales.filter(
    (l) => (localeCoverage.get(l) ?? 0) < THIN_CONTENT_THRESHOLD,
  );
  console.log(
    `[SEO] Fetched: ${locales.length} locales, ${blogPosts.length} posts, ${featurePages.length} features, ${i18nMessages.size} message bundles`,
  );
  if (thinLocales.length > 0) {
    console.log(
      `[SEO] Thin content (< ${THIN_CONTENT_THRESHOLD * 100}% coverage): ${thinLocales.join(", ")}`,
    );
  }

  return { locales, blogPosts, featurePages, i18nMessages, localeCoverage };
}

// ─── Generator: Locale Explorer Detail Pages ─────────────────────────

function generateLocaleExplorerPages(
  allLocales: readonly string[],
): readonly PageEntry[] {
  return ALL_LOCALE_CODES.flatMap((localeCode) => {
    const sitemapLocales = allLocales.filter(
      (l) => getLocaleTier(l) !== "tier3",
    );
    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, `tools/locale-explorer/${localeCode}`),
    );

    const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
      const tier = getLocaleTier(locale);
      const shouldPrerender = tier === "tier1" || tier === "tier2";
      const priorityMultiplier = TIER_PRIORITY_MULTIPLIER[tier];

      return {
        path: buildPagePath(locale, `tools/locale-explorer/${localeCode}`),
        sitemap: {
          priority: +(0.6 * priorityMultiplier).toFixed(2),
          changefreq: "yearly",
          alternateRefs,
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });

    const tier3Locales = allLocales.filter(
      (l) => getLocaleTier(l) === "tier3",
    );
    const tier3Entries = tier3Locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `tools/locale-explorer/${localeCode}`),
      sitemap: {
        priority: 0,
        changefreq: "yearly",
        alternateRefs,
        noindex: true,
      },
    }));

    return [...sitemapEntries, ...tier3Entries];
  });
}

// ─── Generator: Converter Format Pair Pages ──────────────────────────

function generateConverterPairPages(
  allLocales: readonly string[],
): readonly PageEntry[] {
  return ALL_FORMAT_PAIR_SLUGS.flatMap((pairSlug) => {
    const sitemapLocales = allLocales.filter(
      (l) => getLocaleTier(l) !== "tier3",
    );
    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, `tools/translation-file-converter/${pairSlug}`),
    );

    const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
      const tier = getLocaleTier(locale);
      const shouldPrerender = tier === "tier1" || tier === "tier2";
      const priorityMultiplier = TIER_PRIORITY_MULTIPLIER[tier];

      return {
        path: buildPagePath(locale, `tools/translation-file-converter/${pairSlug}`),
        sitemap: {
          priority: +(0.7 * priorityMultiplier).toFixed(2),
          changefreq: "monthly",
          alternateRefs,
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });

    const tier3Locales = allLocales.filter(
      (l) => getLocaleTier(l) === "tier3",
    );
    const tier3Entries = tier3Locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `tools/translation-file-converter/${pairSlug}`),
      sitemap: {
        priority: 0,
        changefreq: "monthly",
        alternateRefs,
        noindex: true,
      },
    }));

    return [...sitemapEntries, ...tier3Entries];
  });
}

/**
 * Generates all page entries from pre-fetched SEO data.
 * Pure function — no I/O.
 */
export function generatePages(data: SeoData, buildDate?: string): readonly PageEntry[] {
  const { locales, blogPosts, featurePages, localeCoverage } = data;
  const marketingPages = generateMarketingPages(locales, buildDate, localeCoverage);
  const blogPages = generateBlogPages(blogPosts, locales);
  const featureDetailPages = generateFeatureDetailPages(featurePages, locales);
  const localeExplorerPages = generateLocaleExplorerPages(locales);
  const converterPairPages = generateConverterPairPages(locales);
  const allPages = [...marketingPages, ...blogPages, ...featureDetailPages,
                     ...localeExplorerPages, ...converterPairPages];

  const noindexCount = allPages.filter((p) => p.sitemap.noindex).length;
  console.log(`[SEO] Generated ${allPages.length} pages (${noindexCount} noindex)`);
  return allPages;
}
