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
  excerpt: string;
  readTime: string | null;
  featured: boolean;
  category: string | null;
  authorName: string | null;
  authorAvatar: string | null;
  availableLanguages: readonly string[] | null;
}

export interface BlogPostListItem {
  slug: string;
  title: string;
  excerpt: string;
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

const EXCERPT_MAX_LENGTH = 155;

/**
 * Extract a plain-text excerpt from markdown content.
 * Strips markdown formatting, truncates at a word boundary (~155 chars),
 * and appends an ellipsis when truncated.
 */
export function extractExcerpt(markdownBody: string | null): string {
  if (!markdownBody) return "";

  const plainText = markdownBody
    // Remove images: ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Convert links to just their text: [text](url) → text
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, "$1")
    // Remove inline code
    .replace(/`([^`]*)`/g, "$1")
    // Remove code blocks (fenced)
    .replace(/```[\s\S]*?```/g, "")
    // Remove blockquote markers
    .replace(/^>\s+/gm, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove list markers (unordered and ordered)
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Collapse whitespace (newlines, tabs, multiple spaces)
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= EXCERPT_MAX_LENGTH) return plainText;

  // Truncate at last word boundary within limit
  const truncated = plainText.slice(0, EXCERPT_MAX_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  const boundary = lastSpace > 0 ? lastSpace : EXCERPT_MAX_LENGTH;

  return `${truncated.slice(0, boundary)}...`;
}

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
        excerpt: extractExcerpt((item.body as string | null) ?? null),
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

/** Fetch related posts, prioritizing same category. */
export async function getRelatedPosts(
  currentSlug: string,
  category: string | null,
  locale: string,
  limit: number = 3,
): Promise<BlogPostListItem[]> {
  try {
    const { posts } = await getBlogPosts(locale, { limit: limit + 1 });
    // Filter out current post
    const filtered = posts.filter((p) => p.slug !== currentSlug);

    if (category) {
      // Prioritize same category
      const sameCategory = filtered.filter((p) => p.category === category);
      const others = filtered.filter((p) => p.category !== category);
      return [...sameCategory, ...others].slice(0, limit);
    }

    return filtered.slice(0, limit);
  } catch {
    return [];
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
    const excerpt = extractExcerpt(entry.body);
    const raw = entry as unknown as Record<string, unknown>;
    const availableLanguages = Array.isArray(raw.availableLanguages)
      ? (raw.availableLanguages as unknown[]).filter(
          (v): v is string => typeof v === "string",
        )
      : null;
    return {
      id: entry.id,
      slug: entry.slug,
      status: entry.status,
      publishedAt: entry.publishedAt,
      title: entry.title,
      body: entry.body,
      bodyHtml,
      excerpt,
      availableLanguages,
      ...mapEntryBase(entry),
    };
  } catch {
    return null;
  }
}

// ─── Marketing Pages ────────────────────────────────────────────────

export interface MarketingPage {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  bodyHtml: string | null;
  excerpt: string;
  pageType: "feature" | "persona";
  heroSubtitle: string | null;
  targetKeywords: string | null;
  authorName: string | null;
  authorAvatar: string | null;
}

export interface MarketingPageListItem {
  slug: string;
  title: string;
  excerpt: string;
  pageType: "feature" | "persona";
  heroSubtitle: string | null;
}

const MARKETING_MODEL = "marketing-pages";

/** Fetch marketing pages, optionally filtered by type. */
export async function getMarketingPages(
  locale: string,
  pageType?: "feature" | "persona",
): Promise<MarketingPageListItem[]> {
  try {
    const result = await getContentClient().getEntries(MARKETING_MODEL, {
      language: locale,
      status: "published",
      limit: 50,
      expand: ["author"],
    });

    return result.items
      .filter((item) => !pageType || item.page_type === pageType)
      .map((item) => ({
        slug: item.slug,
        title: item.title,
        excerpt: extractExcerpt((item.body as string | null) ?? null),
        pageType: (item.page_type as "feature" | "persona") || "feature",
        heroSubtitle: (item.hero_subtitle as string | null) ?? null,
      }));
  } catch (error) {
    console.error("Marketing pages API error:", error);
    return [];
  }
}

/** Fetch a single marketing page by slug. */
export async function getMarketingPage(
  slug: string,
  locale: string,
): Promise<MarketingPage | null> {
  try {
    const entry = await getContentClient().getEntry(MARKETING_MODEL, slug, {
      language: locale,
      expand: ["author"],
    });
    const bodyHtml = entry.body ? String(await marked(entry.body)) : null;
    const excerpt = extractExcerpt(entry.body);
    return {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      body: entry.body,
      bodyHtml,
      excerpt,
      pageType: (entry.page_type as "feature" | "persona") || "feature",
      heroSubtitle: (entry.hero_subtitle as string | null) ?? null,
      targetKeywords: (entry.target_keywords as string | null) ?? null,
      authorName: entry.relations?.author?.title ?? null,
      authorAvatar: entry.relations?.author?.avatar ?? null,
    };
  } catch {
    return null;
  }
}
