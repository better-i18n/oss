/**
 * Build-time blog index generator.
 *
 * Emits one `public/blog-index-{locale}.json` file per locale so that:
 *   - Prerendered /blog/ HTML already contains the data (baked by loader).
 *   - Client-side SPA navigation hits a static JSON asset instead of the
 *     `_serverFn` endpoint (which was CPU-limited on CF Workers).
 *
 * Invariants (do not regress):
 *   1. **No runtime imports.** This file is loaded by vite.config.ts at
 *      config-time, before Vite injects `import.meta.env`. Do not import
 *      from `../lib/content` or any module that touches `import.meta.env`.
 *   2. **No `body` field.** Body markdown is huge (avg 10-50KB per post).
 *      Fetching it for 22 locales × thousands of posts blew the Node heap.
 *      We request only the list-UI shape and rely on the CMS `excerpt`.
 *   3. **Direct fetch with cache bypass.** The @better-i18n/sdk client
 *      does not expose a fetch override, and the content API's edge cache
 *      was serving stale snapshots — newly published posts took hours/days
 *      to appear. We call the REST endpoint ourselves with
 *      `Cache-Control: no-cache` so every build sees the authoritative
 *      entry list. The runtime UI path still goes through the SDK + CDN.
 *   4. **Bounded-concurrent, uncapped.** No POST_CAP: list UI shows every
 *      published post. A LOCALE_CONCURRENCY-sized worker pool keeps wall
 *      time reasonable; per-post size without `body` is small enough
 *      (~500B) that a full locale (thousands of posts) stays under a few
 *      MB in memory.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface BlogPostListItem {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string | null;
  readonly readTime: string | null;
  readonly featured: boolean;
  readonly bannerImage: string | null;
  readonly category: string | null;
  readonly authorName: string | null;
  readonly authorAvatar: string | null;
  readonly cover: { type: string; params: Record<string, unknown> } | null;
}

export interface BlogIndex {
  readonly allPosts: readonly BlogPostListItem[];
  readonly categories: readonly string[];
  readonly totalPages: number;
  readonly generatedAt: string;
}

const POSTS_PER_PAGE = 12;
const PAGE_SIZE = 100;
const LOCALE_CONCURRENCY = 6;
const API_BASE = "https://content.better-i18n.com/v1/content";

type RelationValue = { title?: string; [key: string]: string | null | undefined };
type RawEntry = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt: string | null;
  read_time?: string | null;
  featured?: string | boolean | null;
  banner_image?: string | null;
  relations?: Record<string, RelationValue | null | undefined>;
  availableLanguages?: unknown;
  langs?: unknown;
  [key: string]: unknown;
};

interface ListResponse {
  readonly items: readonly RawEntry[];
  readonly hasMore: boolean;
  readonly total?: number;
}

// ─── Which locales really have a translation ─────────────────────────

const SOURCE_LOCALE = "en";
const TRANSLATION_LOOKUP_CONCURRENCY = 8;

/** slug → locale codes the CMS has a real translation for. */
export type BlogTranslations = ReadonlyMap<string, ReadonlySet<string>>;

/** Language codes from `availableLanguages` / `langs`, both shapes. */
export function languageCodes(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((v) => {
    if (typeof v === "string") return [v];
    if (v !== null && typeof v === "object") {
      const code = (v as Record<string, unknown>).code;
      return typeof code === "string" ? [code] : [];
    }
    return [];
  });
}

/**
 * Does `slug` really exist in `locale`, or would the API serve the English
 * source under that locale's URL?
 *
 * This used to read `langs` from the list response and return `true` when the
 * field was missing. The list endpoint stopped returning `langs` (checked
 * 2026-11-14: 256/256 posts without it, in every locale), so every locale index
 * held every post, and the sitemap advertised ~1,474 English copies under
 * /nl/, /it/, /zh-hans/… (SEO audit 2026-11-13, fix F3).
 *
 * Now it fails CLOSED: the source locale always counts, any other locale counts
 * only if the single-entry lookup said so. An unknown post is English-only.
 * A missing translation costs one locale URL; a wrong "yes" costs a duplicate
 * page in Google.
 */
