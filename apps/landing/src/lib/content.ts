/**
 * Better i18n Content SDK Client
 *
 * Fetches blog posts from Better i18n Content API.
 */

import { createClient, extractLanguageCodes, hasLanguage, type ContentClient } from "@better-i18n/sdk";
import { marked } from "marked";

// ─── Types ───────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  title: string;
  body: string | null;
  bodyHtml: string | null;
  excerpt: string;
  readTime: string | null;
  featured: boolean;
  /** CMS banner image URL — used for OG meta, blog list thumbnails, and article hero */
  bannerImage: string | null;
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
  /** CMS banner image URL — used for blog list thumbnails, falls back to OG service */
  bannerImage: string | null;
  category: string | null;
  authorName: string | null;
  authorAvatar: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────

/** Posts per page for blog listing pagination. Shared with sitemap generation. */
export const POSTS_PER_PAGE = 24;

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

// ─── Server-side TTL Cache ──────────────────────────────────────────

/** Simple in-memory TTL cache for Content API responses on CF Workers. */
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
    bannerImage: (entry.banner_image as string | null) ?? null,
    category: entry.relations?.category?.name ?? null,
    authorName: entry.relations?.author?.title ?? null,
    authorAvatar: entry.relations?.author?.avatar ?? null,
  };
}

// ─── Public API ──────────────────────────────────────────────────────

const BLOG_MODEL = "blog-posts";

/** Check whether a list entry has a translation in the given locale. */
function hasTranslation(
  item: { [key: string]: unknown },
  locale: string,
): boolean {
  return hasLanguage(item as Record<string, unknown>, locale);
}

/**
 * Fetch ALL published blog posts for a locale, filtered to only those
 * with an actual translation. Results are cached for 5 minutes.
 *
 * The Content API falls back to the source language when a translation
 * is missing instead of excluding the entry, so we must fetch everything,
 * filter client-side, and handle pagination ourselves.
 */
export async function getAllBlogPostsForLocale(
  locale: string,
): Promise<BlogPostListItem[]> {
  const cacheKey = `blog-posts-all:${locale}`;
  const cached = getCached<BlogPostListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const PAGE_SIZE = 100;
    let page = 1;
    let allItems: Array<Record<string, unknown>> = [];
    let hasMore = true;

    while (hasMore) {
      const result = await getContentClient().getEntries(BLOG_MODEL, {
        language: locale,
        status: "published",
        sort: "publishedAt",
        order: "desc",
        limit: PAGE_SIZE,
        page,
        expand: ["author", "category"],
      });
      allItems = [...allItems, ...result.items];
      hasMore = result.hasMore;
      page++;
    }

    const posts = allItems
      .filter((item) => hasTranslation(item, locale))
      .map((item) => ({
        slug: item.slug as string,
        title: item.title as string,
        excerpt: extractExcerpt((item.body as string | null) ?? null),
        publishedAt: item.publishedAt as string | null,
        ...mapEntryBase(
          item as {
            relations?: Record<string, RelationValue | null | undefined>;
            [key: string]: unknown;
          },
        ),
      }));

    return setCache(cacheKey, posts);
  } catch (error) {
    console.error("Content API error:", error);
    return [];
  }
}

/** Fetch blog posts for a specific locale with client-side pagination. */
export async function getBlogPosts(
  locale: string,
  options: { limit?: number; page?: number } = {},
): Promise<{
  posts: BlogPostListItem[];
  total: number;
  hasMore: boolean;
}> {
  const { limit = 12, page = 1 } = options;
  const allPosts = await getAllBlogPostsForLocale(locale);
  const start = (page - 1) * limit;
  const pagePosts = allPosts.slice(start, start + limit);

  return {
    posts: pagePosts,
    total: allPosts.length,
    hasMore: start + limit < allPosts.length,
  };
}

