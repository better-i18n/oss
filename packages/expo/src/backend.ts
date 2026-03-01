import { createI18nCore, TtlCache } from "@better-i18n/core";
import type { I18nCore, Messages } from "@better-i18n/core";
import type {
  BackendModule,
  CallbackError,
  InitOptions,
  ReadCallback,
  Services,
} from "i18next";
import { readCache, resolveStorage, writeCache } from "./storage.js";
import type { BetterI18nBackendOptions, TranslationStorage } from "./types.js";

const DEFAULT_CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extract keys for a specific namespace from the flat CDN response.
 *
 * CDN returns: `{ "common.hero.title": "Welcome", "common.nav.home": "Home" }`
 * i18next expects for namespace "common": `{ "hero.title": "Welcome", "nav.home": "Home" }`
 *
 * If keys are already nested (no namespace prefix), returns the namespace
 * subtree or the full object if namespace doesn't exist as a top-level key.
 */
function extractNamespace(
  data: Record<string, unknown>,
  namespace: string
): Record<string, unknown> {
  // Case 1: Data is already nested with namespace as a top-level key
  // e.g. { "common": { "hero": { "title": "..." } } }
  if (
    namespace in data &&
    typeof data[namespace] === "object" &&
    data[namespace] !== null
  ) {
    return data[namespace] as Record<string, unknown>;
  }

  // Case 2: Flat keys with namespace prefix ("common.hero.title")
  const prefix = `${namespace}.`;
  const result: Record<string, unknown> = {};
  let foundAny = false;

  for (const key in data) {
    if (key.startsWith(prefix)) {
      result[key.slice(prefix.length)] = data[key];
      foundAny = true;
    }
  }

  if (foundAny) return result;

  // Case 3: No namespace structure found — return everything as-is
  // (single-namespace projects or default namespace)
  return data;
}

/**
 * @deprecated Use `initBetterI18n` instead. The backend plugin uses lazy-loading
 * which can cause a brief English flash when switching languages.
 * `initBetterI18n` pre-loads translations before switching.
 *
 * @example
 * ```ts
 * // Instead of BetterI18nBackend, use:
 * import { initBetterI18n } from '@better-i18n/expo';
 *
 * await initBetterI18n({
 *   project: 'acme/my-app',
 *   i18n: i18n.use(initReactI18next),
 * });
 * ```
 */
export class BetterI18nBackend implements BackendModule<BetterI18nBackendOptions> {
  static type = "backend" as const;
  type = "backend" as const;

  private core!: I18nCore;
  private storagePromise!: Promise<TranslationStorage>;
  private memoryCache = new TtlCache<Messages>();
  private cacheExpiration = DEFAULT_CACHE_EXPIRATION_MS;
  private project = "";
  private debug = false;
  private services: Services | null = null;

  init(
    services: Services,
    backendOptions: BetterI18nBackendOptions,
    _i18nextOptions: InitOptions
  ): void {
    this.services = services;
    if (!backendOptions.project) {
      throw new Error(
        "[better-i18n/expo] `project` is required in backend options"
      );
    }

    this.project = backendOptions.project;
    this.debug = backendOptions.debug ?? false;
    this.cacheExpiration =
      backendOptions.cacheExpiration ?? DEFAULT_CACHE_EXPIRATION_MS;

    this.storagePromise = resolveStorage(backendOptions.storage);

    this.core = createI18nCore({
      project: backendOptions.project,
      defaultLocale: backendOptions.defaultLocale ?? "en",
      cdnBaseUrl: backendOptions.cdnBaseUrl,
      debug: this.debug,
      fetch: backendOptions.fetch,
      staticData: backendOptions.staticData,
      fetchTimeout: backendOptions.fetchTimeout,
      retryCount: backendOptions.retryCount,
      ...backendOptions.coreOptions,
    });
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    this.loadTranslations(language)
      .then((allData) => {
        const nsData = extractNamespace(allData, namespace);
        this.log(
          "namespace",
          namespace,
          "→",
          Object.keys(nsData).length,
          "keys"
        );

        // Auto-register sibling namespaces so i18next discovers them
        this.discoverAndRegisterNamespaces(language, allData, namespace);

        callback(null, nsData);
      })
      .catch((err: CallbackError) => callback(err, null));
  }

