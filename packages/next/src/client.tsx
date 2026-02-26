"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { createI18nCore } from "@better-i18n/core";
import type { LanguageOption, Messages } from "@better-i18n/core";

import { normalizeConfig } from "./config.js";
import type { I18nConfig } from "./types.js";

// ─── BetterI18nProvider ──────────────────────────────────────────────

interface BetterI18nContextValue {
  setLocale: (locale: string) => void;
}

const BetterI18nContext = createContext<BetterI18nContextValue | null>(null);

export interface BetterI18nProviderProps {
  /** Initial locale from server (getLocale()) */
  locale: string;
  /** Initial messages from server (getMessages()) */
  messages: Messages;
  /** i18n config — only project and defaultLocale are required */
  config: I18nConfig;
  /**
   * IANA time zone for date/time formatting consistency.
   * Falls back to `config.timeZone`, then auto-detects via `Intl.DateTimeFormat`.
   */
  timeZone?: string;
  children: ReactNode;
}

/**
 * Provider that wraps `NextIntlClientProvider` and enables instant locale
 * switching without a server round-trip.
 *
 * When `useSetLocale()` is called inside this provider, it:
 * 1. Sets a cookie (for server-side persistence on next navigation)
 * 2. Fetches new messages from CDN on the client
 * 3. Re-renders the tree with new locale + messages instantly
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { BetterI18nProvider } from '@better-i18n/next/client'
 *
 * export default async function RootLayout({ children }) {
 *   const locale = await getLocale()
 *   const messages = await getMessages()
 *
 *   return (
 *     <BetterI18nProvider
 *       locale={locale}
 *       messages={messages}
 *       config={{ project: 'acme/dashboard', defaultLocale: 'en' }}
 *     >
 *       {children}
 *     </BetterI18nProvider>
 *   )
 * }
 * ```
 */
