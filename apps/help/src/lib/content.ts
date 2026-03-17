/**
 * Help Center Content SDK Client
 *
 * Fetches collections, articles, and FAQs from Better i18n Content API.
 */

import { createClient, type ContentClient } from "@better-i18n/sdk";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
);

// ─── Types ───────────────────────────────────────────────────────────

export interface HelpCollection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  audience: "developers" | "managers" | "all" | null;
  parentSlug: string | null;
  articleCount: number;
}

export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  bodyHtml: string | null;
  excerpt: string | null;
  collectionSlug: string | null;
  order: number;
  readingTime: number | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  audience: "developers" | "managers" | "all" | null;
  tags: string | null;
  isFeatured: boolean;
  videoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  featuredImage: string | null;
  lastReviewedAt: string | null;
  availableLanguages: readonly string[] | null;
}

export interface HelpArticleListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  collectionSlug: string | null;
  order: number;
  readingTime: number | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  isFeatured: boolean;
}

export interface HelpFaq {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  bodyHtml: string | null;
  collectionSlug: string | null;
  order: number;
}

// ─── Client (singleton) ─────────────────────────────────────────────

let _client: ContentClient | null = null;

function getContentClient(): ContentClient {
  if (!_client) {
    const apiKey = import.meta.env.BETTER_I18N_CONTENT_API_KEY;
    const project = import.meta.env.BETTER_I18N_PROJECT;

    if (!apiKey)
      throw new Error("BETTER_I18N_CONTENT_API_KEY is not configured");
    if (!project) throw new Error("BETTER_I18N_PROJECT is not configured");

    _client = createClient({ project, apiKey });
  }
  return _client;
}

// ─── Server-side TTL Cache ──────────────────────────────────────────

const contentCache = new Map<string, { data: unknown; expiresAt: number }>();
const CONTENT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | undefined {
  const entry = contentCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    contentCache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): T {
  contentCache.set(key, { data, expiresAt: Date.now() + CONTENT_CACHE_TTL_MS });
  return data;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Check whether an entry has a translation in the given locale. */
function hasTranslation(
  item: Record<string, unknown>,
  locale: string,
): boolean {
  const langs = item.availableLanguages ?? item.langs;
  if (!Array.isArray(langs)) return true;
  return (langs as string[]).includes(locale);
}

type RelationValue = {
  title?: string;
  slug?: string;
  [key: string]: string | null | undefined;
};

// ─── Collections ────────────────────────────────────────────────────

const COLLECTION_MODEL = "help-collection";

export async function getCollections(
  locale: string,
): Promise<HelpCollection[]> {
  const cacheKey = `help-collections:${locale}`;
  const cached = getCached<HelpCollection[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await getContentClient().getEntries(COLLECTION_MODEL, {
      language: locale,
      status: "published",
      limit: 50,
      sort: "createdAt",
      order: "asc",
      expand: ["parent"],
    });

    const collections: HelpCollection[] = result.items
      .filter((item) => hasTranslation(item, locale))
      .map((item) => {
        const raw = item as unknown as Record<string, unknown>;
        const relations = raw.relations as Record<string, RelationValue | null | undefined> | undefined;
        return {
          id: item.slug, // list items use slug as identifier
          slug: item.slug,
          title: item.title,
          description: (raw.description as string | null) ?? null,
          icon: (raw.icon as string | null) ?? null,
          color: (raw.color as string | null) ?? null,
          order: Number(raw.order) || 0,
          audience: (raw.audience as HelpCollection["audience"]) ?? null,
          parentSlug: relations?.parent?.slug ?? null,
          articleCount: 0, // Will be computed from articles
        };
      })
      .sort((a, b) => a.order - b.order);

    return setCache(cacheKey, collections);
  } catch (error) {
    console.error("Help collections API error:", error);
    return [];
  }
}

export async function getCollection(
  slug: string,
  locale: string,
): Promise<HelpCollection | null> {
  const collections = await getCollections(locale);
  return collections.find((c) => c.slug === slug) ?? null;
}

// ─── Articles ───────────────────────────────────────────────────────

const ARTICLE_MODEL = "help-article";

export async function getArticles(
  locale: string,
  collectionSlug?: string,
): Promise<HelpArticleListItem[]> {
  const cacheKey = `help-articles:${locale}:all`;
  let articles = getCached<HelpArticleListItem[]>(cacheKey);

  if (!articles) {
    try {
      const result = await getContentClient().getEntries(ARTICLE_MODEL, {
        language: locale,
        status: "published",
        limit: 100,
        sort: "createdAt",
        order: "asc",
        expand: ["collection"],
      });

      articles = result.items
        .filter((item) => hasTranslation(item, locale))
        .map((item) => {
          const raw = item as unknown as Record<string, unknown>;
          const relations = raw.relations as Record<string, RelationValue | null | undefined> | undefined;
          return {
            slug: item.slug,
            title: item.title,
            excerpt: (raw.excerpt as string | null) ?? null,
            collectionSlug: relations?.collection?.slug ?? null,
            order: Number(raw.order) || 0,
            readingTime: raw.reading_time ? Number(raw.reading_time) : null,
            difficulty: (raw.difficulty as HelpArticleListItem["difficulty"]) ?? null,
            isFeatured: String(raw.is_featured) === "true",
          };
        })
        .sort((a, b) => a.order - b.order);

      setCache(cacheKey, articles);
    } catch (error) {
      console.error("Help articles API error:", error);
      return [];
    }
  }

  if (collectionSlug) {
    return articles.filter((a) => a.collectionSlug === collectionSlug);
  }
  return articles;
}

export async function getArticle(
  slug: string,
  locale: string,
): Promise<HelpArticle | null> {
  const cacheKey = `help-article:${locale}:${slug}`;
  const cached = getCached<HelpArticle | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const entry = await getContentClient().getEntry(ARTICLE_MODEL, slug, {
      language: locale,
      expand: ["collection"],
    });

    const bodyHtml = entry.body ? String(await marked.parse(entry.body)) : null;
    const raw = entry as unknown as Record<string, unknown>;
    const rawLangs = raw.availableLanguages ?? raw.langs;
    const availableLanguages = Array.isArray(rawLangs)
      ? (rawLangs as unknown[]).filter((v): v is string => typeof v === "string")
      : null;

    const relations = entry.relations as Record<string, RelationValue | null | undefined> | undefined;

    const article: HelpArticle = {
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      body: entry.body,
      bodyHtml,
      excerpt: (raw.excerpt as string | null) ?? null,
      collectionSlug: relations?.collection?.slug ?? null,
      order: Number(raw.order) || 0,
      readingTime: raw.reading_time ? Number(raw.reading_time) : null,
      difficulty: (raw.difficulty as HelpArticle["difficulty"]) ?? null,
      audience: (raw.audience as HelpArticle["audience"]) ?? null,
      tags: (raw.tags as string | null) ?? null,
      isFeatured: raw.is_featured === "true" || raw.is_featured === true,
      videoUrl: (raw.video_url as string | null) ?? null,
      seoTitle: (raw.seo_title as string | null) ?? null,
      seoDescription: (raw.seo_description as string | null) ?? null,
      featuredImage: (raw.featured_image as string | null) ?? null,
      lastReviewedAt: (raw.last_reviewed_at as string | null) ?? null,
      availableLanguages,
    };

    return setCache(cacheKey, article);
  } catch {
    return null;
  }
}

