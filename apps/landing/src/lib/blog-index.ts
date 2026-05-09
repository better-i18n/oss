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

  // CF Worker SSR: read from ASSETS binding directly (avoids worker-to-self fetch loop)
  const cfAssets = (globalThis as any).__cf_assets as { fetch: (req: Request | string) => Promise<Response> } | undefined;
  if (cfAssets) {
    try {
      const res = await cfAssets.fetch(new Request(`${SITE_URL}/blog-index-${locale}.json`));
      if (res.ok) return (await res.json()) as BlogIndex;
      console.warn(`[blog-index] ASSETS ${locale} → ${res.status}`);
    } catch (error) {
      console.warn(`[blog-index] ASSETS ${locale} failed:`, error);
    }
  }

  // Fallback: HTTP fetch (browser client-side, non-CF environments)
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