export function BetterI18nProvider({
  locale: initialLocale,
  messages: initialMessages,
  config,
  timeZone: timeZoneProp,
  children,
}: BetterI18nProviderProps) {
  // Resolve timeZone: prop > config > runtime auto-detection.
  // This avoids next-intl's ENVIRONMENT_FALLBACK warning.
  const timeZone = useMemo(
    () =>
      timeZoneProp ??
      config.timeZone ??
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    [timeZoneProp, config.timeZone],
  );

  const normalized = useMemo(() => normalizeConfig(config), [
    config.project,
    config.defaultLocale,
    config.cookieName,
    config.cdnBaseUrl,
    config.storage,
    config.staticData,
    config.fetchTimeout,
    config.retryCount,
  ]);

  // Provider-level memoized core instance — reused by setLocale
  const i18nCore = useMemo(
    () => createI18nCore(normalized),
    [normalized],
  );

  const [locale, setLocaleState] = useState(initialLocale);
  const [messages, setMessages] = useState<Messages>(initialMessages);

  // Sync with server-provided values when they change (e.g. navigation to a new page)
  useEffect(() => {
    setLocaleState(initialLocale);
    setMessages(initialMessages);
  }, [initialLocale, initialMessages]);

  const setLocale = useCallback(
    async (newLocale: string) => {
      if (newLocale === locale) return;

      // 1. Set cookie for server-side persistence
      document.cookie = `${normalized.cookieName}=${newLocale}; path=/; max-age=31536000; samesite=lax`;

      // 2. Fetch new messages with full fallback chain (CDN → Storage → StaticData)
      try {
        const newMessages = await i18nCore.getMessages(newLocale);

        // 3. Instant client-side update — no server round-trip
        setLocaleState(newLocale);
        setMessages(newMessages);
      } catch (err) {
        console.error("[better-i18n] Client-side locale switch failed, falling back to refresh:", err);
        // Fallback: let the server handle it
        window.location.reload();
      }
    },
    [locale, normalized.cookieName, i18nCore],
  );

  return (
    <BetterI18nContext.Provider value={{ setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </BetterI18nContext.Provider>
  );
}

// ─── useManifestLanguages ────────────────────────────────────────────

export type UseManifestLanguagesResult = {
  languages: LanguageOption[];
  isLoading: boolean;
  error: Error | null;
};

type ClientCacheEntry = {
  data?: LanguageOption[];
  error?: Error;
  promise?: Promise<LanguageOption[]>;
};

// Client-side request deduplication cache
const clientCache = new Map<string, ClientCacheEntry>();

const getCacheKey = (project: string, cdnBaseUrl?: string) =>
  `${cdnBaseUrl || "https://cdn.better-i18n.com"}|${project}`;

/**
 * React hook to fetch manifest languages on the client
 *
 * Uses `createI18nCore` from `@better-i18n/core` internally with
 * request deduplication to prevent duplicate fetches.
 *
 * @example
 * ```tsx
 * const { languages, isLoading, error } = useManifestLanguages({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 * })
 *
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 *
 * return (
 *   <select>
 *     {languages.map(lang => (
 *       <option key={lang.code} value={lang.code}>
 *         {lang.nativeName || lang.name || lang.code}
 *       </option>
 *     ))}
 *   </select>
 * )
 * ```
 */
export const useManifestLanguages = (config: I18nConfig): UseManifestLanguagesResult => {
  const normalized = useMemo(
    () => normalizeConfig(config),
    [
      config.project,
      config.defaultLocale,
      config.cdnBaseUrl,
      config.debug,
      config.logLevel,
      config.storage,
      config.staticData,
      config.fetchTimeout,
      config.retryCount,
    ],
  );

  const i18nCore = useMemo(
    () => createI18nCore(normalized),
    [normalized],
  );

  const cacheKey = getCacheKey(normalized.project, normalized.cdnBaseUrl);
  const cached = clientCache.get(cacheKey);

  const [languages, setLanguages] = useState<LanguageOption[]>(cached?.data ?? []);
  const [isLoading, setIsLoading] = useState(!cached?.data);
  const [error, setError] = useState<Error | null>(cached?.error ?? null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      const entry = clientCache.get(cacheKey) ?? {};

      // Return cached data if available
      if (entry.data) {
        if (isMounted) {
          setLanguages(entry.data);
          setIsLoading(false);
        }
        return;
      }

      // Deduplicate in-flight requests
      if (!entry.promise) {
        entry.promise = i18nCore
          .getLanguages()
          .then((langs) => {
            clientCache.set(cacheKey, { data: langs });
            return langs;
          })
          .catch((err) => {
            const error = err instanceof Error ? err : new Error(String(err));
            clientCache.set(cacheKey, { error });
            throw error;
          });
        clientCache.set(cacheKey, entry);
      }

      try {
        const langs = await entry.promise;
        if (isMounted) {
          setLanguages(langs);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, i18nCore]);

  return { languages, isLoading, error };
};

// ─── useSetLocale ────────────────────────────────────────────────────

/**
 * React hook that returns a function to switch the active locale.
 *
 * - **With `BetterI18nProvider`**: Fetches new messages client-side from CDN
 *   and updates the UI instantly — no page refresh needed.
 * - **Without provider (standalone)**: Pass a config object. Sets a cookie and
 *   calls `router.refresh()` for a soft server re-render.
 *
 * @example With provider (recommended — instant switching)
 * ```tsx
 * // Wrap your layout with BetterI18nProvider, then:
 * const setLocale = useSetLocale()
 * <button onClick={() => setLocale('tr')}>Türkçe</button>
 * ```
 *
 * @example Standalone (soft refresh)
 * ```tsx
 * const setLocale = useSetLocale({ project: 'acme/dashboard', defaultLocale: 'en' })
 * <button onClick={() => setLocale('tr')}>Türkçe</button>
 * ```
 */
export function useSetLocale(config?: I18nConfig): (locale: string) => void {
  const ctx = useContext(BetterI18nContext);

  // If BetterI18nProvider is in the tree, use instant client-side switching
  if (ctx) {
    return ctx.setLocale;
  }

  // Standalone fallback: cookie + router.refresh()
  if (!config) {
    throw new Error(
      "[better-i18n] useSetLocale() requires either a <BetterI18nProvider> ancestor " +
      "or a config argument. Use useSetLocale({ project, defaultLocale }) for standalone mode."
    );
  }

  return useStandaloneSetLocale(config);
}

/** Internal standalone hook — cookie + router.refresh() */
function useStandaloneSetLocale(config: I18nConfig) {
  const normalized = useMemo(() => normalizeConfig(config), [
    config.project,
    config.defaultLocale,
    config.cookieName,
  ]);

  const router = useRouter();

  return useCallback(
    (locale: string) => {
      document.cookie = `${normalized.cookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [normalized.cookieName, router]
  );
}
