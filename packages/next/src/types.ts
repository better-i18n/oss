// Re-export common types from i18n-core
export type {
  Locale,
  LogLevel,
  ManifestLanguage,
  ManifestFile,
  ManifestResponse,
  LanguageOption,
  Messages,
  Logger,
  ParsedProject,
} from "@better-i18n/core";

import type { I18nCoreConfig, NormalizedConfig as CoreNormalizedConfig } from "@better-i18n/core";

// Next.js-specific types

export type LocalePrefix = "as-needed" | "always" | "never";

/**
 * Next.js i18n configuration (extends core config)
 */
export interface I18nConfig extends I18nCoreConfig {
  /**
   * URL locale prefix behavior
   * @default "as-needed"
   */
  localePrefix?: LocalePrefix;

  /**
   * Cookie name used for locale persistence when localePrefix is "never"
   * @default "locale"
   */
  cookieName?: string;

  /**
   * Next.js ISR revalidation time for manifest (seconds)
   * @default 3600
   */
  manifestRevalidateSeconds?: number;

  /**
   * Next.js ISR revalidation time for messages (seconds)
   * @default 30
   */
  messagesRevalidateSeconds?: number;
}

/**
 * Normalized Next.js config with defaults
 */
export interface NormalizedConfig extends CoreNormalizedConfig, Omit<I18nConfig, keyof I18nCoreConfig> {
  localePrefix: LocalePrefix;
  cookieName: string;
  manifestRevalidateSeconds: number;
  messagesRevalidateSeconds: number;
}

/**
 * Next.js fetch request init with ISR options
 */
export type NextFetchRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};
