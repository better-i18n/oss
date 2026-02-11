import type { I18nCoreConfig } from "@better-i18n/core";

/**
 * Pluggable storage interface for persistent translation caching.
 *
 * Compatible with AsyncStorage, MMKV, or any custom key-value store.
 */
export interface TranslationStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Metadata stored alongside cached translations
 */
export interface CacheMeta {
  /** Timestamp when translations were cached */
  cachedAt: number;
}

/**
 * Configuration options for the BetterI18nBackend plugin.
 *
 * Passed via i18next's `backend` option:
 * ```ts
 * i18n.init({ backend: { project: 'acme/my-app' } })
 * ```
 */
export interface BetterI18nBackendOptions {
  /**
   * Project identifier in "org/project" format (e.g., "acme/dashboard")
   */
  project: string;

  /**
   * Default/fallback locale
   * @default "en"
   */
  defaultLocale?: string;

  /**
   * Custom CDN base URL
   * @default "https://cdn.better-i18n.com"
   */
  cdnBaseUrl?: string;

  /**
   * In-memory cache TTL in milliseconds. Controls how long translations
   * are kept in memory before the next CDN fetch within the same session.
   * @default 86400000 (24 hours)
   */
  cacheExpiration?: number;

  /**
   * Pluggable storage adapter for persistent caching.
   * Defaults to AsyncStorage if installed, otherwise in-memory.
   */
  storage?: TranslationStorage;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Custom fetch function (useful for testing)
   */
  fetch?: typeof fetch;

  /**
   * Additional options forwarded to `@better-i18n/core`
   */
  coreOptions?: Partial<Omit<I18nCoreConfig, "project" | "defaultLocale">>;
}
