/**
 * Build-time blog index generator.
 *
 * Emits one `public/blog-index-{locale}.json` file per locale so that:
 *   - Prerendered /blog/ HTML already contains the data (baked by loader).
 *   - Client-side SPA navigation hits a static JSON asset instead of the
 *     `_serverFn` endpoint (which was CPU-limited on CF Workers).
 *
 * Invariants (do not regress):
 *   1. **No runtime imports.** This file is loaded by vite.config.ts at
 *      config-time, before Vite injects `import.meta.env`. Do not import
 *      from `../lib/content` or any module that touches `import.meta.env`.
 *   2. **No `body` field.** Body markdown is huge (avg 10-50KB per post).
 *      Fetching it for 22 locales × thousands of posts blew the Node heap.
 *      We use `fields: [...]` to request only what the list UI renders and
 *      rely on the CMS `excerpt` field (no client-side extraction).
 *   3. **Capped + bounded-concurrent.** Every locale is capped at
 *      POST_CAP posts (enough for the list UI's pagination + category
 *      filter). A LOCALE_CONCURRENCY-sized worker pool processes the
 *      locales so wall time stays O(N/concurrency) instead of O(N), and
 *      peak memory stays bounded to concurrency × cap × per-post-size.
 *      The sitemap still emits every post URL — SEO coverage is unaffected.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createClient, hasLanguage } from "@better-i18n/sdk";

export interface BlogPostListItem {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string | null;
  readonly readTime: string | null;
  readonly featured: boolean;
  readonly bannerImage: string | null;
  readonly category: string | null;
  readonly authorName: string | null;
  readonly authorAvatar: string | null;
}

export interface BlogIndex {
  readonly allPosts: readonly BlogPostListItem[];
  readonly categories: readonly string[];
  readonly totalPages: number;
  readonly generatedAt: string;
}

const POSTS_PER_PAGE = 12;
const PAGE_SIZE = 100;
/**
 * Cap on posts baked into each locale's blog-index JSON. The list UI
 * paginates 12 posts per page, so 500 = ~42 pages — far beyond what any
 * human scrolls. The sitemap (generatePages) still includes every post,
 * so SEO indexing is unaffected by this cap.
 */
const POST_CAP = 500;
/**
 * How many locales to fetch concurrently. Sequential was correct for
 * memory safety when each locale held full body markdown; with POST_CAP
 * and fields-limited fetches the per-locale footprint is ~500 × ~500B
 * = 250KB, so a concurrency pool is safe and cuts wall time ~N×.
 */
const LOCALE_CONCURRENCY = 6;

type RelationValue = { title?: string; [key: string]: string | null | undefined };
type RawEntry = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: string | null;
  read_time?: string | null;
  featured?: string | boolean | null;
  banner_image?: string | null;
  relations?: Record<string, RelationValue | null | undefined>;
  [key: string]: unknown;
};

function mapEntry(entry: RawEntry): BlogPostListItem {
  return {
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt ?? "",
    publishedAt: entry.publishedAt,
    readTime: entry.read_time ?? null,
    featured: entry.featured === "true" || entry.featured === true,
    bannerImage: entry.banner_image ?? null,
    category: entry.relations?.category?.name ?? null,
    authorName: entry.relations?.author?.title ?? null,
    authorAvatar: entry.relations?.author?.avatar ?? null,
  };
}

async function fetchPostsForLocale(
  client: ReturnType<typeof createClient>,
  locale: string,
): Promise<BlogPostListItem[]> {
  const collected: BlogPostListItem[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await client.getEntries("blog-posts", {
      language: locale,
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: PAGE_SIZE,
      page,
      expand: ["author", "category"],
      fields: [
        "slug",
        "title",
        "excerpt",
        "publishedAt",
        "read_time",
        "featured",
        "banner_image",
        "langs",
      ],
    });

    for (const item of result.items) {
      const raw = item as unknown as RawEntry & Record<string, unknown>;
      // The Content API falls back to source language when a translation
      // is missing; filter those out so the locale's index only shows
      // posts with an actual translation.
      if (!hasLanguage(raw as Record<string, unknown>, locale)) continue;
      collected.push(mapEntry(raw));
      if (collected.length >= POST_CAP) break;
    }

    if (collected.length >= POST_CAP) break;
    hasMore = result.hasMore;
    page++;
  }

  return collected.slice(0, POST_CAP);
}

/**
 * Fetch blog posts for each locale sequentially and write each as a
 * static JSON file into `public/`. Failures for one locale emit an
 * empty index for that locale so the build never breaks on a single
 * API hiccup — the empty-state UI handles zero posts gracefully.
 */
export async function generateBlogIndexes(
  locales: readonly string[],
  publicDir: string,
  options: { readonly project: string; readonly apiKey: string },
): Promise<void> {
  await mkdir(publicDir, { recursive: true });

  const client = createClient({
    project: options.project,
    apiKey: options.apiKey,
  });

  const ok: Array<{ locale: string; count: number }> = [];
  const failed: Array<{ locale: string; error: string }> = [];
  const queue = [...locales];

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const locale = queue.shift();
      if (!locale) return;
      const filePath = join(publicDir, `blog-index-${locale}.json`);
      try {
        const allPosts = await fetchPostsForLocale(client, locale);
        const categories = [
          ...new Set(allPosts.flatMap((p) => (p.category ? [p.category] : []))),
        ].sort();
        const index: BlogIndex = {
          allPosts,
          categories,
          totalPages: Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE)),
          generatedAt: new Date().toISOString(),
        };
        await writeFile(filePath, JSON.stringify(index), "utf-8");
        ok.push({ locale, count: allPosts.length });
      } catch (error) {
        failed.push({ locale, error: String(error) });
        const fallback: BlogIndex = {
          allPosts: [],
          categories: [],
          totalPages: 1,
          generatedAt: new Date().toISOString(),
        };
        await writeFile(filePath, JSON.stringify(fallback), "utf-8");
      }
    }
  }

  await Promise.all(
    Array.from({ length: LOCALE_CONCURRENCY }, () => worker()),
  );

  console.log(
    `[SEO] Blog indexes: ${ok.length} generated (${ok
      .map((r) => `${r.locale}:${r.count}`)
      .join(", ")})${failed.length ? `, ${failed.length} failed: ${failed.map((f) => f.locale).join(", ")}` : ""}`,
  );
}
