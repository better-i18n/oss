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
   * Project ID in `org/project` slug format (e.g., "acme/dashboard").
   *
   * Find it in the dashboard under **Settings → General → Project ID**, or
   * read it off the dashboard URL: `dash.better-i18n.com/{org}/{project}`.
   *
   * Canonical field. Use `projectId` in new code.
   *
   * Either `projectId` or `project` (legacy alias) must be set.
   */
  projectId?: string;

  /**
   * Legacy alias for `projectId`. Kept for backward compatibility with
   * integrations that shipped before 0.x.
   *
   * @deprecated Use `projectId` instead.
   */
  project?: string;

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
   * Default namespaces to fetch when the project uses namespaced CDN delivery.
   * When set, `getMessages(locale)` only fetches these namespaces instead of all.
   * Can be overridden per-call: `getMessages(locale, { namespaces: [...] })`.
   *
   * Only effective for projects with `fileStructure: "namespaced_folders"`.
   * Ignored for `single_file` projects (no namespace concept in CDN).
   *
   * @example
   * ```ts
   * namespaces: ["common", "auth", "dashboard"]
   * ```
   */
  namespaces?: string[];

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
  /** Resolved project slug (always set post-normalization, from `projectId` or legacy `project` input) */
  project: string;
  cdnBaseUrl: string;
  manifestCacheTtlMs: number;
  /** Separate TTL for translation messages cache (dev=0, prod=5min by default) */
  messagesCacheTtlMs: number;
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
  /** ISO 3166-1 alpha-2 country code (e.g. "tr", "jp", "cn") */
  countryCode?: string | null;
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
 * Per-language file entry in manifest v2.
 * When `namespaces` is present, the project uses namespaced_folders delivery.
 * Old SDKs fall back to `url` (combined translations.json for backward compat).
 * New SDKs check `namespaces` first and fetch per-namespace files in parallel.
 */
export interface ManifestFileEntry extends ManifestFile {
  namespaces?: Record<string, ManifestFile>;
}

/**
 * CDN manifest response
 */
export interface ManifestResponse {
  projectSlug?: string;
  sourceLanguage?: string;
  languages: ManifestLanguage[];
  files?: Record<string, ManifestFileEntry>;
  updatedAt?: string;
  /**
   * When true, CDN supports batch namespace fetching in a single HTTP request:
   * `GET /{locale}/batch.json?ns=common,nav,hero`
   * → `{ "common": {...}, "nav": {...}, "hero": {...} }`
   *
   * SDK falls back to parallel individual fetches when this is false/absent.
   */
  batch?: boolean;
  /**
   * Top-level namespace list for slim manifests.
   * When present, per-locale `files[locale].namespaces` objects can be omitted —
   * SDK constructs URLs deterministically: `{baseUrl}/{locale}/{ns}.json`.
   *
   * This reduces manifest size from ~477KB to ~10-15KB for projects with
   * 100+ namespaces × 20+ locales (removes ~240KB of redundant URL/size/date entries).
   */
  namespaces?: string[];
}

/**
 * Simplified language option for UI components
 */
export interface LanguageOption {
  code: string;
  name?: string;
  nativeName?: string;
  flagUrl?: string | null;
  /** ISO 3166-1 alpha-2 country code (e.g. "tr", "jp", "cn") */
  countryCode?: string | null;
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
export interface MessagesUpdateEvent {
  /** Normalized locale the fresh messages belong to (e.g. `"tr"`). */
  locale: string;
  /** Fresh messages payload — safe to swap into the provider's state. */
  messages: Messages;
}

export type MessagesUpdateListener = (event: MessagesUpdateEvent) => void;

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
   * Get messages for a specific locale.
   * When `namespaces` is provided and the project uses namespaced CDN delivery,
   * only the specified namespaces are fetched (instead of all).
   *
   * Stale-while-revalidate: when a memory cache hit happens, the cached copy is
   * returned immediately AND a background revalidation is kicked off against the
   * CDN. If the revalidation returns different content, subscribers registered
   * via {@link onMessagesUpdate} are notified with the fresh payload.
   */
  getMessages: (locale: string, options?: { namespaces?: string[] }) => Promise<Messages>;

  /**
   * Get available locale codes
   */
  getLocales: () => Promise<string[]>;

  /**
   * Get language options with metadata (for UI components)
   */
  getLanguages: () => Promise<LanguageOption[]>;

  /**
   * Subscribe to background revalidation updates.
   *
   * When a call to {@link revalidate} detects that the CDN manifest version
   * has changed for the given locale, fresh messages are fetched and the
   * listener is invoked with the new payload. React providers use this to
   * re-render stale UI without a full reload.
   *
   * @returns Unsubscribe function.
   */
  onMessagesUpdate: (listener: MessagesUpdateListener) => () => void;

  /**
   * Force a freshness check against the CDN for the given locale.
   *
   * Flow:
   * 1. Fetch the manifest with `forceRefresh` (ETag-aware — cheap, ~5KB, usually 304).
   * 2. Compare `files[locale].lastModified` (or `manifest.updatedAt` fallback)
   *    with the version that was active at the last fetch.
   * 3. If the version is unchanged, the call exits early (no message fetch).
   * 4. If the version changed, fetch new messages and notify subscribers
   *    registered via {@link onMessagesUpdate}.
   *
   * Call this on `visibilitychange` / `focus` / a polling interval to keep
   * long-lived tabs fresh without a full reload. Safe to call frequently —
   * in-flight calls are de-duplicated per locale.
   *
   * Infrastructure-agnostic: only uses standard HTTP semantics (ETag,
   * Cache-Control). No CF/Worker/Vercel coupling.
   */
  revalidate: (locale: string) => Promise<void>;
}
