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
  // Browser first. TanStack re-runs this loader on the client, and every branch
  // below is server-only: `node:fs` cannot resolve, there is no `__cf_assets`,
  // and SITE_URL is the PRODUCTION origin — so in dev the browser made a
  // cross-origin request to better-i18n.com, failed, and returned EMPTY_INDEX.
  // The page then replaced 24 server-rendered posts with the "no posts yet"
  // empty state. A relative URL is same-origin in both dev and production.
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/blog-index-${locale}.json`);
      if (res.ok) return (await res.json()) as BlogIndex;
      console.warn(`[blog-index] client ${locale} → ${res.status}`);
    } catch (error) {
      console.warn(`[blog-index] client ${locale} fetch failed:`, error);
    }
    // Never hand an empty index to a page that already rendered posts —
    // throwing keeps whatever the server sent on screen.
    throw new Error(`blog index unavailable for ${locale}`);
  }

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
