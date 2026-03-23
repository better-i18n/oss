"use client";

import { createI18nCore } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { IntlProvider } from "use-intl";
import { BetterI18nContext } from "./context.js";
import type { BetterI18nProviderConfig, Messages } from "./types.js";

// ─── SSR Data Injection ──────────────────────────────────────────────

/**
 * Data injected by `@better-i18n/vite` plugin via `<script id="__better_i18n__">`.
 */
interface SSRData {
  project: string;
  locale: string;
  messages: Messages;
  languages: LanguageOption[];
  localeCookie?: string;
  supportedLocales?: string[];
}

/**
 * Read SSR-injected translations from the DOM.
 * Called once as a `useState` lazy initializer — synchronous, before first paint.
 * This is the same pattern as helpcenter's `#__i18n_messages__` hydration.
 */
function readSSRData(): SSRData | null {
  if (typeof document === "undefined") return null;
  try {
    const el = document.getElementById("__better_i18n__");
    if (!el?.textContent) return null;
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

// ─── Provider Props ──────────────────────────────────────────────────

export interface BetterI18nProviderProps
  extends Omit<BetterI18nProviderConfig, "project" | "locale"> {
  children: ReactNode;
  /**
   * Project identifier in "org/project" format.
   * Optional when using `@better-i18n/vite` plugin (auto-injected via `<script>` tag).
   */
  project?: string;
  /**
   * Current locale.
   * Optional when using `@better-i18n/vite` plugin (auto-detected server-side).
   */
  locale?: string;
  /** Pre-loaded languages from SSR loader — skips loading state on first render */
  initialLanguages?: LanguageOption[];
  /**
   * URL prefix strategy for locale codes.
   * - `"as-needed"` (default): default locale has no URL prefix
   * - `"always"`: all locales get a URL prefix (e.g., TanStack Router `$locale/` routes)
   * @default "as-needed"
   */
  localePrefix?: "always" | "as-needed";
  /** Custom fallback when a message key is missing */
  getMessageFallback?: (info: {
    error: Error;
    key: string;
    namespace?: string;
  }) => string;
  /**
   * Called when locale changes via `setLocale()` (e.g., from `LocaleDropdown`).
   * In router-based apps, use this to trigger URL navigation:
   *
   * @example
   * ```tsx
   * <BetterI18nProvider
   *   project="acme/web"
   *   locale={locale}
   *   onLocaleChange={(newLocale) => {
   *     navigate({ to: `/${newLocale}${pathname}` })
   *   }}
   * >
   * ```
   */
  onLocaleChange?: (locale: string) => void;
}

/**
 * Provider component that combines Better i18n CDN with use-intl
 *
 * Manages locale state internally, enabling locale switching via
 * `setLocale()` from `useLocale()` or `useLocaleRouter()`.
 *
 * @example
 * ```tsx
 * // Plain Vite / React app (no router)
 * function App() {
 *   return (
 *     <BetterI18nProvider project="acme/dashboard" locale="en">
 *       <LocaleDropdown />
 *       <MyComponent />
 *     </BetterI18nProvider>
 *   )
 * }
 *
 * // TanStack Router SSR usage (pre-loaded messages from loader)
 * function RootComponent() {
 *   const { messages, locale } = Route.useLoaderData()
 *   return (
 *     <BetterI18nProvider
 *       project="acme/dashboard"
 *       locale={locale}
 *       messages={messages}
 *     >
 *       <Outlet />
 *     </BetterI18nProvider>
 *   )
 * }
 * ```
 */
export function BetterI18nProvider({
  children,
  project: propProject,
  locale: propLocale,
  messages: propMessages,
  timeZone,
  now,
  onError,
  cdnBaseUrl,
  debug,
  logLevel,
  fetch: customFetch,
  storage,
  staticData,
  fetchTimeout,
  retryCount,
  initialLanguages: propInitialLanguages,
  localePrefix = "as-needed",
  getMessageFallback: customGetMessageFallback,
  onLocaleChange,
}: BetterI18nProviderProps) {
  // ─── SSR Data (from @better-i18n/vite plugin) ─────────────────────
  // Read plugin-injected translations synchronously from DOM.
  // Runs once as a lazy initializer — before first paint, zero FOUC.
  const [ssrData] = useState(readSSRData);

  // Resolve config: explicit props win over SSR-injected data
  const project = propProject || ssrData?.project;
  if (!project) {
    throw new Error(
      "[better-i18n] `project` is required. Pass it as a prop to BetterI18nProvider " +
      "or use the @better-i18n/vite plugin.",
    );
  }

  const initialLocale = propLocale || ssrData?.locale || "en";
  const initialMessages = propMessages || ssrData?.messages;
  const initialLanguages = propInitialLanguages || ssrData?.languages;
  const localeCookie = ssrData?.localeCookie;

  // ─── Locale State ─────────────────────────────────────────────────
  const [managedLocale, setManagedLocale] = useState(initialLocale);

  // Sync when external prop changes (e.g., router navigation updates propLocale)
  useEffect(() => {
    if (propLocale) setManagedLocale(propLocale);
  }, [propLocale]);

  const locale = managedLocale;

  // setLocale: updates internal state, persists cookie, updates URL, notifies parent
  const setLocale = useCallback(
    (newLocale: string) => {
      setManagedLocale(newLocale);

      // Persist locale to cookie (if plugin provided cookie name)
      if (localeCookie && typeof document !== "undefined") {
        document.cookie = `${localeCookie}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      }

      // Update URL locale prefix — only when no external router handles it.
      // When onLocaleChange is provided, the consumer (e.g., react-router navigate())
      // is responsible for URL updates. Running both causes dual-write race conditions.
      if (onLocaleChange) {
        onLocaleChange(newLocale);
      } else if (typeof window !== "undefined" && window.location) {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        const firstSegment = segments[0];
        if (firstSegment && /^[a-z]{2}$/i.test(firstSegment)) {
          segments[0] = newLocale;
        } else {
          segments.unshift(newLocale);
        }
        window.history.replaceState(null, "", "/" + segments.join("/") + window.location.search);
      }
    },
    [onLocaleChange, localeCookie],
  );

  // ─── Messages State ───────────────────────────────────────────────
  // Track the locale that initial messages were **actually built for**.
  // When messages come from SSR (vite plugin), their locale is ssrData.locale.
  // When messages come from props, their locale matches propLocale (or initialLocale).
  // This distinction prevents a critical bug: propLocale="tr" + ssrData.messages="en"
  // would incorrectly mark English messages as fresh for Turkish, skipping CDN fetch.
  const initialMessagesLocale = propMessages
    ? initialLocale          // prop messages: trust the resolved locale
    : ssrData?.locale;       // SSR messages: trust the SSR-injected locale
  const initialMessagesLocaleRef = useRef(initialMessages ? initialMessagesLocale : undefined);

  const [clientMessages, setClientMessages] = useState<Messages | undefined>();

  // Use initial messages only when they match the current locale.
  // After locale switch, fall through to clientMessages (CDN-fetched).
  const isInitialMessagesFresh = initialMessages && initialMessagesLocaleRef.current === locale;
  const messages = isInitialMessagesFresh ? initialMessages : (clientMessages ?? initialMessages);
  const [languages, setLanguages] = useState<LanguageOption[]>(initialLanguages ?? []);
  const [isLoadingMessages, setIsLoadingMessages] = useState(initialMessages === undefined);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(!initialLanguages);

  // Create i18n core instance
  const i18nCore = useMemo(
    () =>
      createI18nCore({
        project,
        defaultLocale: locale,
        cdnBaseUrl,
        debug,
        logLevel,
        fetch: customFetch,
        storage,
        staticData,
        fetchTimeout,
        retryCount,
      }),
    [project, locale, cdnBaseUrl, debug, logLevel, customFetch, storage, staticData, fetchTimeout, retryCount]
  );

  // Load languages on mount — skip if SSR already provided them
  useEffect(() => {
    if (initialLanguages) return;

    let cancelled = false;

    const loadLanguages = async () => {
      try {
        const langs = await i18nCore.getLanguages();
        if (!cancelled) {
          setLanguages(langs);
        }
      } catch (error) {
        console.error("[better-i18n] Failed to load languages:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingLanguages(false);
        }
      }
    };

    loadLanguages();

    return () => {
      cancelled = true;
    };
  }, [i18nCore, initialLanguages]);

  // Load messages when locale changes.
  // Skip when initial messages (prop or SSR) are still fresh for the current locale.
  useEffect(() => {
    if (initialMessages && initialMessagesLocaleRef.current === locale) {
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      setIsLoadingMessages(true);

      try {
        const msgs = await i18nCore.getMessages(locale);
        if (!cancelled) {
          setClientMessages(msgs as Messages);
        }
      } catch (error) {
        console.error(
          `[better-i18n] Failed to load messages for locale "${locale}":`,
          error
        );
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [locale, i18nCore, initialMessages]);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      languages,
      isLoadingLanguages,
      isLoadingMessages,
      project,
      localePrefix,
    }),
    [locale, setLocale, languages, isLoadingLanguages, isLoadingMessages, project, localePrefix]
  );

  if (!messages) {
    // Render children with empty messages instead of blanking the screen.
    // This converts a full DOM structural mismatch (null vs full tree)
    // into a text content mismatch — React recovers silently and re-renders
    // once the loader delivers real messages.
    return (
      <BetterI18nContext.Provider value={contextValue}>
        <IntlProvider
          locale={locale}
          messages={{}}
          timeZone={timeZone}
          onError={() => {}}
          getMessageFallback={customGetMessageFallback}
        >
          {children as never}
        </IntlProvider>
      </BetterI18nContext.Provider>
    );
  }

  return (
    <BetterI18nContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
        now={now}
        onError={onError ?? (() => {})}
        getMessageFallback={customGetMessageFallback}
      >
        {children as never}
      </IntlProvider>
    </BetterI18nContext.Provider>
  );
}