export async function getFeaturedArticles(
  locale: string,
  limit: number = 5,
): Promise<HelpArticleListItem[]> {
  const articles = await getArticles(locale);
  return articles.filter((a) => a.isFeatured).slice(0, limit);
}

// ─── FAQ ────────────────────────────────────────────────────────────

const FAQ_MODEL = "help-faq";

export async function getFaqs(locale: string): Promise<HelpFaq[]> {
  const cacheKey = `help-faqs:${locale}`;
  const cached = getCached<HelpFaq[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await getContentClient().getEntries(FAQ_MODEL, {
      language: locale,
      status: "published",
      limit: 100,
      sort: "createdAt",
      order: "asc",
      expand: ["collection"],
    });

    const faqs: HelpFaq[] = (
      await Promise.all(
        result.items
          .filter((item) => hasTranslation(item, locale))
          .map(async (item) => {
            const raw = item as unknown as Record<string, unknown>;
            const relations = raw.relations as Record<string, RelationValue | null | undefined> | undefined;
            const body = (item.body as string | undefined) ?? null;
            return {
              id: item.slug,
              slug: item.slug,
              title: item.title,
              body,
              bodyHtml: body ? String(await marked.parse(body)) : null,
              collectionSlug: relations?.collection?.slug ?? null,
              order: Number(raw.order) || 0,
            };
          }),
      )
    ).sort((a, b) => a.order - b.order);

    return setCache(cacheKey, faqs);
  } catch (error) {
    console.error("Help FAQ API error:", error);
    return [];
  }
}

// ─── Collections with article counts ────────────────────────────────

export async function getCollectionsWithCounts(
  locale: string,
): Promise<HelpCollection[]> {
  const [collections, articles] = await Promise.all([
    getCollections(locale),
    getArticles(locale),
  ]);

  return collections.map((col) => ({
    ...col,
    articleCount: articles.filter((a) => a.collectionSlug === col.slug).length,
  }));
}
