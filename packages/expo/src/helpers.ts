import i18nDefault, { type i18n, type InitOptions } from "i18next";
import { createI18nCore, normalizeLocale } from "@better-i18n/core";
import type { I18nCore, I18nCoreConfig, Messages, LanguageOption } from "@better-i18n/core";
import { getDeviceLocale } from "./locale.js";
import { resolveStorage, readCache, writeCache } from "./storage.js";
import type { LocaleAwareTranslationStorage, TranslationStorage } from "./types.js";

const LOG_PREFIX = "[better-i18n/expo]";

let _cachedLanguages: LanguageOption[] = [];
const _listeners = new Set<() => void>();

function _emitLanguagesChange(): void {
  for (const listener of _listeners) listener();
}

/**
 * Subscribe to language list changes (used by `useLanguages` hook).
 * Returns an unsubscribe function.
 */
export function subscribeLanguages(listener: () => void): () => void {
  _listeners.add(listener);
  return () => { _listeners.delete(listener); };
}

/**
 * Snapshot function for `useSyncExternalStore`.
 * Returns the current cached languages array reference.
 */
export function getLanguagesSnapshot(): LanguageOption[] {
  return _cachedLanguages;
}

export interface InitBetterI18nOptions {
  /** Project identifier in "org/project" format */
  project: string;

  /**
   * i18next instance to configure.
   * @default global i18next singleton (import i18next from 'i18next')
   */
  i18n?: i18n;

  /** Default/fallback locale @default "en" */
  defaultLocale?: string;

  /** Custom storage adapter for persistent caching (auto-detects MMKV or AsyncStorage if omitted) */
  storage?: TranslationStorage;

  /**
   * Bundled/static translations as last-resort fallback inside core.
   * Used when CDN is unavailable (e.g., first launch in airplane mode).
   *
   * @example
   * ```ts
   * staticData: { en: { common: { hello: "Hello" } } }
   * // or lazy
   * staticData: () => import('./fallback-translations.json')
   * ```
   */
  staticData?: I18nCoreConfig["staticData"];

  /** CDN fetch timeout in milliseconds @default 10000 */
  fetchTimeout?: number;

  /** Number of retry attempts on CDN fetch failure @default 1 */
  retryCount?: number;

  /** Auto-detect device locale via expo-localization @default false */
  useDeviceLocale?: boolean;

  /** Enable debug logging @default false */
  debug?: boolean;

  /** Additional i18next init options (merged with SDK defaults) */
  i18nextOptions?: Partial<InitOptions>;
}

export interface BetterI18nResult {
  /** Core instance for accessing manifest, languages, etc. */
  core: I18nCore;

  /** Available languages from the CDN manifest */
  languages: LanguageOption[];
}

/**
 * Resolve the initial locale to use for i18next initialization.
 *
 * Priority order:
 * 1. Saved locale from LocaleAwareTranslationStorage (if localeKey was set)
 * 2. Device locale (if useDeviceLocale is true)
 * 3. defaultLocale fallback
 */
async function resolveInitialLocale(
  storage: TranslationStorage,
  useDeviceLocale: boolean,
  defaultLocale: string
): Promise<string> {
  // Duck-type: does this storage have locale persistence?
  if ("readLocale" in storage && typeof (storage as unknown as LocaleAwareTranslationStorage).readLocale === "function") {
    try {
      const saved = await (storage as unknown as LocaleAwareTranslationStorage).readLocale();
      if (saved) return saved;
    } catch {
      // readLocale is best-effort — continue to next fallback
    }
  }
  if (useDeviceLocale) return getDeviceLocale({ fallback: defaultLocale });
  return defaultLocale;
}

/**
 * One-call setup that fetches translations from the better-i18n CDN
 * and initializes i18next with all namespaces pre-loaded.
 *
 * Uses the resources pattern instead of a backend plugin, so all
 * namespaces are available immediately without lazy loading issues.
 *
 * @example
 * ```ts
 * import i18n from 'i18next';
 * import { initReactI18next } from 'react-i18next';
 * import { initBetterI18n } from '@better-i18n/expo';
 *
 * i18n.use(initReactI18next);
 *
 * const { languages } = await initBetterI18n({
 *   project: 'acme/my-app',
 *   i18n,
 *   useDeviceLocale: true,
 * });
 * ```
 */
