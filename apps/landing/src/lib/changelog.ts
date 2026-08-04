/**
 * Better I18N Content SDK Client - Changelog
 *
 * Fetches changelog entries from Better I18N Content API.
 * Uses the new query builder API (client.from()) instead of deprecated getEntries/getEntry.
 */

import {
  createClient,
  type ContentClient,
  type ContentEntry,
  type ContentEntryListItem,
} from "@better-i18n/sdk";

// Re-export SDK types for consumers
export type { ContentEntry, ContentEntryListItem };

// ─── Types ───────────────────────────────────────────────────────────

export interface ChangelogCustomFields extends Record<string, string | null> {
  version: string | null;
  release_date: string | null;
  release_type: string | null;
  summary: string | null;
  title: string | null;
}

export type ChangelogEntry = ContentEntry<ChangelogCustomFields>;
export type ChangelogListItem = ContentEntryListItem<ChangelogCustomFields>;

// ─── Client (singleton) ─────────────────────────────────────────────

let _changelogClient: ContentClient | null = null;

export function getChangelogClient(): ContentClient {
  if (!_changelogClient) {
    const apiKey = import.meta.env.BETTER_I18N_CONTENT_API_KEY;
    const project = import.meta.env.BETTER_I18N_PROJECT;

    if (!apiKey) throw new Error("BETTER_I18N_CONTENT_API_KEY is not configured");
    if (!project) throw new Error("BETTER_I18N_PROJECT is not configured");

    const debug = import.meta.env.DEV === true;
    _changelogClient = createClient({ project, apiKey, debug });
  }
  return _changelogClient;
}

// ─── TTL Cache ──────────────────────────────────────────────────────

const changelogCache = new Map<string, { data: unknown; expiresAt: number }>();
const CHANGELOG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | undefined {
  const entry = changelogCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    changelogCache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): T {
  changelogCache.set(key, { data, expiresAt: Date.now() + CHANGELOG_CACHE_TTL_MS });
  return data;
}

// ─── Public API ──────────────────────────────────────────────────────

const CHANGELOG_MODEL = "changelog-beta";

/**
 * Get all changelog entries for a locale, sorted by date (newest first),
 * with full body content — for the list page, which renders every entry
 * uncollapsed (there is no expand/collapse toggle; `parseSections(entry.body)`
 * runs for every item on every render).
 *
 * This used to be one list call plus one `single()` call PER entry (N+1: up to
 * 101 requests for 100 entries), which is why the list page could not finish
 * inside any reasonable SSR timeout. `.select("body")` asks the list endpoint
 * itself to include body content — custom fields (version, release_date,
 * summary, ...) are already returned flat on every list item regardless of
 * `select`, so one call now returns everything the page renders.
 *
 * Results are cached for 5 minutes to avoid repeat API calls on repeated
 * requests.
 *
 * Returns `null` when the API call itself fails — a caught error is not
 * "this project has shipped nothing," it is "we do not know," same as the
 * loader's timeout fallback one layer up. Substituting `[]` here would defeat
 * that: the loader could tell a real timeout from a fabricated empty list,
 * but not a fabricated empty list produced by this function's own catch.
 */
export async function getChangelogs(
  locale: string
): Promise<ChangelogListItem[] | null> {
  const cacheKey = `changelogs:${locale}`;
  const cached = getCached<ChangelogListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await getChangelogClient()
      .from(CHANGELOG_MODEL)
      .language(locale)
      .eq("status", "published")
      .order("publishedAt", { ascending: false })
      .select("body")
      .limit(100);

    return setCache(cacheKey, (data ?? []) as ChangelogListItem[]);
  } catch (error) {
    console.error("Changelog API error:", error);
    return null;
  }
}

/**
 * Get changelog metadata only (without full content).
 * Uses a single API call — much faster than getChangelogs which does N+1 calls.
 * Results are cached for 5 minutes (same as getChangelogs) so repeated SSR
 * requests within the same Worker isolate hit the in-memory cache instead of
 * making a subrequest to content.better-i18n.com on every page load.
 *
 * Returns `null` on a genuine API failure — see `getChangelogs` above for why
 * `[]` is not an acceptable substitute. Callers that treat this as secondary
 * data (homepage teaser, prev/next nav) fall back to `?? []` at the call
 * site; that is a deliberate, visible degradation of a decorative feature,
 * not a fabricated claim about the main content.
 */
export async function getChangelogsMeta(
  locale: string
): Promise<ChangelogListItem[] | null> {
  const cacheKey = `changelogs-meta:${locale}`;
  const cached = getCached<ChangelogListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await getChangelogClient()
      .from(CHANGELOG_MODEL)
      .language(locale)
      .eq("status", "published")
      .order("publishedAt", { ascending: false })
      .limit(100);

    return setCache(cacheKey, (data ?? []) as ChangelogListItem[]);
  } catch (error) {
    console.error("Changelog API error:", error);
    return null;
  }
}

/**
 * Get a single changelog entry by slug.
 * Results are cached for 5 minutes.
 */
export async function getChangelogBySlug(
  locale: string,
  slug: string
): Promise<ChangelogEntry | null> {
  const cacheKey = `changelog:${locale}:${slug}`;
  const cached = getCached<ChangelogEntry>(cacheKey);
  if (cached) return cached;

  try {
    const client = getChangelogClient();
    const { data } = await client
      .from(CHANGELOG_MODEL)
      .language(locale)
      .single<ChangelogCustomFields>(slug);

    if (!data) return null;
    return setCache(cacheKey, data);
  } catch (error) {
    console.error("Changelog entry fetch error:", error);
    return null;
  }
}

/**
 * Get the latest changelog version
 */
export async function getLatestVersion(locale: string): Promise<string | null> {
  try {
    const { data } = await getChangelogClient()
      .from(CHANGELOG_MODEL)
      .language(locale)
      .eq("status", "published")
      .order("publishedAt", { ascending: false })
      .limit(1);

    if (!data || data.length === 0) return null;

    const { data: entry } = await getChangelogClient()
      .from(CHANGELOG_MODEL)
      .language(locale)
      .single<ChangelogCustomFields>(data[0].slug);

    return entry?.version || null;
  } catch (error) {
    console.error("Changelog API error:", error);
    return null;
  }
}