/** Fetch related posts, prioritizing same category. */
export async function getRelatedPosts(
  currentSlug: string,
  category: string | null,
  locale: string,
  limit: number = 3,
): Promise<BlogPostListItem[]> {
  try {
    const { posts } = await getBlogPosts(locale, { limit: 30 });
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

/** Fetch blog posts matching any of the given keywords (case-insensitive title/excerpt match). */
export async function getPostsByKeywords(
  locale: string,
  keywords: readonly string[],
  limit: number = 3,
): Promise<BlogPostListItem[]> {
  try {
    const { posts } = await getBlogPosts(locale, { limit: 30 });
    const lowerKeywords = keywords.map((k) => k.toLowerCase());

    const scored = posts
      .map((post) => {
        const text = `${post.title} ${post.excerpt}`.toLowerCase();
        const matches = lowerKeywords.filter((kw) => text.includes(kw)).length;
        return { post, matches };
      })
      .filter((entry) => entry.matches > 0)
      .sort((a, b) => b.matches - a.matches);

    return scored.slice(0, limit).map((entry) => entry.post);
  } catch {
    return [];
  }
}

/** Fetch a single blog post by slug. */
export async function getBlogPost(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  const cacheKey = `blog-post:${locale}:${slug}`;
  const cached = getCached<BlogPost | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const entry = await getContentClient().getEntry(BLOG_MODEL, slug, {
      language: locale,
      expand: ["author", "category"],
    });
    const bodyHtml = entry.body ? String(await marked(entry.body)) : null;
    const excerpt = extractExcerpt(entry.body);
    const raw = entry as unknown as Record<string, unknown>;
    const rawLangs = raw.availableLanguages ?? raw.langs;
    const codes = extractLanguageCodes(rawLangs as unknown[] | null);
    const availableLanguages = codes.length > 0 ? codes : null;
    const post: BlogPost = {
      id: entry.id,
      slug: entry.slug,
      status: entry.status,
      publishedAt: entry.publishedAt,
      createdAt: (raw.c_at as string | null) ?? (raw.createdAt as string | null) ?? null,
      updatedAt: (raw.u_at as string | null) ?? (raw.updatedAt as string | null) ?? null,
      title: entry.title,
      body: entry.body,
      bodyHtml,
      excerpt,
      availableLanguages,
      ...mapEntryBase(entry),
    };
    return setCache(cacheKey, post);
  } catch {
    return null;
  }
}

// ─── Pricing Plans ───────────────────────────────────────────────────

export interface PricingPlanLimit {
  key: string;
  value: string;
}

export interface PricingPlanFeature {
  key: string;
  included: boolean;
}

export interface PricingPlan {
  planId: "free" | "pro" | "enterprise";
  name: string;
  description: string;
  monthlyPrices: Record<string, number> | null;
  yearlyPrices: Record<string, number> | null;
  currencySymbols: Record<string, string>;
  /** Locale-aware currency code from CMS (e.g. "usd" for en, "try" for tr) */
  currencyCode: string;
  trialDays: number | null;
  ctaLabel: string;
  ctaHref: string;
  popular: boolean;
  sortOrder: number;
  limits: PricingPlanLimit[];
  features: PricingPlanFeature[];
  stripeMonthlyPriceId: string | null;
  stripeYearlyPriceId: string | null;
}

const PRICING_MODEL = "pricing-plans";

function parsePricingEntry(item: Record<string, unknown>): PricingPlan {
  const parseJson = <T>(val: unknown, fallback: T): T => {
    if (!val || val === "") return fallback;
    try {
      return JSON.parse(val as string) as T;
    } catch {
      return fallback;
    }
  };

  return {
    planId: item.plan_id as PricingPlan["planId"],
    name: (item.name as string) || (item.title as string) || "",
    description: (item.description as string) || "",
    monthlyPrices: parseJson<Record<string, number> | null>(item.monthly_prices, null),
    yearlyPrices: parseJson<Record<string, number> | null>(item.yearly_prices, null),
    currencySymbols: parseJson<Record<string, string>>(
      item.currency_symbols,
      { usd: "$", try: "₺", eur: "€" },
    ),
    currencyCode: typeof item.currency_code === "string" && item.currency_code
      ? item.currency_code
      : "usd",
    trialDays: item.trial_days ? Number(item.trial_days) : null,
    ctaLabel: (item.cta_label as string) || "",
    ctaHref: import.meta.env.DEV
      ? ((item.cta_href as string) || "").replace(/https?:\/\/dash\.better-i18n\.com/, "http://localhost:5173")
      : (item.cta_href as string) || "",
    popular: item.popular === "true" || item.popular === true,
    sortOrder: item.sort_order ? Number(item.sort_order) : 0,
    limits: parseJson<PricingPlanLimit[]>(item.limits, []),
    features: parseJson<PricingPlanFeature[]>(item.features, []),
    stripeMonthlyPriceId: (item.stripe_monthly_price_id as string) || null,
    stripeYearlyPriceId: (item.stripe_yearly_price_id as string) || null,
  };
}

/** Fetch all published pricing plans for a locale, sorted by sort_order. */
export async function getPricingPlans(locale: string): Promise<PricingPlan[]> {
  const cacheKey = `pricing-plans:${locale}`;
  const cached = getCached<PricingPlan[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await getContentClient().getEntries(PRICING_MODEL, {
      language: locale,
      status: "published",
      limit: 10,
    });

    const plans = result.items
      .map((item) => parsePricingEntry(item as unknown as Record<string, unknown>))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return setCache(cacheKey, plans);
  } catch (error) {
    console.error("Pricing plans API error:", error);
    return [];
  }
}

/**
 * Get the display price for a plan using its locale-aware currency code.
 *
 * The plan's `currencyCode` field is already localized by the CMS
 * (e.g. "usd" for en, "try" for tr), so no locale mapping needed.
 *
 * Returns { symbol, amount, currency } or null for enterprise/custom plans.
 */
export function getDisplayPrice(
  plan: PricingPlan,
  billingPeriod: "monthly" | "yearly",
): { symbol: string; amount: number; currency: string } | null {
  const prices = billingPeriod === "monthly" ? plan.monthlyPrices : plan.yearlyPrices;
  if (!prices) return null;

  const currency = plan.currencyCode;
  const amount = prices[currency] ?? prices.usd;
  if (amount === undefined) return null;

  const symbol = plan.currencySymbols[currency] ?? plan.currencySymbols.usd ?? "$";
  return { symbol, amount, currency };
}

// ─── Integrations ────────────────────────────────────────────────────

export type IntegrationCategory =
  | "featured"
  | "frameworks"
  | "developerTools"
  | "delivery"
  | "aiAutomation";

export type IntegrationStatus = "available" | "builtIn" | "popular" | "guide";

export interface IntegrationCmsItem {
  slug: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  summary: string;
  detail: string | null;
  badgeLabel: string | null;
  /** URL from Better i18n Content media field — takes priority over logDomain */
  logoUrl: string | null;
  /** Brandfetch domain fallback (only used when logoUrl is null) */
  logDomain: string | null;
  markLabel: string | null;
  guideHref: string | null;
  iconType: "sprite" | "component";
  iconName: string;
  sortOrder: number;
}

const INTEGRATIONS_MODEL = "integrations";

function parseIntegrationEntry(item: Record<string, unknown>): IntegrationCmsItem {
  return {
    slug: item.slug as string,
    name: (item.title as string) || "",
    category: (item.category as IntegrationCategory) || "featured",
    status: (item.status as IntegrationStatus) || "available",
    summary: (item.summary as string) || "",
    detail: (item.detail as string | null) ?? null,
    badgeLabel: (item.badge_label as string | null) ?? null,
    logoUrl: (item.logo as string | null) ?? null,
    logDomain: (item.log_domain as string | null) ?? null,
    markLabel: (item.mark_label as string | null) ?? null,
    guideHref: (item.guide_href as string | null) ?? null,
    iconType: ((item.icon_type as string) === "component" ? "component" : "sprite") as "sprite" | "component",
    iconName: (item.icon_name as string) || "",
    sortOrder: item.sort_order ? Number(item.sort_order) : 0,
  };
}

/** Fetch all published integrations for a locale, sorted by sort_order. */
export async function getIntegrations(locale: string): Promise<IntegrationCmsItem[]> {
  const cacheKey = `integrations:${locale}`;
  const cached = getCached<IntegrationCmsItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await getContentClient()
      .from(INTEGRATIONS_MODEL)
      .language(locale)
      .eq("status", "published")
      .limit(50);

    if (error || !data) {
      console.error("Integrations API error:", error);
      return [];
    }

    const items = data
      .map((item) => parseIntegrationEntry(item as unknown as Record<string, unknown>))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return setCache(cacheKey, items);
  } catch (error) {
    console.error("Integrations API error:", error);
    return [];
  }
}

