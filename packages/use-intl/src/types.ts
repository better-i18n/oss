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
 * Use `setLocale()` for locale switching. In router-based apps,
 * the provider's `onLocaleChange` callback handles navigation.
 */
export interface BetterI18nContextValue {
  /**
   * Current locale
   */
  locale: string;

  /**
   * Change the active locale.
   * Updates internal state and triggers message loading.
   * In router-based apps, also fires the `onLocaleChange` callback
   * so the parent can handle URL navigation.
   */
  setLocale: (locale: string) => void;

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

  /**
   * URL prefix strategy for locale codes.
   * - `"as-needed"`: default locale has no URL prefix
   * - `"always"`: all locales get a URL prefix (e.g., TanStack Router `$locale/`)
   * - `"never"`: no locale prefix in URL for any locale (cookie-only, ideal for dashboards)
   */
  localePrefix: "always" | "as-needed" | "never";
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