export async function initBetterI18n(
  options: InitBetterI18nOptions
): Promise<BetterI18nResult> {
  const {
    project,
    i18n: i18nOpt,
    defaultLocale = "en",
    storage: userStorage,
    staticData,
    fetchTimeout,
    retryCount,
    useDeviceLocale = false,
    debug = false,
    i18nextOptions = {},
  } = options;

  // Fall back to the global i18next singleton when no instance provided.
  // In React Native, this is always the same module instance — safe to use.
  const i18nInstance = i18nOpt ?? i18nDefault;

  // ── Defense-in-depth warnings ─────────────────────────────────────
  // Mobile apps MUST have offline fallbacks. Without persistent storage
  // AND bundled translations, a single CDN timeout = raw keys on screen.
  if (!userStorage) {
    console.warn(
      `${LOG_PREFIX} ⚠️  No persistent storage provided. Translations won't survive app restarts ` +
      `and every launch will depend on CDN availability. Pass a storage adapter for offline support:\n` +
      `  storage: storageAdapter(new MMKV())  // or storageAdapter(AsyncStorage)`
    );
  }

  if (!staticData) {
    console.warn(
      `${LOG_PREFIX} ⚠️  No staticData (bundled translations) provided. If CDN is unreachable ` +
      `on first launch (e.g. Apple App Review, airplane mode), the app will show raw translation keys.\n` +
      `  staticData: { en: require('./locales/en.json') }`
    );
  } else {
    // Check for empty staticData — catches the subtle bug where locale JSON files
    // were cleared but the import still exists (staticData: { en: {}, tr: {} })
    const emptyLocales: string[] = [];
    const resolvedData = typeof staticData === "function" ? null : staticData;
    if (resolvedData) {
      for (const [locale, messages] of Object.entries(resolvedData)) {
        if (!messages || typeof messages !== "object" || Object.keys(messages).length === 0) {
          emptyLocales.push(locale);
        }
      }
    }
    if (emptyLocales.length > 0) {
      console.warn(
        `${LOG_PREFIX} ⚠️  staticData has empty translations for: ${emptyLocales.join(", ")}. ` +
        `Bundled fallback will not work for these locales. ` +
        `Make sure your locale JSON files contain actual translations, not empty objects.\n` +
        `  Tip: Run "npx @better-i18n/cli pull" to sync bundled translations from CDN.`
      );
    }
  }

  if (!userStorage && !staticData) {
    console.warn(
      `${LOG_PREFIX} 🚨 CRITICAL: No storage AND no staticData. Your app has zero offline fallback. ` +
      `If CDN is unreachable (App Store Review, airplane mode, slow network), ` +
      `users will see raw translation keys. This WILL cause App Store rejection.\n` +
      `  Fix: Add at least one of:\n` +
      `    storage: storageAdapter(new MMKV())\n` +
      `    staticData: { en: require('./locales/en.json') }`
    );
  }

  const storage = await resolveStorage(userStorage, debug);
  const core = createI18nCore({
    project,
    defaultLocale,
    debug,
    staticData,
    fetchTimeout,
    retryCount,
    storage: {
      get: (key) => storage.getItem(key),
      set: (key, value) => storage.setItem(key, value),
    },
  });

  const lng = await resolveInitialLocale(storage, useDeviceLocale, defaultLocale);

  /**
   * Fetch translations from CDN with persistent cache fallback (network-first).
   * On success, writes to cache in the background for offline use.
   */
  async function loadMessages(locale: string): Promise<Messages> {
    try {
      const data = await core.getMessages(locale);
      try {
        await writeCache(storage, project, locale, data);
      } catch {
        // Cache write is best-effort — don't fail the load
      }
      return data;
    } catch (err) {
      if (debug) {
        console.debug(LOG_PREFIX, "CDN failed, checking cache for", locale);
      }
      const cached = await readCache(storage, project, locale);
      if (cached) return cached.data;
      throw err;
    }
  }

  /**
   * Add all namespaces from a messages payload to i18next's resource store.
   */
  function addAllNamespaces(locale: string, messages: Messages): void {
    for (const [ns, data] of Object.entries(messages)) {
      if (typeof data === "object" && data !== null) {
        i18nInstance.addResourceBundle(locale, ns, data, true, true);
      }
    }
  }

  /**
   * Merges all CDN sections into the "translation" namespace for dot-notation access.
   * Enables t('section.key') pattern in addition to t('namespace:key').
   */
  function addTranslationBundle(locale: string, msgs: Messages): void {
    i18nInstance.addResourceBundle(locale, "translation", msgs, true, true);
  }

  // Fetch manifest + initial translations in parallel
  const [languages, messages] = await Promise.all([
    core.getLanguages().catch(() => [] as LanguageOption[]),
    loadMessages(lng),
  ]);

  const supportedLngs = languages.map((l) => l.code);
  const namespaces = Object.keys(messages);

  await i18nInstance.init({
    resources: { [lng]: { translation: messages, ...messages } },
    // "translation" = tüm namespace'ler merged (dot-notation: t('section.key') çalışır)
    // ...messages   = bireysel namespace'ler (colon-notation: t('ns:key') çalışır)
    lng,
    fallbackLng: defaultLocale,
    supportedLngs: supportedLngs.length > 0 ? supportedLngs : false,
    lowerCaseLng: true, // CDN lowercase — match i18next BCP 47 normalization
    defaultNS: "translation",
    fallbackNS: "translation",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    ...i18nextOptions,
  });

  if (debug) {
    console.debug(
      `${LOG_PREFIX} Ready: ${namespaces.length} namespaces, ${supportedLngs.length} languages (${supportedLngs.join(", ")})`
    );
  }

  // ── staticData drift detection ────────────────────────────────────
  // After successful CDN load, compare with staticData to warn about
  // missing namespaces that won't be available offline.
  if (staticData && typeof staticData !== "function") {
    const bundled = staticData[lng];
    if (bundled && typeof bundled === "object") {
      const cdnKeys = new Set(namespaces);
      const bundledKeys = new Set(Object.keys(bundled));
      const missing = [...cdnKeys].filter((k) => !bundledKeys.has(k));
      if (missing.length > 0) {
        console.warn(
          `${LOG_PREFIX} ⚠️  staticData["${lng}"] is missing ${missing.length} namespace(s) that exist on CDN: ` +
          `${missing.join(", ")}. These won't be available offline.\n` +
          `  Run "npx @better-i18n/cli pull" to update your bundled translations.`
        );
      }
    }
  }

  // Override changeLanguage to pre-load translations BEFORE the language switch.
  // This prevents the race condition where i18next switches the language
  // before CDN translations arrive, causing fallback to English.
  const originalChangeLanguage = i18nInstance.changeLanguage.bind(i18nInstance);
  i18nInstance.changeLanguage = async (newLng?: string, callback?: import("i18next").Callback) => {
    const safeLng = newLng ? normalizeLocale(newLng) : undefined;
    if (safeLng) {
      if (!i18nInstance.hasResourceBundle(safeLng, "translation")) {
        try {
          const newMessages = await loadMessages(safeLng);
          addAllNamespaces(safeLng, newMessages);
          addTranslationBundle(safeLng, newMessages);
          if (debug) {
            console.debug(
              `${LOG_PREFIX} Pre-loaded ${Object.keys(newMessages).length} namespaces for ${safeLng}`
            );
          }
        } catch (_error) {
          if (debug) {
            console.debug(
              `${LOG_PREFIX} Pre-load failed for ${safeLng}, continuing with fallback`
            );
          }
        }
      } else {
        // Resources are in memory but persistent cache may be stale/missing.
        // Reconstruct from i18next store and write — critical for iOS widget extensions.
        const storeData = (i18nInstance as any).store?.data?.[safeLng];
        if (storeData) {
          const messages: Messages = {};
          for (const [ns, data] of Object.entries(storeData)) {
            if (ns !== "translation" && typeof data === "object" && data !== null) {
              messages[ns] = data as Record<string, unknown>;
            }
          }
          if (Object.keys(messages).length > 0) {
            try { await writeCache(storage, project, safeLng, messages); } catch { /* best-effort */ }
          }
        }
      }
    }
    // Persist locale if storage supports it (LocaleAwareTranslationStorage duck-type)
    if (safeLng && "writeLocale" in storage && typeof (storage as unknown as LocaleAwareTranslationStorage).writeLocale === "function") {
      try {
        await (storage as unknown as LocaleAwareTranslationStorage).writeLocale(safeLng);
      } catch { /* best-effort */ }
    }
    return originalChangeLanguage(safeLng, callback);
  };

  // Lazy-load translations when the user switches language (safety net)
  i18nInstance.on("languageChanged", async (rawLng: string) => {
    const newLng = normalizeLocale(rawLng);
    // Skip if this language's resources are already loaded
    if (i18nInstance.hasResourceBundle(newLng, "translation")) return;

    try {
      const newMessages = await loadMessages(newLng);
      addAllNamespaces(newLng, newMessages);
      addTranslationBundle(newLng, newMessages);

      if (debug) {
        console.debug(
          `${LOG_PREFIX} Loaded ${Object.keys(newMessages).length} namespaces for ${newLng}`
        );
      }
    } catch (error) {
      console.error(
        `${LOG_PREFIX} Failed to load translations for ${newLng}:`,
        error
      );
    }
  });

  _core = core;
  _cachedLanguages = languages;
  _emitLanguagesChange();

  return { core, languages };
}

/**
 * Returns the languages resolved during `initBetterI18n`.
 * Returns an empty array if called before init completes.
 */
export function getLanguages(): LanguageOption[] {
  return _cachedLanguages;
}

let _core: I18nCore | null = null;

/**
 * Re-fetches the language list from the CDN manifest, updates the
 * internal cache, and notifies all `useLanguages` subscribers.
 *
 * Useful for pull-to-refresh or periodic background updates.
 * Returns the updated language list.
 */
export async function refreshLanguages(): Promise<LanguageOption[]> {
  if (!_core) return _cachedLanguages;
  const langs = await _core.getLanguages();
  _cachedLanguages = langs;
  _emitLanguagesChange();
  return langs;
}
