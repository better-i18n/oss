import type { I18nCoreConfig, LanguageOption } from "@better-i18n/core";
import type { ComponentProps } from "react";
import type { IntlProvider } from "use-intl";

/**
 * Messages type (compatible with use-intl)
 */
export type Messages = ComponentProps<typeof IntlProvider>["messages"];

/**
 * Configuration for BetterI18nProvider
 */
export interface BetterI18nProviderConfig
  extends Omit<I18nCoreConfig, "defaultLocale"> {
  /**
   * Current locale
   */
  locale: string;

  /**
   * Pre-loaded messages (for SSR hydration)
   */
  messages?: Messages;

  /**
   * Timezone for date/time formatting
   * @default undefined (uses browser timezone)
   */
  timeZone?: string;

  /**
   * Current date/time (useful for SSR to prevent hydration mismatches)
   */
  now?: Date;

  /**
   * Error handler for missing translations
   */
  onError?: ComponentProps<typeof IntlProvider>["onError"];
}

/**
 * Better i18n context value
 *
 * Note: Locale is read-only. Use useLocaleRouter().navigate() for locale changes
 * to ensure proper router integration.
 */
export interface BetterI18nContextValue {
  /**
   * Current locale (read-only - use useLocaleRouter().navigate() to change)
   */
  locale: string;

  /**
   * Available languages with metadata from CDN manifest
   */
  languages: LanguageOption[];

  /**
   * Whether languages are still loading from CDN
   */
  isLoadingLanguages: boolean;

  /**
   * Whether messages are still loading
   */
  isLoadingMessages: boolean;

  /**
   * Project identifier
   */
  project: string;
}

/**
 * Server-side configuration for getMessages
 */
export interface GetMessagesConfig extends I18nCoreConfig {
  /**
   * Locale to fetch messages for
   */
  locale: string;
}
