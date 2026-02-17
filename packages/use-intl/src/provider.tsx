"use client";

import { createI18nCore } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { IntlProvider } from "use-intl";
import { BetterI18nContext } from "./context.js";
import type { BetterI18nProviderConfig, Messages } from "./types.js";

export interface BetterI18nProviderProps extends BetterI18nProviderConfig {
  children: ReactNode;
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
}: BetterI18nProviderProps) {
  // Locale is controlled by props (from URL/router)
  const locale = propLocale;
  const [messages, setMessages] = useState<Messages | undefined>(propMessages);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(!propMessages);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

  // Sync messages when props change (e.g., from router navigation with new loader data)
  useEffect(() => {
    if (propMessages) {
      setMessages(propMessages);
      setIsLoadingMessages(false);
    }
  }, [propMessages]);

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

  // Load languages on mount
  useEffect(() => {
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
  }, [i18nCore]);

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
          setMessages(msgs as Messages);
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

  // Don't render until we have messages
  if (!messages) {
    return null;
  }

  return (
    <BetterI18nContext.Provider value={contextValue}>
      <IntlProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
        now={now}
        onError={onError}
      >
        {children}
      </IntlProvider>
    </BetterI18nContext.Provider>
  );
}
