/**
 * Better i18n Content SDK Client - Changelog
 *
 * Fetches changelog entries from Better i18n Content API.
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

    _changelogClient = createClient({ project, apiKey, debug: true });
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
 * Get all changelog entries for a locale, sorted by date (newest first)
 * Fetches full content for each entry.
 * Results are cached for 5 minutes to avoid N+1 API calls on repeated requests.
 */
export async function getChangelogs(
  locale: string
): Promise<ChangelogEntry[]> {
  const cacheKey = `changelogs:${locale}`;
  const cached = getCached<ChangelogEntry[]>(cacheKey);
  if (cached) return cached;

  try {
    const client = getChangelogClient();

    const { data: items } = await client
      .from(CHANGELOG_MODEL)
      .language(locale)
      .eq("status", "published")
      .order("publishedAt", { ascending: false })
      .limit(100);

    if (!items || items.length === 0) return [];

    // Fetch full entries with content for each item
    const results = await Promise.all(
      items.map(async (item: ContentEntryListItem) => {
        const { data } = await client
          .from(CHANGELOG_MODEL)
          .language(locale)
          .single<ChangelogCustomFields>(item.slug);
        return data;
      })
    );

    const fullEntries = results.filter((e): e is ChangelogEntry => e !== null);
    return setCache(cacheKey, fullEntries);
  } catch (error) {
    console.error("Changelog API error:", error);
    return [];
  }
}

/**
 * Get changelog metadata only (without full content).
 * Uses a single API call — much faster than getChangelogs which does N+1 calls.
 * Results are cached for 5 minutes (same as getChangelogs) so repeated SSR
 * requests within the same Worker isolate hit the in-memory cache instead of
 * making a subrequest to content.better-i18n.com on every page load.
 */
export async function getChangelogsMeta(
  locale: string
): Promise<ChangelogListItem[]> {
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
    return [];
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