/** Fetch a single integration by slug. Uses the all-integrations cache when warm. */
export async function getIntegration(
  locale: string,
  slug: string,
): Promise<IntegrationCmsItem | null> {
  // Use warm all-integrations cache if available
  const allCached = getCached<IntegrationCmsItem[]>(`integrations:${locale}`);
  if (allCached) {
    return allCached.find((i) => i.slug === slug) ?? null;
  }

  const cacheKey = `integration:${locale}:${slug}`;
  const cached = getCached<IntegrationCmsItem | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const { data, error } = await getContentClient()
      .from(INTEGRATIONS_MODEL)
      .language(locale)
      .single<Record<string, string | null>>(slug);

    if (error || !data) return setCache(cacheKey, null);

    const item = parseIntegrationEntry(data as unknown as Record<string, unknown>);
    return setCache(cacheKey, item);
  } catch {
    return setCache(cacheKey, null);
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
  availableLanguages: readonly string[] | null;
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
  const cacheKey = `marketing-pages:${locale}:${pageType || "all"}`;
  const cached = getCached<MarketingPageListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await getContentClient().getEntries(MARKETING_MODEL, {
      language: locale,
      status: "published",
      limit: 50,
      expand: ["author"],
    });

    const pages = result.items
      .filter((item) => !pageType || item.page_type === pageType)
      .map((item) => ({
        slug: item.slug,
        title: item.title,
        excerpt: extractExcerpt((item.body as string | null) ?? null),
        pageType: (item.page_type as "feature" | "persona") || "feature",
        heroSubtitle: (item.hero_subtitle as string | null) ?? null,
      }));

    return setCache(cacheKey, pages);
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
  const cacheKey = `marketing-page:${locale}:${slug}`;
  const cached = getCached<MarketingPage | null>(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const entry = await getContentClient().getEntry(MARKETING_MODEL, slug, {
      language: locale,
      expand: ["author"],
    });
    const bodyHtml = entry.body ? String(await marked(entry.body)) : null;
    const excerpt = extractExcerpt(entry.body);
    const raw = entry as unknown as Record<string, unknown>;
    const rawLangs = raw.availableLanguages ?? raw.langs;
    const codes = extractLanguageCodes(rawLangs as unknown[] | null);
    const availableLanguages = codes.length > 0 ? codes : null;
    const page: MarketingPage = {
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
      availableLanguages,
    };
    return setCache(cacheKey, page);
  } catch {
    return null;
  }
}
