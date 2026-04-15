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
 *   3. **Sequential per-locale.** Paralleling Promise.allSettled across 22
 *      locales multiplied peak memory by 22× — enough to OOM even with
 *      body excluded. Process one locale at a time so the prior batch is
 *      eligible for GC before the next fetch starts.
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
    }

    hasMore = result.hasMore;
    page++;
  }

  return collected;
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

  for (const locale of locales) {
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

  console.log(
    `[SEO] Blog indexes: ${ok.length} generated (${ok
      .map((r) => `${r.locale}:${r.count}`)
      .join(", ")})${failed.length ? `, ${failed.length} failed: ${failed.map((f) => f.locale).join(", ")}` : ""}`,
  );
}