  /**
   * Detect sibling namespaces from CDN data and register them in the
   * i18next resource store so they are available without extra fetches.
   */
  private discoverAndRegisterNamespaces(
    language: string,
    allData: Record<string, unknown>,
    requestedNamespace: string
  ): void {
    // Nested format: top-level keys are namespace names
    const isNested =
      requestedNamespace in allData &&
      typeof allData[requestedNamespace] === "object" &&
      allData[requestedNamespace] !== null;

    if (isNested) {
      for (const ns of Object.keys(allData)) {
        if (ns === requestedNamespace) continue;
        if (typeof allData[ns] === "object" && allData[ns] !== null) {
          this.addToStore(language, ns, allData[ns] as Record<string, unknown>);
        }
      }
      return;
    }

    // Flat format: "common.hero.title" → namespace "common"
    const namespaces = new Set<string>();
    for (const key of Object.keys(allData)) {
      const dotIndex = key.indexOf(".");
      if (dotIndex > 0) {
        namespaces.add(key.slice(0, dotIndex));
      }
    }

    for (const ns of namespaces) {
      if (ns === requestedNamespace) continue;
      const nsData = extractNamespace(allData, ns);
      this.addToStore(language, ns, nsData);
    }
  }

  /**
   * Safely add a resource bundle to i18next's store.
   * Uses a type assertion because `addResourceBundle` exists at runtime
   * on the resourceStore but is missing from the TS type definitions.
   */
  private addToStore(
    language: string,
    namespace: string,
    data: Record<string, unknown>
  ): void {
    try {
      const store = this.services?.resourceStore as
        | {
            addResourceBundle?: (
              lng: string,
              ns: string,
              resources: Record<string, unknown>,
              deep?: boolean,
              overwrite?: boolean
            ) => void;
          }
        | undefined;

      if (store?.addResourceBundle) {
        store.addResourceBundle(language, namespace, data, true, true);
        this.log(
          "auto-registered namespace",
          namespace,
          "→",
          Object.keys(data).length,
          "keys"
        );
      }
    } catch {
      // Graceful fallback — resourceStore may not be available
    }
  }

  private async loadTranslations(
    locale: string
  ): Promise<Record<string, unknown>> {
    const memoryCacheKey = `${this.project}:${locale}`;

    // 1. In-memory cache — skip redundant fetches within the same session
    const memoryHit = this.memoryCache.get(memoryCacheKey);
    if (memoryHit) {
      this.log("memory cache hit", locale);
      return memoryHit;
    }

    const storage = await this.storagePromise;

    // 2. Network-first: always try CDN, fall back to persistent cache
    try {
      this.log("fetching from CDN", locale);
      const data = await this.core.getMessages(locale);

      // Persist to both caches
      this.memoryCache.set(memoryCacheKey, data, this.cacheExpiration);
      writeCache(storage, this.project, locale, data).catch((err) => {
        this.log("failed to write persistent cache", err);
      });

      return data;
    } catch (err) {
      this.log("CDN fetch failed, checking persistent cache", locale, err);

      // 3. CDN down — fall back to persistent cache
      const cached = await readCache(storage, this.project, locale);
      if (cached) {
        this.log("serving from persistent cache (offline fallback)", locale);
        this.memoryCache.set(memoryCacheKey, cached.data, this.cacheExpiration);
        return cached.data;
      }

      // 4. No cache, no CDN — nothing we can do
      throw err;
    }
  }

  private log(...args: unknown[]): void {
    if (this.debug) {
      console.debug("[better-i18n/expo]", ...args);
    }
  }
}