export function isRealTranslation(
  translations: BlogTranslations,
  slug: string,
  locale: string,
): boolean {
  if (locale === SOURCE_LOCALE) return true;
  return translations.get(slug)?.has(locale) ?? false;
}

/**
 * One single-entry request per post: that endpoint does return
 * `availableLanguages`, and it matches the CMS (e.g. `online-translation-tools-
 * developers` → de, fr, tr, en, es, pt, with a real German title under `de`).
 * Same approach as the changelog entries in `generate-pages.ts`. ~256 small
 * requests once per build, bounded concurrency.
 */
export async function fetchBlogTranslations(
  project: string,
  apiKey: string,
  slugs: readonly string[],
): Promise<{ translations: BlogTranslations; failures: number }> {
  const translations = new Map<string, ReadonlySet<string>>();
  let failures = 0;
  const queue = [...slugs];

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const slug = queue.shift();
      if (!slug) return;
      const url = `${API_BASE}/${project}/models/blog-posts/entries/${encodeURIComponent(slug)}?language=${SOURCE_LOCALE}`;
      try {
        const res = await fetch(url, {
          headers: { "x-api-key": apiKey, "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const entry = (await res.json()) as RawEntry;
        translations.set(slug, new Set(languageCodes(entry.availableLanguages ?? entry.langs)));
      } catch {
        failures++; // left out of the map → English-only, see isRealTranslation
      }
    }
  }

  await Promise.all(Array.from({ length: TRANSLATION_LOOKUP_CONCURRENCY }, () => worker()));
  return { translations, failures };
}

function parseCover(raw: unknown): { type: string; params: Record<string, unknown> } | null {
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as { type?: unknown; params?: unknown };
    return typeof parsed.type === "string" ? { type: parsed.type, params: (parsed.params ?? {}) as Record<string, unknown> } : null;
  } catch { return null; }
}

function mapEntry(entry: RawEntry): BlogPostListItem {
  return {
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt ?? "",
    publishedAt: entry.publishedAt,
    readTime: entry.read_time ?? null,
    featured: entry.featured === "true" || entry.featured === true,
    bannerImage: entry.banner_image ?? null,
    category: entry.relations?.category?.name ?? null,
    authorName: entry.relations?.author?.title ?? null,
    authorAvatar: entry.relations?.author?.avatar ?? null,
    cover: parseCover(entry.cover),
  };
}

