import type { i18n, InitOptions, Resource } from "i18next";
import { createI18nCore } from "@better-i18n/core";
import type { I18nCore, Messages, LanguageOption } from "@better-i18n/core";
import { getDeviceLocale } from "./locale";
import { resolveStorage, readCache, writeCache } from "./storage";
import type { TranslationStorage } from "./types";

const LOG_PREFIX = "[better-i18n/expo]";

export interface InitBetterI18nOptions {
  /** Project identifier in "org/project" format */
  project: string;

  /** i18next instance to configure */
  i18n: i18n;

  /** Default/fallback locale @default "en" */
  defaultLocale?: string;

  /** Custom storage adapter for persistent caching (auto-detects MMKV or AsyncStorage if omitted) */
  storage?: TranslationStorage;

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
 * Pick the default namespace from CDN-delivered namespaces.
 * Prefers "common" if present, otherwise uses the first namespace,
 * falling back to i18next's standard "translation" default.
 */
function resolveDefaultNS(namespaces: string[]): string {
  if (namespaces.includes("common")) return "common";
  return namespaces[0] ?? "translation";
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
    i18n: i18nInstance,
    defaultLocale = "en",
    storage: userStorage,
    useDeviceLocale = false,
    debug = false,
    i18nextOptions = {},
  } = options;

  const storage = resolveStorage(userStorage);
  const core = createI18nCore({ project, defaultLocale, debug });

  const lng = useDeviceLocale
    ? getDeviceLocale({ fallback: defaultLocale })
    : defaultLocale;

  /**
   * Fetch translations from CDN with persistent cache fallback (network-first).
   * On success, writes to cache in the background for offline use.
   */
  async function loadMessages(locale: string): Promise<Messages> {
    try {
      const data = await core.getMessages(locale);
      writeCache(storage, project, locale, data as Record<string, unknown>).catch(
        () => {}
      );
      return data;
    } catch (err) {
      if (debug) {
        console.debug(LOG_PREFIX, "CDN failed, checking cache for", locale);
      }
      const cached = await readCache(storage, project, locale);
      if (cached) return cached.data as Messages;
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

  // Fetch manifest + initial translations in parallel
  const [languages, messages] = await Promise.all([
    core.getLanguages(),
    loadMessages(lng),
  ]);

  const supportedLngs = languages.map((l) => l.code);
  const namespaces = Object.keys(messages);
  const defaultNS = resolveDefaultNS(namespaces);

  await i18nInstance.init({
    resources: { [lng]: messages } as Resource,
    lng,
    fallbackLng: defaultLocale,
    supportedLngs,
    defaultNS,
    fallbackNS: defaultNS,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    ...i18nextOptions,
  });

  if (debug) {
    console.debug(
      `${LOG_PREFIX} Ready: ${namespaces.length} namespaces, ${supportedLngs.length} languages (${supportedLngs.join(", ")})`
    );
  }

  // Lazy-load translations when the user switches language
  i18nInstance.on("languageChanged", async (newLng: string) => {
    // Skip if this language's resources are already loaded
    const anyNs = namespaces[0];
    if (anyNs && i18nInstance.hasResourceBundle(newLng, anyNs)) return;

    try {
      const newMessages = await loadMessages(newLng);
      addAllNamespaces(newLng, newMessages);

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

  return { core, languages };
}
