import type { I18nCoreConfig } from "@better-i18n/core";

/**
 * MMKV instance minimum API (react-native-mmkv).
 * Sync methods — storageAdapter wraps them into async.
 */
export interface MMKVLike {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

/**
 * AsyncStorage-compatible interface.
 * Already async — storageAdapter passes through.
 */
export interface AsyncStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

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
 * Options for storageAdapter — enables locale persistence on the adapter.
 */
export interface StorageAdapterOptions {
  /**
   * Storage key for persisting the active locale.
   * When set, returned adapter gains readLocale() / writeLocale() methods.
   *
   * @example
   * storageAdapter(AsyncStorage, { localeKey: '@app:locale' })
   */
  localeKey?: string;
}

/**
 * TranslationStorage extended with locale persistence.
 * Returned by storageAdapter() when localeKey option is provided.
 * Detected via duck-typing by initBetterI18n.
 */
export interface LocaleAwareTranslationStorage extends TranslationStorage {
  readLocale(): Promise<string | null>;
  writeLocale(lng: string): Promise<void>;
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
   * Bundled/static translations as last-resort fallback inside core.
   * Used when CDN is unavailable (e.g., first launch in airplane mode).
   */
  staticData?: I18nCoreConfig["staticData"];

  /**
   * CDN fetch timeout in milliseconds.
   * @default 10000
   */
  fetchTimeout?: number;

  /**
   * Number of retry attempts on CDN fetch failure.
   * @default 1
   */
  retryCount?: number;

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
