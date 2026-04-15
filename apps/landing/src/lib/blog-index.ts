/**
 * Runtime loader for the build-time blog index.
 *
 * The index is emitted as `public/blog-index-{locale}.json` by
 * `src/seo/generate-blog-indexes.ts`. Fetching a static asset is
 * cheap enough to run inside the CF Worker CPU budget, and the
 * prerender server resolves the same relative path from dist during
 * build.
 */

import type { BlogPostListItem } from "@/lib/content";

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
  try {
    const res = await fetch(`/blog-index-${locale}.json`);
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
