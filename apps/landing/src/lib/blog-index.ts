/**
 * Runtime loader for the build-time blog index.
 *
 * The index is emitted as `public/blog-index-{locale}.json` by
 * `src/seo/generate-blog-indexes.ts`. Uses absolute URL so the fetch
 * works in both CF Worker SSR and Vite prerender contexts — relative
 * URLs fail silently in both (no origin to resolve against).
 */

import type { BlogPostListItem } from "@/lib/content";
import { SITE_URL } from "@/seo/pages";

export interface BlogIndex {
  readonly allPosts: readonly BlogPostListItem[];
  readonly categories: readonly string[];
  readonly totalPages: number;
  readonly generatedAt: string;
}

const EMPTY_INDEX: BlogIndex = {
  allPosts: [],
  categories: [],
  totalPages: 1,
  generatedAt: new Date(0).toISOString(),
};

export async function loadBlogIndex(locale: string): Promise<BlogIndex> {
  // Dev: read local file directly (production JSON lacks latest fields)
  if (import.meta.env.DEV) {
    try {
      const { readFileSync } = await import("node:fs");
      const { join } = await import("node:path");
      const filePath = join(process.cwd(), "public", `blog-index-${locale}.json`);
      return JSON.parse(readFileSync(filePath, "utf-8")) as BlogIndex;
    } catch (error) {
      console.warn(`[blog-index] DEV local read failed for ${locale}:`, error);
    }
  }

  try {
    const res = await fetch(`${SITE_URL}/blog-index-${locale}.json`);
    if (!res.ok) {
      console.warn(`[blog-index] ${locale} → ${res.status}, serving empty index`);
      return EMPTY_INDEX;
    }
    return (await res.json()) as BlogIndex;
  } catch (error) {
    console.warn(`[blog-index] ${locale} fetch failed:`, error);
    return EMPTY_INDEX;
  }
}
