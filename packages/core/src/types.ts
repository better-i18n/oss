/**
 * Supported locale string (e.g., "en", "en-US", "tr")
 */
export type Locale = string;

/**
 * Log level for debugging
 */
export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

/**
 * Pluggable storage interface for persistent translation caching.
 * Compatible with browser localStorage, AsyncStorage, MMKV, or any key-value store.
 */
export interface TranslationStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove?(key: string): Promise<void>;
}

/**
 * Core i18n configuration
 */
export interface I18nCoreConfig {
  /**
   * Project identifier in format "org/project" (e.g., "acme/dashboard")
   */
  project: string;

  /**
   * Default locale to use when no locale is specified
   */
  defaultLocale: string;

  /**
   * CDN base URL
   * @default "https://cdn.better-i18n.com"
   */
  cdnBaseUrl?: string;

  /**
   * Cache TTL in milliseconds for manifest
   * @default 300000 (5 minutes)
   */
  manifestCacheTtlMs?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Log level
   * @default "warn"
   */
  logLevel?: LogLevel;

  /**
   * Custom fetch function (useful for testing or custom environments)
   */
  fetch?: typeof fetch;

  /**
   * Persistent storage adapter for offline fallback.
   * When CDN is unavailable, translations are served from storage.
   */
  storage?: TranslationStorage;

  /**
   * Bundled/static translations as last-resort fallback.
   * Used when both CDN and storage are unavailable.
   * Can be a static object or a lazy-loading function.
   *
   * @example
   * ```ts
   * // Static import
   * staticData: { en: { common: { hello: "Hello" } } }
   *
   * // Lazy import
   * staticData: () => import('./fallback-translations.json')
   * ```
   */
  staticData?: Record<string, Messages> | (() => Promise<Record<string, Messages>>);

  /**
   * CDN fetch timeout in milliseconds.
   * If a fetch does not complete within this time, the request is aborted
   * and fallback sources are tried.
   * @default 10000
   */
  fetchTimeout?: number;

  /**
   * Number of retry attempts on CDN fetch failure.
   * @default 1
   */
  retryCount?: number;
}

/**
 * Parsed project identifier
 */
export interface ParsedProject {
  workspaceId: string;
  projectSlug: string;
}

/**
 * Normalized configuration with all defaults applied
 */
export interface NormalizedConfig extends I18nCoreConfig, ParsedProject {
  cdnBaseUrl: string;
  manifestCacheTtlMs: number;
  fetchTimeout: number;
  retryCount: number;
}

/**
 * Language information from manifest
 */
export interface ManifestLanguage {
  code: string;
  name?: string;
  nativeName?: string;
  flagUrl?: string | null;
  isSource?: boolean;
  lastUpdated?: string | null;
  keyCount?: number;
}

/**
 * File information in manifest
 */
export interface ManifestFile {
  url: string;
  size: number;
  lastModified: string | null;
}

/**
 * CDN manifest response
 */
export interface ManifestResponse {
  projectSlug?: string;
  sourceLanguage?: string;
  languages: ManifestLanguage[];
  files?: Record<string, ManifestFile>;
  updatedAt?: string;
}

/**
 * Simplified language option for UI components
 */
export interface LanguageOption {
  code: string;
  name?: string;
  nativeName?: string;
  flagUrl?: string | null;
  /**
   * Whether this is the default/source language
   */
  isDefault?: boolean;
}

/**
 * Translation messages keyed by namespace.
 * Matches the CDN response format: `{ "common": { "key": "value" }, "auth": { ... } }`
 */
export type Messages = Record<string, Record<string, unknown>>;

/**
 * Logger interface
 */
export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Cache entry with expiration
 */
export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * i18n core instance returned by createI18nCore
 */
export interface I18nCore {
  /**
   * Resolved configuration
   */
  config: NormalizedConfig;

  /**
   * Fetch manifest from CDN
   */
  getManifest: (options?: { forceRefresh?: boolean }) => Promise<ManifestResponse>;

  /**
   * Get messages for a specific locale
   */
  getMessages: (locale: string) => Promise<Messages>;

  /**
   * Get available locale codes
   */
  getLocales: () => Promise<string[]>;

  /**
   * Get language options with metadata (for UI components)
   */
  getLanguages: () => Promise<LanguageOption[]>;
}
