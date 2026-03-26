/**
 * Better i18n Content SDK Client - Changelog
 *
 * Fetches changelog entries from Better i18n Content API.
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

const CHANGELOG_MODEL = "changelog";

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
    const result = await getChangelogClient().getEntries(CHANGELOG_MODEL, {
      language: locale,
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    // Fetch full entries with content for each item
    const fullEntries = await Promise.all(
      result.items.map((item) =>
        getChangelogClient().getEntry<ChangelogCustomFields>(
          CHANGELOG_MODEL,
          item.slug,
          { language: locale }
        )
      )
    );

    return setCache(cacheKey, fullEntries);
  } catch (error) {
    console.error("Changelog API error:", error);
    return [];
  }
}

/**
 * Get changelog metadata only (without full content).
 * Uses a single API call — much faster than getChangelogs which does N+1 calls.
 */
export async function getChangelogsMeta(
  locale: string
): Promise<ChangelogListItem[]> {
  try {
    const result = await getChangelogClient().getEntries(CHANGELOG_MODEL, {
      language: locale,
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 100,
    });

    return result.items as ChangelogListItem[];
  } catch (error) {
    console.error("Changelog API error:", error);
    return [];
  }
}

/**
 * Get the latest changelog version
 */
export async function getLatestVersion(locale: string): Promise<string | null> {
  try {
    const result = await getChangelogClient().getEntries(CHANGELOG_MODEL, {
      language: locale,
      status: "published",
      sort: "publishedAt",
      order: "desc",
      limit: 1,
    });

    if (result.items.length === 0) return null;

    const entry = await getChangelogClient().getEntry<ChangelogCustomFields>(
      CHANGELOG_MODEL,
      result.items[0].slug,
      { language: locale }
    );

    return entry.version || null;
  } catch (error) {
    console.error("Changelog API error:", error);
    return null;
  }
}
