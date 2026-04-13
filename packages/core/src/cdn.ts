import { TtlCache, buildCacheKey } from "./cache.js";
import { getProjectBaseUrl, normalizeConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { extractLanguages } from "./manifest.js";
import type {
  I18nCore,
  I18nCoreConfig,
  LanguageOption,
  ManifestFileEntry,
  ManifestResponse,
  Messages,
  NormalizedConfig,
  TranslationStorage,
} from "./types.js";
import { normalizeLocale } from "./utils/locale.js";

const STORAGE_PREFIX = "@better-i18n";

// Global caches (shared across instances)
const manifestCache = new TtlCache<ManifestResponse>();
const messagesCache = new TtlCache<Messages>();
// ETag cache — keyed same as messagesCache, stores last ETag for If-None-Match
const messagesETagCache = new TtlCache<string>();

// ─── Storage helpers ────────────────────────────────────────────────

const buildManifestStorageKey = (project: string): string =>
  `${STORAGE_PREFIX}:manifest:${project}`;

const buildMessagesStorageKey = (project: string, locale: string): string =>
  `${STORAGE_PREFIX}:messages:${project}:${locale}`;

const readFromStorage = async <T>(
  storage: TranslationStorage | undefined,
  key: string
): Promise<T | null> => {
  if (!storage) return null;
  try {
    const raw = await storage.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const writeToStorage = async (
  storage: TranslationStorage | undefined,
  key: string,
  data: unknown
): Promise<void> => {
  if (!storage) return;
  try {
    await storage.set(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
};

// ─── Fetch helpers ──────────────────────────────────────────────────

/**
 * Fetch with AbortController-based timeout
 */
const fetchWithTimeout = async (
  fetchFn: typeof fetch,
  url: string,
  init: RequestInit | undefined,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Fetch with retry logic
 */
const fetchWithRetry = async (
  fetchFn: typeof fetch,
  url: string,
  init: RequestInit | undefined,
  timeoutMs: number,
  retryCount: number
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await fetchWithTimeout(fetchFn, url, init, timeoutMs);
    } catch (err) {
      lastError = err;
      // Don't retry on the last attempt
      if (attempt < retryCount) {
        // Simple exponential backoff: 200ms, 400ms, ...
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * (attempt + 1))
        );
      }
    }
  }

  throw lastError;
};

// ─── Resolve staticData helper ──────────────────────────────────────

const resolveStaticData = async (
  staticData: I18nCoreConfig["staticData"]
): Promise<Record<string, Messages> | null> => {
  if (!staticData) return null;
  if (typeof staticData === "function") {
    try {
      return await staticData();
    } catch {
      return null;
    }
  }
  return staticData;
};

// ─── Manifest fetching with fallback ────────────────────────────────

/**
 * Fetch manifest from CDN (raw, no cache)
 */
const fetchManifestFromCdn = async (
  config: NormalizedConfig,
  fetchFn: typeof fetch
): Promise<ManifestResponse> => {
  const logger = createLogger(config, "manifest");
  const url = `${getProjectBaseUrl(config)}/manifest.json`;

  logger.debug("fetching", url);

  const response = await fetchWithRetry(
    fetchFn,
    url,
    // cache: "no-store" bypasses browser disk cache (fetch API option).
    // Accept-Encoding requests compression: 477KB → 26KB for manifest (94% reduction).
    { headers: { "Cache-Control": "no-store", "Accept-Encoding": "gzip, br" }, cache: "no-store" },
    config.fetchTimeout,
    config.retryCount
  );

  if (!response.ok) {
    const message = `Manifest fetch failed (${response.status})`;
    logger.error(message);
    throw new Error(`[better-i18n] ${message}`);
  }

  const data = (await response.json()) as ManifestResponse;

  if (!Array.isArray(data.languages)) {
    throw new Error("[better-i18n] Manifest payload missing languages array");
  }

  logger.debug("fetched", { languages: data.languages.length });
  return data;
};

/**
 * Get manifest with full fallback chain:
 * 1. Memory cache (TtlCache)
 * 2. CDN fetch (with timeout + retry)
 * 3. Persistent storage
 * 4. Throw (last resort)
 */
const getManifestWithCache = async (
  config: NormalizedConfig,
  fetchFn: typeof fetch,
  forceRefresh = false
): Promise<ManifestResponse> => {
  const logger = createLogger(config, "manifest");
  const cacheKey = buildCacheKey(config.cdnBaseUrl, config.project);
  const storageKey = buildManifestStorageKey(config.project);

  // 1. Memory cache
  if (!forceRefresh) {
    const cached = manifestCache.get(cacheKey);
    if (cached) return cached;
  }

  // 2. CDN fetch
  try {
    const manifest = await fetchManifestFromCdn(config, fetchFn);
    manifestCache.set(cacheKey, manifest, config.manifestCacheTtlMs);

    // Write-through to storage (fire-and-forget)
    writeToStorage(config.storage, storageKey, manifest);

    return manifest;
  } catch (cdnError) {
    logger.warn("CDN fetch failed, trying fallback sources", cdnError);

    // 3. Persistent storage
    const stored = await readFromStorage<ManifestResponse>(
      config.storage,
      storageKey
    );
    if (stored && Array.isArray(stored.languages)) {
      logger.info("serving manifest from persistent storage (stale)");
      manifestCache.set(cacheKey, stored, config.manifestCacheTtlMs);
      return stored;
    }

    // 4. No fallback available
    throw cdnError;
  }
};

// ─── Messages fetching with fallback ────────────────────────────────

type MessagesFetchResult =
  | { notModified: true }
  | { notModified: false; messages: Messages; etag: string | null };

/**
 * Fetch messages from CDN (raw, no cache).
 * Passes If-None-Match when an ETag is known — returns { notModified: true } on 304.
 */
const fetchMessagesFromCdn = async (
  config: NormalizedConfig,
  locale: string,
  fetchFn: typeof fetch,
  ifNoneMatch?: string
): Promise<MessagesFetchResult> => {
  const logger = createLogger(config, "messages");
  const url = `${getProjectBaseUrl(config)}/${locale}/translations.json`;

  logger.debug("fetching", url);

  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    // Request compression: single-file translations.json is often 200-500KB uncompressed
    "Accept-Encoding": "gzip, br",
  };
  if (ifNoneMatch) {
    headers["If-None-Match"] = ifNoneMatch;
  }

  const response = await fetchWithRetry(
    fetchFn,
    url,
    // cache: "no-store" bypasses browser disk cache (fetch API option).
    // The header alone is not enough — browser ignores it for disk cache reads.
    { headers, cache: "no-store" },
    config.fetchTimeout,
    config.retryCount
  );

  // 304 Not Modified — cached content is still fresh
  if (response.status === 304) {
    logger.debug("304 Not Modified", { locale });
    return { notModified: true };
  }

  if (!response.ok) {
    const message = `Messages fetch failed for locale "${locale}" (${response.status})`;
    logger.error(message);
    throw new Error(`[better-i18n] ${message}`);
  }

  const data = (await response.json()) as Messages;
  const etag = response.headers?.get?.("etag") ?? null;

  // CDN always returns HTTP 200 — even for non-existent locales it returns {}
  // or { fallback: true }. Treat empty/fallback responses as failures so the
  // fallback chain (storage → staticData) can provide real translations.
  const isFallbackMarker = "fallback" in data && Object.keys(data).length === 1;
  const isEmpty = !data || Object.keys(data).length === 0;

  if (isEmpty || isFallbackMarker) {
    const reason = isEmpty ? "empty" : "fallback marker";
    logger.warn(`CDN returned ${reason} response for locale "${locale}" — locale may not exist`);
    throw new Error(`[better-i18n] No translations available for locale "${locale}" (${reason})`);
  }

  logger.debug("fetched", { locale, keys: Object.keys(data).length });

  return { notModified: false, messages: data, etag };
};

/**
 * Fetch a single namespace file from its absolute URL.
 * No ETag support — v2 namespace files rely on TtlCache + CDN max-age.
 */
const fetchNamespaceFile = async (
  config: NormalizedConfig,
  namespace: string,
  url: string,
  fetchFn: typeof fetch
): Promise<Record<string, unknown>> => {
  const logger = createLogger(config, "messages");
  logger.debug("fetching namespace", { namespace, url });

  const response = await fetchWithRetry(
    fetchFn,
    url,
    // Per-namespace files are typically 10-50KB — compression still worthwhile
    { headers: { "Cache-Control": "no-store", "Accept-Encoding": "gzip, br" }, cache: "no-store" },
    config.fetchTimeout,
    config.retryCount
  );

  if (!response.ok) {
    const message = `Namespace fetch failed for "${namespace}" (${response.status})`;
    logger.error(message);
    throw new Error(`[better-i18n] ${message}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  logger.debug("fetched namespace", { namespace, keys: Object.keys(data).length });
  return data;
};

/**
 * Fetch all namespace files for a locale in parallel and merge into Messages.
 * Throws if any namespace fetch fails — partial results are not returned.
 */
const fetchNamespacedMessages = async (
  config: NormalizedConfig,
  locale: string,
  namespaces: Record<string, ManifestFileEntry>,
  fetchFn: typeof fetch
): Promise<MessagesFetchResult> => {
  const logger = createLogger(config, "messages");
  const entries = Object.entries(namespaces);

  logger.debug("fetching namespaced messages", {
    locale,
    count: entries.length,
    namespaces: entries.map(([ns]) => ns),
  });

  // Fetch all namespace files in parallel — fail fast on any error
  const results = await Promise.all(
    entries.map(([namespace, fileInfo]) =>
      fetchNamespaceFile(config, namespace, fileInfo.url, fetchFn).then(
        (data) => [namespace, data] as const
      )
    )
  );

  // Merge into Messages: { namespace1: {...}, namespace2: {...} }
  const messages: Messages = {};
  for (const [namespace, data] of results) {
    messages[namespace] = data;
  }

  logger.debug("merged namespaced messages", {
    locale,
    namespaces: Object.keys(messages),
    totalKeys: Object.values(messages).reduce((sum, ns) => sum + Object.keys(ns).length, 0),
  });

  return { notModified: false, messages, etag: null };
};

/**
 * Get messages with full fallback chain:
 * 1. Memory cache (TtlCache)
 * 2. CDN fetch — v2 (namespace files) or v1 (single file), with timeout + retry
 * 3. Persistent storage
 * 4. staticData
 * 5. Throw (last resort)
 */
const getMessagesWithFallback = async (
  config: NormalizedConfig,
  locale: string,
  fetchFn: typeof fetch,
  requestedNamespaces?: string[]
): Promise<Messages> => {
  const safeLng = normalizeLocale(locale);
  const logger = createLogger(config, "messages");
  // Include requested namespaces in cache key so selective fetches don't collide
  const nsSuffix = requestedNamespaces ? `|ns:${requestedNamespaces.sort().join(",")}` : "";
  const cacheKey = `${buildCacheKey(config.cdnBaseUrl, config.project)}|${safeLng}${nsSuffix}`;
  const storageKey = buildMessagesStorageKey(config.project, safeLng);

  // 1. Memory cache
  const memoryCached = messagesCache.get(cacheKey);
  if (memoryCached) return memoryCached;

  // 2. CDN fetch — detect namespace delivery (v2) from manifest, or use single file (v1)
  try {
    let result: MessagesFetchResult;

    // Check manifest for namespace delivery (v2)
    // Manifest is already cached in TtlCache — this is a sub-microsecond lookup on hit
    const manifest = await getManifestWithCache(config, fetchFn).catch(() => null);
    const fileEntry = manifest?.files?.[safeLng];
    const hasNamespaces =
      fileEntry != null &&
      "namespaces" in fileEntry &&
      fileEntry.namespaces != null &&
      Object.keys(fileEntry.namespaces).length > 0;

    if (hasNamespaces) {
      // v2: fetch per-namespace files in parallel and merge
      // When requestedNamespaces is provided, only fetch those (selective loading)
      let namespacesToFetch = fileEntry.namespaces!;
      if (requestedNamespaces && requestedNamespaces.length > 0) {
        const filtered: Record<string, ManifestFileEntry> = {};
        for (const ns of requestedNamespaces) {
          if (namespacesToFetch[ns]) {
            filtered[ns] = namespacesToFetch[ns];
          }
        }
        namespacesToFetch = filtered;
        logger.debug("selective namespace loading", {
          requested: requestedNamespaces.length,
          available: Object.keys(fileEntry.namespaces!).length,
          fetching: Object.keys(namespacesToFetch).length,
        });
      }
      result = await fetchNamespacedMessages(config, safeLng, namespacesToFetch, fetchFn);
    } else {
      // v1: single-file fetch with ETag support (unchanged path)
      const cachedETag = messagesETagCache.get(cacheKey);
      result = await fetchMessagesFromCdn(config, safeLng, fetchFn, cachedETag);

      // 304 Not Modified — CDN confirmed content unchanged; refresh TTL with stored data
      if (result.notModified) {
        const stored = await readFromStorage<Messages>(config.storage, storageKey);
        if (stored) {
          logger.debug(`304: refreshing TTL for "${safeLng}" from storage`);
          messagesCache.set(cacheKey, stored, config.messagesCacheTtlMs);
          return stored;
        }
        // No storage fallback — re-fetch without ETag to get fresh data
        const freshResult = await fetchMessagesFromCdn(config, safeLng, fetchFn);
        if (!freshResult.notModified) {
          messagesCache.set(cacheKey, freshResult.messages, config.messagesCacheTtlMs);
          if (freshResult.etag) messagesETagCache.set(cacheKey, freshResult.etag, config.manifestCacheTtlMs);
          writeToStorage(config.storage, storageKey, freshResult.messages);
          return freshResult.messages;
        }
      }
    }

    // 200 OK — new or changed content (both v1 non-304 and v2)
    if (!result.notModified) {
      messagesCache.set(cacheKey, result.messages, config.messagesCacheTtlMs);
      if (result.etag) messagesETagCache.set(cacheKey, result.etag, config.manifestCacheTtlMs);
      writeToStorage(config.storage, storageKey, result.messages);
      return result.messages;
    }

    // Shouldn't reach here, but satisfy TypeScript
    throw new Error("[better-i18n] Unexpected 304 without storage fallback");
  } catch (cdnError) {
    logger.warn(`CDN fetch failed for locale "${safeLng}", trying fallback sources`, cdnError);

    // 3. Persistent storage
    const stored = await readFromStorage<Messages>(config.storage, storageKey);
    if (stored) {
      logger.info(`serving messages for "${safeLng}" from persistent storage (stale)`);
      messagesCache.set(cacheKey, stored, config.messagesCacheTtlMs);
      return stored;
    }

    // 4. staticData
    const resolved = await resolveStaticData(config.staticData);
    if (resolved && resolved[safeLng]) {
      logger.info(`serving messages for "${safeLng}" from staticData`);
      return resolved[safeLng];
    }

    // 5. No fallback available
    throw cdnError;
  }
};

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Create an i18n core instance
 *
 * @example
 * ```ts
 * const i18n = createI18nCore({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 * })
 *
 * const messages = await i18n.getMessages('en')
 * const locales = await i18n.getLocales()
 * ```
 *
 * @example
 * ```ts
 * // With fallback support
 * const i18n = createI18nCore({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 *   storage: createAutoStorage(),
 *   staticData: { en: { common: { hello: "Hello" } } },
 *   fetchTimeout: 5000,
 *   retryCount: 2,
 * })
 * ```
 */
export const createI18nCore = (config: I18nCoreConfig): I18nCore => {
  const normalized = normalizeConfig(config);
  const fetchFn = normalized.fetch ?? fetch;

  return {
    config: normalized,

    getManifest: (options?: { forceRefresh?: boolean }) =>
      getManifestWithCache(normalized, fetchFn, options?.forceRefresh),

    getMessages: (locale: string, options?: { namespaces?: string[] }) =>
      getMessagesWithFallback(normalized, locale, fetchFn, options?.namespaces),

    getLocales: async (): Promise<string[]> => {
      const manifest = await getManifestWithCache(normalized, fetchFn);
      const languages = extractLanguages(manifest);

      if (languages.length === 0) {
        throw new Error("[better-i18n] No locales found in manifest");
      }

      return languages.map((lang) => lang.code);
    },

    getLanguages: async (): Promise<LanguageOption[]> => {
      const manifest = await getManifestWithCache(normalized, fetchFn);
      const languages = extractLanguages(manifest);

      if (languages.length === 0) {
        throw new Error("[better-i18n] No languages found in manifest");
      }

      return languages;
    },
  };
};

/**
 * Clear all caches (useful for testing)
 */
export const clearManifestCache = (): void => {
  manifestCache.clear();
};

/**
 * Clear the messages cache (useful for testing)
 */
export const clearMessagesCache = (): void => {
  messagesCache.clear();
};
