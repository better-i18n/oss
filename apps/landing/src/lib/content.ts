/**
 * Better i18n Content SDK Client
 *
 * Fetches blog posts from Better i18n Content API.
 */

import { createClient, type ContentClient } from "@better-i18n/sdk";
import { marked } from "marked";

// ─── Types ───────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  title: string;
  body: string | null;
  bodyHtml: string | null;
  readTime: string | null;
  featured: boolean;
  category: string | null;
  authorName: string | null;
  authorAvatar: string | null;
}

export interface BlogPostListItem {
  slug: string;
  title: string;
  publishedAt: string | null;
  readTime: string | null;
  featured: boolean;
  category: string | null;
  authorName: string | null;
  authorAvatar: string | null;
}

// ─── Client (singleton) ─────────────────────────────────────────────

let _client: ContentClient | null = null;

export function getContentClient(): ContentClient {
  if (!_client) {
    const apiKey = import.meta.env.BETTER_I18N_CONTENT_API_KEY;
    const project = import.meta.env.BETTER_I18N_PROJECT;

    if (!apiKey)
      throw new Error("BETTER_I18N_CONTENT_API_KEY is not configured");
    if (!project) throw new Error("BETTER_I18N_PROJECT is not configured");

    _client = createClient({ project, apiKey, debug: true });
  }
  return _client;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Map category name to badge color class. */
export function getTagColor(tag: string): string {
  const colors: Record<string, string> = {
    news: "bg-emerald-500/10 text-emerald-700",
    feature: "bg-violet-500/10 text-violet-700",
    tutorial: "bg-blue-500/10 text-blue-700",
    update: "bg-amber-500/10 text-amber-700",
    announcement: "bg-rose-500/10 text-rose-700",
    guide: "bg-cyan-500/10 text-cyan-700",
  };
  return colors[tag.toLowerCase()] || "bg-mist-500/10 text-mist-700";
}

/** Format date for display. */
export function formatPostDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type RelationValue = {
  title?: string;
  [key: string]: string | null | undefined;
};

function mapEntryBase(entry: {
  relations?: Record<string, RelationValue | null | undefined>;
  [key: string]: unknown;
}) {
  return {
    readTime: (entry.read_time as string | null) ?? null,
    featured: entry.featured === "true",
    category: entry.relations?.category?.name ?? null,
    authorName: entry.relations?.author?.title ?? null,
    authorAvatar: entry.relations?.author?.avatar ?? null,
  };
}

// ─── Public API ──────────────────────────────────────────────────────

const BLOG_MODEL = "blog-posts";

/** Fetch blog posts for a specific locale. */
export async function getBlogPosts(
  locale: string,
  options: { limit?: number; page?: number } = {},
): Promise<{
  posts: BlogPostListItem[];
  total: number;
  hasMore: boolean;
}> {
  const { limit = 12, page = 1 } = options;

  try {
    const result = await getContentClient().getEntries(BLOG_MODEL, {
      language: locale,
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit,
      page,
      expand: ["author", "category"],
    });

    return {
      posts: result.items.map((item) => ({
        slug: item.slug,
        title: item.title,
        publishedAt: item.publishedAt,
        ...mapEntryBase(item),
      })),
      total: result.total,
      hasMore: result.hasMore,
    };
  } catch (error) {
    console.error("Content API error:", error);
    return { posts: [], total: 0, hasMore: false };
  }
}

/** Fetch a single blog post by slug. */
export async function getBlogPost(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  try {
    const entry = await getContentClient().getEntry(BLOG_MODEL, slug, {
      language: locale,
      expand: ["author", "category"],
    });
    const bodyHtml = entry.body ? String(await marked(entry.body)) : null;
    return {
      id: entry.id,
      slug: entry.slug,
      status: entry.status,
      publishedAt: entry.publishedAt,
      title: entry.title,
      body: entry.body,
      bodyHtml,
      ...mapEntryBase(entry),
    };
  } catch {
    return null;
  }
}
