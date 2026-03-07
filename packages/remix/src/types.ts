import type { I18nCoreConfig, LanguageOption, Messages } from "@better-i18n/core";

/**
 * Configuration for createRemixI18n() — mirrors I18nCoreConfig exactly
 */
export type RemixI18nConfig = I18nCoreConfig;

/**
 * Remix/Hydrogen i18n instance returned by createRemixI18n()
 */
export interface RemixI18n {
  /**
   * Resolved configuration
   */
  config: I18nCoreConfig;

  /**
   * Detect locale from a Remix Request (uses Accept-Language header).
   * Falls back to defaultLocale when no match is found.
   */
  detectLocale(request: Request): Promise<string>;

  /**
   * Get all messages for a locale (CDN + cache).
   * Returns namespaced messages: `{ "common": { "hello": "Hello" }, "account": { ... } }`
   */
  getMessages(locale: string): Promise<Messages>;

  /**
   * Get available locale codes from the CDN manifest
   */
  getLocales(): Promise<string[]>;

  /**
   * Get language options with metadata (for UI rendering)
   */
  getLanguages(): Promise<LanguageOption[]>;
}
