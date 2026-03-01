/**
 * Dynamic sitemap.xml route.
 *
 * Generates a full sitemap containing marketing pages and blog posts
 * with hreflang alternate links for all locales.
 *
 * Uses the shared page definitions from @/seo/pages and fetches blog posts
 * from the Better i18n Content SDK at request time.
 */

import { createFileRoute } from "@tanstack/react-router";
import { createI18nCore } from "@better-i18n/core";
import { createClient } from "@better-i18n/sdk";
import {
  SITE_URL,
  MARKETING_PAGES,
  type PageDefinition,
} from "@/seo/pages";

// ─── Types ──────────────────────────────────────────────────────────

interface BlogPostEntry {
  readonly slug: string;
  readonly publishedAt: string | null;
}

interface SitemapUrl {
  readonly loc: string;
  readonly lastmod: string;
  readonly changefreq: string;
  readonly priority: number;
  readonly alternates: ReadonlyArray<{
    readonly hreflang: string;
    readonly href: string;
  }>;
}

// ─── Constants ──────────────────────────────────────────────────────

/** Static pages use category-based lastmod dates instead of always "today". */
const CATEGORY_LASTMOD: Record<string, string> = {
  core: "2026-02-28",
  educational: "2026-02-15",
  legal: "2025-12-01",
  company: "2026-02-20",
};

const CACHE_DURATION_SECONDS = 3600;

// ─── Helpers ────────────────────────────────────────────────────────

function buildPageUrl(locale: string, pagePath: string): string {
  return pagePath
    ? `${SITE_URL}/${locale}/${pagePath}`
    : `${SITE_URL}/${locale}`;
}

function getPageCategory(page: PageDefinition): string {
  if (page.priority >= 0.9) return "core";
  if (page.path.startsWith("what-is")) return "educational";
  if (page.path === "privacy" || page.path === "terms") return "legal";
  return "company";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildAlternates(
  locales: readonly string[],
  pathBuilder: (locale: string) => string,
): ReadonlyArray<{ hreflang: string; href: string }> {
  const localeAlternates = locales.map((locale) => ({
    hreflang: locale,
    href: pathBuilder(locale),
  }));

  return [
    ...localeAlternates,
    { hreflang: "x-default", href: pathBuilder("en") },
  ];
}

function renderUrlEntry(url: SitemapUrl): string {
  const alternateLines = url.alternates
    .map(
      (alt) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`,
    )
    .join("\n");

  return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${url.priority}</priority>
${alternateLines}
  </url>`;
}

function renderSitemap(urls: readonly SitemapUrl[]): string {
  const entries = urls.map(renderUrlEntry).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;
}

// ─── Data fetchers ──────────────────────────────────────────────────

async function fetchLocales(project: string): Promise<readonly string[]> {
  try {
    const i18n = createI18nCore({ project, defaultLocale: "en" });
    const locales = await i18n.getLocales();
    return locales.length > 0 ? locales : ["en"];
  } catch {
    return ["en"];
  }
}

async function fetchBlogPosts(
  project: string,
  apiKey: string,
): Promise<readonly BlogPostEntry[]> {
  try {
    const client = createClient({ project, apiKey });
    const response = await client.getEntries("blog-posts", {
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    return response.items.map((item) => ({
      slug: item.slug,
      publishedAt: item.publishedAt,
    }));
  } catch (error) {
    console.error("[Sitemap] Failed to fetch blog posts:", error);
    return [];
  }
}

// ─── URL generators ─────────────────────────────────────────────────

function generateMarketingUrls(
  locales: readonly string[],
): readonly SitemapUrl[] {
  return MARKETING_PAGES.flatMap((page) => {
    const category = getPageCategory(page);
    const lastmod = CATEGORY_LASTMOD[category] ?? CATEGORY_LASTMOD.company;
    const alternates = buildAlternates(locales, (locale) =>
      buildPageUrl(locale, page.path),
    );

    return locales.map(
      (locale): SitemapUrl => ({
        loc: buildPageUrl(locale, page.path),
        lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
        alternates,
      }),
    );
  });
}

function generateBlogListingUrls(
  locales: readonly string[],
): readonly SitemapUrl[] {
  const today = new Date().toISOString().split("T")[0]!;
  const alternates = buildAlternates(locales, (locale) =>
    buildPageUrl(locale, "blog"),
  );

  return locales.map(
    (locale): SitemapUrl => ({
      loc: buildPageUrl(locale, "blog"),
      lastmod: today,
      changefreq: "daily",
      priority: 0.8,
      alternates,
    }),
  );
}

function generateBlogPostUrls(
  posts: readonly BlogPostEntry[],
  locales: readonly string[],
): readonly SitemapUrl[] {
  return posts.flatMap((post) => {
    const lastmod = post.publishedAt
      ? post.publishedAt.split("T")[0]!
      : new Date().toISOString().split("T")[0]!;

    const alternates = buildAlternates(locales, (locale) =>
      buildPageUrl(locale, `blog/${post.slug}`),
    );

    return locales.map(
      (locale): SitemapUrl => ({
        loc: buildPageUrl(locale, `blog/${post.slug}`),
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
        alternates,
      }),
    );
  });
}

// ─── Route ──────────────────────────────────────────────────────────

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const project =
          import.meta.env.BETTER_I18N_PROJECT || "better-i18n/landing";
        const apiKey = import.meta.env.BETTER_I18N_CONTENT_API_KEY || "";

        const [locales, blogPosts] = await Promise.all([
          fetchLocales(project),
          apiKey ? fetchBlogPosts(project, apiKey) : Promise.resolve([]),
        ]);

        const marketingUrls = generateMarketingUrls(locales);
        const blogListingUrls = generateBlogListingUrls(locales);
        const blogPostUrls = generateBlogPostUrls(blogPosts, locales);
        const allUrls = [
          ...marketingUrls,
          ...blogListingUrls,
          ...blogPostUrls,
        ];

        const xml = renderSitemap(allUrls);

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": `public, max-age=${CACHE_DURATION_SECONDS}, s-maxage=${CACHE_DURATION_SECONDS}`,
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