async function fetchPage(
  project: string,
  apiKey: string,
  locale: string,
  page: number,
): Promise<ListResponse> {
  const params = new URLSearchParams({
    language: locale,
    status: "published",
    sort: "publishedAt",
    order: "desc",
    limit: String(PAGE_SIZE),
    page: String(page),
    expand: "author,category",
    fields: "slug,title,excerpt,publishedAt,read_time,featured,banner_image,cover,langs",
  });
  const url = `${API_BASE}/${project}/models/blog-posts/entries?${params}`;
  const res = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} fetching ${locale} page ${page}`);
  }
  return (await res.json()) as ListResponse;
}

// Defensive pagination: Content API has returned hasMore=true forever on
// certain filter combos (repeating page-1 content) which OOM'd builds. Three
// guards: slug-based dedup, API `total` ceiling, and a hard page cap.
const LOCALE_HARD_PAGE_CAP = 100; // 100 × 100 = 10k posts per locale max

async function fetchPostsForLocale(
  project: string,
  apiKey: string,
  locale: string,
  keep: (slug: string) => boolean = () => true,
): Promise<BlogPostListItem[]> {
  const collected: BlogPostListItem[] = [];
  const seen = new Set<string>();
  let page = 1;
  let apiTotal: number | undefined;

  while (page <= LOCALE_HARD_PAGE_CAP) {
    const result = await fetchPage(project, apiKey, locale, page);
    if (typeof result.total === "number") apiTotal = result.total;

    let addedThisPage = 0;
    for (const raw of result.items) {
      if (seen.has(raw.slug)) continue;
      seen.add(raw.slug);
      // Counted as "new" even when filtered out, so a page of untranslated
      // posts does not look like the stuck-pagination case below.
      addedThisPage++;
      if (!keep(raw.slug)) continue;
      collected.push(mapEntry(raw));
    }

    if (!result.hasMore) break;
    if (addedThisPage === 0) break;
    if (apiTotal !== undefined && seen.size >= apiTotal) break;

    page++;
  }

  if (page > LOCALE_HARD_PAGE_CAP) {
    console.warn(
      `[SEO] fetchPostsForLocale(${locale}) hit hard cap. ` +
        `Collected ${collected.length} unique posts (API total: ${apiTotal ?? "unknown"}).`,
    );
  }

  return collected;
}

/**
 * Fetch blog posts for each locale with bounded concurrency, writing
 * each as a static JSON file into `public/`. Failures for one locale
 * emit an empty index so the build never breaks on a single API hiccup
 * — the empty-state UI handles zero posts gracefully.
 */
export async function generateBlogIndexes(
  locales: readonly string[],
  publicDir: string,
  options: { readonly project: string; readonly apiKey: string },
): Promise<void> {
  await mkdir(publicDir, { recursive: true });

  const { project, apiKey } = options;
  const ok: Array<{ locale: string; count: number }> = [];
  const failed: Array<{ locale: string; error: string }> = [];

  /* The source-locale list is the slug list for the translation lookup, so
     it is fetched first; the other locales are then filtered against it. */
  let sourcePosts: BlogPostListItem[] | null = null;
  try {
    sourcePosts = await fetchPostsForLocale(project, apiKey, SOURCE_LOCALE);
  } catch (error) {
    failed.push({ locale: SOURCE_LOCALE, error: String(error) });
  }
  const { translations, failures } = sourcePosts
    ? await fetchBlogTranslations(project, apiKey, sourcePosts.map((p) => p.slug))
    : { translations: new Map() as BlogTranslations, failures: 0 };
  if (failures > 0) {
    console.warn(
      `[SEO] Blog translations: ${failures}/${sourcePosts?.length ?? 0} lookups failed; those posts are listed in ${SOURCE_LOCALE} only`,
    );
  }

  const queue = locales.filter((l) => l !== SOURCE_LOCALE || !sourcePosts);

  async function writeIndex(locale: string, allPosts: readonly BlogPostListItem[]): Promise<void> {
    const categories = [
      ...new Set(allPosts.flatMap((p) => (p.category ? [p.category] : []))),
    ].sort();
    const index: BlogIndex = {
      allPosts,
      categories,
      totalPages: Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE)),
      generatedAt: new Date().toISOString(),
    };
    await writeFile(join(publicDir, `blog-index-${locale}.json`), JSON.stringify(index), "utf-8");
    ok.push({ locale, count: allPosts.length });
  }

  if (sourcePosts && locales.includes(SOURCE_LOCALE)) {
    await writeIndex(SOURCE_LOCALE, sourcePosts);
  }

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const locale = queue.shift();
      if (!locale) return;
      const filePath = join(publicDir, `blog-index-${locale}.json`);
      try {
        const allPosts = await fetchPostsForLocale(project, apiKey, locale, (slug) =>
          isRealTranslation(translations, slug, locale),
        );
        await writeIndex(locale, allPosts);
      } catch (error) {
        failed.push({ locale, error: String(error) });
        const fallback: BlogIndex = {
          allPosts: [],
          categories: [],
          totalPages: 1,
          generatedAt: new Date().toISOString(),
        };
        await writeFile(filePath, JSON.stringify(fallback), "utf-8");
      }
    }
  }

  await Promise.all(
    Array.from({ length: LOCALE_CONCURRENCY }, () => worker()),
  );

  console.log(
    `[SEO] Blog indexes: ${ok.length} generated (${ok
      .map((r) => `${r.locale}:${r.count}`)
      .join(", ")})${failed.length ? `, ${failed.length} failed: ${failed.map((f) => f.locale).join(", ")}` : ""}`,
  );
}
