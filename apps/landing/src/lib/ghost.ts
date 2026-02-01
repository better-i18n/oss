/**
 * Ghost Content API Client
 *
 * Lightweight fetch-based client for Ghost Content API.
 * Uses tag-based localization (lang-en, lang-tr, etc.)
 */

const GHOST_URL = "https://ghost.better-i18n.com";

// Types for Ghost API responses
export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface GhostPost {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  published_at: string;
  updated_at: string;
  reading_time: number;
  primary_author?: GhostAuthor;
  authors?: GhostAuthor[];
  primary_tag?: GhostTag;
  tags?: GhostTag[];
}

interface GhostPostsResponse {
  posts: GhostPost[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
      next: number | null;
      prev: number | null;
    };
  };
}

interface GhostPostResponse {
  posts: GhostPost[];
}

/**
 * Get API key from environment
 * In Cloudflare Workers, use env parameter from request context
 */
function getApiKey(env?: { GHOST_CONTENT_API_KEY?: string }): string {
  // Try env parameter first (Cloudflare Workers)
  if (env?.GHOST_CONTENT_API_KEY) {
    return env.GHOST_CONTENT_API_KEY;
  }

  // Fallback to import.meta.env (Vite dev)
  if (typeof import.meta !== "undefined") {
    if (import.meta.env?.GHOST_CONTENT_API_KEY) {
      return import.meta.env.GHOST_CONTENT_API_KEY;
    }
    // Also check VITE_ prefixed version just in case
    if (import.meta.env?.VITE_GHOST_CONTENT_API_KEY) {
      return import.meta.env.VITE_GHOST_CONTENT_API_KEY;
    }
  }

  // Fallback to process.env (Node/Bun)
  if (typeof process !== "undefined" && process.env) {
    if (process.env.GHOST_CONTENT_API_KEY) {
      return process.env.GHOST_CONTENT_API_KEY;
    }
    if (process.env.VITE_GHOST_CONTENT_API_KEY) {
      return process.env.VITE_GHOST_CONTENT_API_KEY;
    }
  }

  throw new Error("GHOST_CONTENT_API_KEY is not configured");
}

/**
 * Fetch blog posts for a specific locale
 *
 * @param locale - Language code (en, tr, etc.)
 * @param options - Query options
 * @param env - Environment variables (for Cloudflare Workers)
 */
export async function getPosts(
  locale: string,
  options: {
    limit?: number;
    page?: number;
    featured?: boolean;
  } = {},
  env?: { GHOST_CONTENT_API_KEY?: string },
): Promise<{
  posts: GhostPost[];
  pagination: GhostPostsResponse["meta"]["pagination"];
}> {
  const { limit = 10, page = 1, featured } = options;
  const apiKey = getApiKey(env);

  const url = new URL(`${GHOST_URL}/ghost/api/content/posts/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", String(page));
  url.searchParams.set("include", "tags,authors");

  // Build filter: published posts with matching language tag
  const filters: string[] = [`tag:lang-${locale}`];
  if (featured !== undefined) {
    filters.push(`featured:${featured}`);
  }
  url.searchParams.set("filter", filters.join("+"));

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(`Ghost API error: ${res.status} ${res.statusText}`);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit,
        pages: 0,
        total: 0,
        next: null,
        prev: null,
      },
    };
  }

  const data: GhostPostsResponse = await res.json();
  return { posts: data.posts, pagination: data.meta.pagination };
}

/**
 * Fetch a single blog post by slug
 *
 * @param slug - Post slug
 * @param locale - Language code to verify post belongs to
 * @param env - Environment variables (for Cloudflare Workers)
 */
export async function getPost(
  slug: string,
  locale: string,
  env?: { GHOST_CONTENT_API_KEY?: string },
): Promise<GhostPost | null> {
  const apiKey = getApiKey(env);

  const url = new URL(`${GHOST_URL}/ghost/api/content/posts/slug/${slug}/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("include", "tags,authors");

  const res = await fetch(url.toString());

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    console.error(`Ghost API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const data: GhostPostResponse = await res.json();
  const post = data.posts?.[0];

  if (!post) {
    return null;
  }

  // Verify post belongs to requested locale
  const hasLocaleTag = post.tags?.some((t) => t.slug === `lang-${locale}`);
  if (!hasLocaleTag) {
    return null;
  }

  return post;
}

/**
 * Get featured posts for homepage
 */
export async function getFeaturedPosts(
  locale: string,
  limit = 3,
  env?: { GHOST_CONTENT_API_KEY?: string },
): Promise<GhostPost[]> {
  const { posts } = await getPosts(locale, { limit, featured: true }, env);
  return posts;
}

/**
 * Get posts by tag (excluding language tags)
 */
export async function getPostsByTag(
  tagSlug: string,
  locale: string,
  options: { limit?: number; page?: number } = {},
  env?: { GHOST_CONTENT_API_KEY?: string },
): Promise<{
  posts: GhostPost[];
  pagination: GhostPostsResponse["meta"]["pagination"];
}> {
  const { limit = 10, page = 1 } = options;
  const apiKey = getApiKey(env);

  const url = new URL(`${GHOST_URL}/ghost/api/content/posts/`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("page", String(page));
  url.searchParams.set("include", "tags,authors");
  url.searchParams.set("filter", `tag:${tagSlug}+tag:lang-${locale}`);

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(`Ghost API error: ${res.status} ${res.statusText}`);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit,
        pages: 0,
        total: 0,
        next: null,
        prev: null,
      },
    };
  }

  const data: GhostPostsResponse = await res.json();
  return { posts: data.posts, pagination: data.meta.pagination };
}

/**
 * Format date for display
 */
export function formatPostDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Filter out language tags from tag list for display
 */
export function getDisplayTags(tags: GhostTag[] | undefined): GhostTag[] {
  if (!tags) return [];
  return tags.filter((tag) => !tag.slug.startsWith("lang-"));
}
