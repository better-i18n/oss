/**
 * Build-time blog index generator.
 *
 * Replaces the runtime `loadBlogPosts` server function. Emits one
 * `public/blog-index-{locale}.json` file per locale so that:
 *   - Prerendered /blog/ HTML already contains the data (baked by loader).
 *   - Client-side SPA navigation hits a static JSON asset instead of the
 *     `_serverFn` endpoint (which was CPU-limited on CF Workers).
 *
 * Regenerated on every build. Content changes require a redeploy — gate
 * publishes in the CMS via a deploy webhook.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  getAllBlogPostsForLocale,
  type BlogPostListItem,
} from "../lib/content";

export interface BlogIndex {
  readonly allPosts: readonly BlogPostListItem[];
  readonly categories: readonly string[];
  readonly totalPages: number;
  readonly generatedAt: string;
}

const POSTS_PER_PAGE = 12;

/**
 * Fetch blog posts for all locales in parallel and write each as a
 * static JSON file into `public/`. Failures for one locale emit an
 * empty index for that locale so the build never breaks on a single
 * API hiccup — the empty-state UI handles zero posts gracefully.
 */
export async function generateBlogIndexes(
  locales: readonly string[],
  publicDir: string,
): Promise<void> {
  await mkdir(publicDir, { recursive: true });

  const results = await Promise.allSettled(
    locales.map(async (locale) => {
      const allPosts = await getAllBlogPostsForLocale(locale);
      const categories = [
        ...new Set(allPosts.flatMap((p) => (p.category ? [p.category] : []))),
      ].sort();
      const index: BlogIndex = {
        allPosts,
        categories,
        totalPages: Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE)),
        generatedAt: new Date().toISOString(),
      };
      const file = join(publicDir, `blog-index-${locale}.json`);
      await writeFile(file, JSON.stringify(index), "utf-8");
      return { locale, count: allPosts.length };
    }),
  );

  const ok: Array<{ locale: string; count: number }> = [];
  const failed: Array<{ locale: string; error: string }> = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") ok.push(r.value);
    else {
      const locale = locales[i];
      failed.push({ locale, error: String(r.reason) });
      // Emit empty index so the loader never 404s at runtime.
      const fallback: BlogIndex = {
        allPosts: [],
        categories: [],
        totalPages: 1,
        generatedAt: new Date().toISOString(),
      };
      await writeFile(
        join(publicDir, `blog-index-${locale}.json`),
        JSON.stringify(fallback),
        "utf-8",
      );
    }
  }

  console.log(
    `[SEO] Blog indexes: ${ok.length} generated (${ok
      .map((r) => `${r.locale}:${r.count}`)
      .join(", ")})${failed.length ? `, ${failed.length} failed: ${failed.map((f) => f.locale).join(", ")}` : ""}`,
  );
}
