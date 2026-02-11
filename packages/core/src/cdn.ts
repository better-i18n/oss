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
} from "./types";

// Global manifest cache (shared across instances)
const manifestCache = new TtlCache<ManifestResponse>();

/**
 * Fetch manifest from CDN
 */
const fetchManifest = async (
  config: NormalizedConfig,
  fetchFn: typeof fetch
): Promise<ManifestResponse> => {
  const logger = createLogger(config, "manifest");
  const url = `${getProjectBaseUrl(config)}/manifest.json`;

  logger.debug("fetching", url);

  const response = await fetchFn(url, {
    headers: { "Cache-Control": "no-cache" },
  });

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
 * Get manifest with caching
 */
const getManifestWithCache = async (
  config: NormalizedConfig,
  fetchFn: typeof fetch,
  forceRefresh = false
): Promise<ManifestResponse> => {
  const cacheKey = buildCacheKey(config.cdnBaseUrl, config.project);

  if (!forceRefresh) {
    const cached = manifestCache.get(cacheKey);
    if (cached) return cached;
  }

  const manifest = await fetchManifest(config, fetchFn);
  manifestCache.set(cacheKey, manifest, config.manifestCacheTtlMs);

  return manifest;
};

/**
 * Fetch messages for a locale
 */
const fetchMessages = async (
  config: NormalizedConfig,
  locale: string,
  fetchFn: typeof fetch
): Promise<Messages> => {
  const logger = createLogger(config, "messages");
  const url = `${getProjectBaseUrl(config)}/${locale}/translations.json`;

  logger.debug("fetching", url);

  const response = await fetchFn(url, {
    headers: { "Cache-Control": "no-cache" },
  });

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
 */
export const createI18nCore = (config: I18nCoreConfig): I18nCore => {
  const normalized = normalizeConfig(config);
  const fetchFn = normalized.fetch ?? fetch;

  return {
    config: normalized,

    getManifest: (options?: { forceRefresh?: boolean }) =>
      getManifestWithCache(normalized, fetchFn, options?.forceRefresh),

    getMessages: (locale: string) => fetchMessages(normalized, locale, fetchFn),

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
 * Clear the manifest cache (useful for testing)
 */
export const clearManifestCache = (): void => {
  manifestCache.clear();
};
