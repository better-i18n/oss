import { TtlCache, buildCacheKey } from "./cache";
import { getProjectBaseUrl, normalizeConfig } from "./config";
import { createLogger } from "./logger";
import { extractLanguages } from "./manifest";
import type {
  I18nCore,
  I18nCoreConfig,
  LanguageOption,
  ManifestResponse,
  Messages,
  NormalizedConfig,
  TranslationStorage,
} from "./types";

const STORAGE_PREFIX = "@better-i18n";

// Global caches (shared across instances)
const manifestCache = new TtlCache<ManifestResponse>();
const messagesCache = new TtlCache<Messages>();

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
    { headers: { "Cache-Control": "no-cache" } },
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

/**
 * Fetch messages from CDN (raw, no cache)
 */
const fetchMessagesFromCdn = async (
  config: NormalizedConfig,
  locale: string,
  fetchFn: typeof fetch
): Promise<Messages> => {
  const logger = createLogger(config, "messages");
  const url = `${getProjectBaseUrl(config)}/${locale}/translations.json`;

  logger.debug("fetching", url);

  const response = await fetchWithRetry(
    fetchFn,
    url,
    { headers: { "Cache-Control": "no-cache" } },
    config.fetchTimeout,
    config.retryCount
  );

  if (!response.ok) {
    const message = `Messages fetch failed for locale "${locale}" (${response.status})`;
    logger.error(message);
    throw new Error(`[better-i18n] ${message}`);
  }

  const data = (await response.json()) as Messages;
  logger.debug("fetched", { locale, keys: Object.keys(data).length });

  return data;
};

/**
 * Get messages with full fallback chain:
 * 1. Memory cache (TtlCache)
 * 2. CDN fetch (with timeout + retry)
 * 3. Persistent storage
 * 4. staticData
 * 5. Throw (last resort)
 */
const getMessagesWithFallback = async (
  config: NormalizedConfig,
  locale: string,
  fetchFn: typeof fetch
): Promise<Messages> => {
  const safeLng = locale.toLowerCase(); // CDN convention: always lowercase
  const logger = createLogger(config, "messages");
  const cacheKey = `${buildCacheKey(config.cdnBaseUrl, config.project)}|${safeLng}`;
  const storageKey = buildMessagesStorageKey(config.project, safeLng);

  // 1. Memory cache
  const memoryCached = messagesCache.get(cacheKey);
  if (memoryCached) return memoryCached;

  // 2. CDN fetch
  try {
    const messages = await fetchMessagesFromCdn(config, safeLng, fetchFn);
    messagesCache.set(cacheKey, messages, config.manifestCacheTtlMs);

    // Write-through to storage (fire-and-forget)
    writeToStorage(config.storage, storageKey, messages);

    return messages;
  } catch (cdnError) {
    logger.warn(`CDN fetch failed for locale "${safeLng}", trying fallback sources`, cdnError);

    // 3. Persistent storage
    const stored = await readFromStorage<Messages>(config.storage, storageKey);
    if (stored) {
      logger.info(`serving messages for "${safeLng}" from persistent storage (stale)`);
      messagesCache.set(cacheKey, stored, config.manifestCacheTtlMs);
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

    getMessages: (locale: string) =>
      getMessagesWithFallback(normalized, locale, fetchFn),

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
