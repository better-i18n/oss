"use client";

import { createI18nCore, getLocaleCookie } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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

/** BCP 47 locale tag for URL segment detection. */
const LOCALE_RE = /^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/;

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
   * - `"never"`: no locale prefix in URL for any locale. Locale is stored only in cookie.
   *   Ideal for dashboards and apps where URL structure shouldn't change per locale.
   * @default "as-needed"
   */
  localePrefix?: "always" | "as-needed" | "never";
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

  /**
   * Persist the active locale to a cookie so returning visitors
   * get their previously chosen language — even without geo-IP detection.
   *
   * - `true` — uses the default cookie name `"locale"`
   * - `string` — custom cookie name (e.g., `"preferred-locale"`)
   * - `false` / `undefined` — no persistence (default)
   *
   * **Read + write:** On mount, reads the cookie as a fallback when no SSR
   * data is available (SPA/static builds). On every locale change, writes
   * the cookie so the server can read it on the next visit.
   *
   * **Same name everywhere:** Use the same cookie name on the server
   * (`localeCookie` on `createBetterAuthProvider` or Vite plugin) and
   * in non-React code (`getLocaleCookie()` from `@better-i18n/core`).
   *
   * @example
   * ```tsx
   * <BetterI18nProvider project="acme/web" localeCookie>
   *   <App />
   * </BetterI18nProvider>
   * ```
   *
   * @example
   * ```tsx
   * // Custom cookie name — must match server-side localeCookie option
   * <BetterI18nProvider project="acme/web" localeCookie="preferred-locale">
   *   <App />
   * </BetterI18nProvider>
   * ```
   *
   * @default false
   */
  localeCookie?: boolean | string;
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
  localeCookie: localeCookieProp = false,
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

  const initialMessages = propMessages || ssrData?.messages;
  const initialLanguages = propInitialLanguages || ssrData?.languages;

  // Resolve cookie name: prop > Vite plugin SSR data > none
  // Same name is used for both reading (init) and writing (on locale change).
  const cookieName = localeCookieProp === true
    ? "locale"
    : localeCookieProp || ssrData?.localeCookie || undefined;

  // ─── Locale State ─────────────────────────────────────────────────
  // Use a lazy initializer so cookie reads run exactly once (not on every render).
  // Locale resolution chain: prop → SSR → cookie → "en"
  const [managedLocale, setManagedLocale] = useState(() =>
    propLocale
    || ssrData?.locale
    || (cookieName ? getLocaleCookie(cookieName) : null)
    || "en"
  );

  // Sync when external prop changes (e.g., router navigation updates propLocale)
  useEffect(() => {
    if (propLocale) setManagedLocale(propLocale);
  }, [propLocale]);

  const locale = managedLocale;

  // ─── Locale Persistence ──────────────────────────────────────────
  // Write locale cookie on every change (including initial mount).
  // This ensures returning visitors get their last-used language even
  // without geo-IP detection (not everyone uses Cloudflare).
  useEffect(() => {
    if (!cookieName || typeof document === "undefined") return;
    document.cookie = `${cookieName}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }, [locale, cookieName]);

  // setLocale: updates internal state, persists cookie, updates URL, notifies parent
  const setLocale = useCallback(
    (newLocale: string) => {
      setManagedLocale(newLocale);

      // Write cookie immediately (before onLocaleChange navigation).
      if (cookieName && typeof document !== "undefined") {
        document.cookie = `${cookieName}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
      }

      // Notify consumer (e.g., router navigation)
      if (onLocaleChange) {
        onLocaleChange(newLocale);
        return;
      }

      // "never" mode: locale is cookie-only, don't touch the URL at all
      if (localePrefix === "never") {
        return;
      }

      // Update URL locale prefix — fallback when no external router handles it.
      if (typeof window !== "undefined" && window.location) {
        const path = window.location.pathname;
        const segments = path.split("/").filter(Boolean);
        const firstSegment = segments[0];
        const supportedLocales = ssrData?.supportedLocales;
        // Match BCP 47 tags: "en", "pt-BR", "zh-Hans" (2-8 alpha + optional subtags)
        const isLocaleSegment =
          firstSegment !== undefined &&
          LOCALE_RE.test(firstSegment) &&
          (!supportedLocales || supportedLocales.includes(firstSegment));
        if (isLocaleSegment) {
          segments[0] = newLocale;
        } else {
          segments.unshift(newLocale);
        }
        window.history.replaceState(null, "", `/${segments.join("/")}${window.location.search}`);
      }
    },
    [onLocaleChange, cookieName, localePrefix, ssrData],
  );

  // ─── Messages State ───────────────────────────────────────────────
  // Track the locale that initial messages were **actually built for**.
  // When messages come from SSR (vite plugin), their locale is ssrData.locale.
  // When messages come from props, their locale matches managedLocale at mount time.
  // This distinction prevents a critical bug: propLocale="tr" + ssrData.messages="en"
  // would incorrectly mark English messages as fresh for Turkish, skipping CDN fetch.
  //
  // Stored in state (not derived on each render) so it stays anchored to mount-time
  // values even after locale switches cause re-renders.
  const [initialMessagesLocale] = useState(() =>
    propMessages ? managedLocale : ssrData?.locale
  );

  const [clientMessages, setClientMessages] = useState<Messages | undefined>();

  // Use initial messages only when they match the current locale.
  // After locale switch, fall through to clientMessages (CDN-fetched).
  const isInitialMessagesFresh = initialMessages && initialMessagesLocale === locale;
  const messages = isInitialMessagesFresh ? initialMessages : (clientMessages ?? initialMessages);
  const [languages, setLanguages] = useState<LanguageOption[]>(initialLanguages ?? []);
  const [isLoadingMessages, setIsLoadingMessages] = useState(initialMessages === undefined);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(!initialLanguages);

  // Capture the locale that was active at mount — used as `defaultLocale` for
  // the core instance. This must NOT change on locale switches: the core's
  // `defaultLocale` is a startup hint for the CDN client, not the live locale.
  // Putting `locale` in the deps would recreate the core (and its TtlCache) on
  // every language switch, defeating the in-memory cache entirely.
  const [mountLocale] = useState(locale);

  // Create i18n core instance — stable for the lifetime of the provider.
  const i18nCore = useMemo(
    () =>
      createI18nCore({
        project,
        defaultLocale: mountLocale,
        cdnBaseUrl,
        debug,
        logLevel,
        fetch: customFetch,
        storage,
        staticData,
        fetchTimeout,
        retryCount,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project, cdnBaseUrl, debug, logLevel, customFetch, storage, staticData, fetchTimeout, retryCount]
    // `mountLocale` intentionally excluded — it never changes after mount.
    // `locale` intentionally excluded — see comment above.
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
    if (initialMessages && initialMessagesLocale === locale) {
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
