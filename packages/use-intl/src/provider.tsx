"use client";

import { createI18nCore } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IntlProvider } from "use-intl";
import { BetterI18nContext } from "./context.js";
import type { BetterI18nProviderConfig, Messages } from "./types.js";

export interface BetterI18nProviderProps extends BetterI18nProviderConfig {
  children: ReactNode;
  /** Pre-loaded languages from SSR loader — skips loading state on first render */
  initialLanguages?: LanguageOption[];
  /** Custom fallback when a message key is missing */
  getMessageFallback?: (info: {
    error: Error;
    key: string;
    namespace?: string;
  }) => string;
}

/**
 * Provider component that combines Better i18n CDN with use-intl
 *
 * The locale is controlled externally (from URL/router). Use useLocaleRouter()
 * for locale switching with proper router integration.
 *
 * @example
 * ```tsx
 * // Basic usage (CSR - fetches messages on client)
 * function App() {
 *   return (
 *     <BetterI18nProvider
 *       project="acme/dashboard"
 *       locale="en"
 *     >
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
  project,
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
  initialLanguages,
  getMessageFallback: customGetMessageFallback,
}: BetterI18nProviderProps) {
  // Locale is controlled by props (from URL/router)
  const locale = propLocale;
  // clientMessages is only used in CSR mode (when propMessages is not provided).
  // In SSG/SSR mode, propMessages comes from the loader and is used directly —
  // synchronous derivation avoids the useEffect delay that causes white flash on hydration.
  const [clientMessages, setClientMessages] = useState<Messages | undefined>();
  const messages = propMessages ?? clientMessages;
  const [languages, setLanguages] = useState<LanguageOption[]>(initialLanguages ?? []);
  const [isLoadingMessages, setIsLoadingMessages] = useState(propMessages === undefined);
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

  // Load messages when locale changes and no pre-loaded messages available
  useEffect(() => {
    // Skip if we already have messages for this render
    if (propMessages) {
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
  }, [locale, i18nCore, propMessages]);

  // Context value (read-only locale - use useLocaleRouter for navigation)
  const contextValue = useMemo(
    () => ({
      locale,
      languages,
      isLoadingLanguages,
      isLoadingMessages,
      project,
    }),
    [locale, languages, isLoadingLanguages, isLoadingMessages, project]
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
