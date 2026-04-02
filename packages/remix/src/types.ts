import type { I18nCoreConfig, LanguageOption, Messages } from "@better-i18n/core";

export type LocalePrefix = "as-needed" | "always" | "never";

/**
 * Configuration for createRemixI18n()
 */
export interface RemixI18nConfig extends I18nCoreConfig {
  /**
   * URL locale prefix behavior — mirrors @better-i18n/next and use-intl.
   *
   * - `"as-needed"` (default): only non-default locales get a URL prefix.
   *     `/about` → default locale, `/tr/about` → Turkish
   * - `"always"`: every locale gets a URL prefix including the default.
   *     `/en/about` → English, `/tr/about` → Turkish
   * - `"never"`: no URL prefix for any locale; detection falls back to
   *     cookie → Accept-Language header → defaultLocale.
   *     Useful for single-country apps that don't want locale slugs in URLs.
   *
   * @default "as-needed"
   */
  localePrefix?: LocalePrefix;

  /**
   * Cookie name used for locale persistence (primarily for `localePrefix: "never"`).
   * @default "locale"
   */
  cookieName?: string;
}

/**
 * Resolved config with defaults applied
 */
export interface NormalizedRemixConfig extends RemixI18nConfig {
  localePrefix: LocalePrefix;
  cookieName: string;
}

/**
 * Remix/Hydrogen i18n instance returned by createRemixI18n()
 */
export interface RemixI18n {
  /**
   * Resolved configuration (including defaults)
   */
  config: NormalizedRemixConfig;

  /**
   * Detect locale from a Remix Request — the recommended method.
   *
   * Respects `localePrefix` config:
   * - `"as-needed"` / `"always"`: extracts from URL path, validated against
   *   CDN language list (falls back to BCP 47 regex on cold start / CDN miss).
   * - `"never"`: reads locale cookie → Accept-Language header → defaultLocale.
   *
   * @example
   * // server.ts — use instead of a custom locale-detection function
   * const locale = await i18n.getLocaleFromRequest(request);
   */
  getLocaleFromRequest(request: Request): Promise<string>;

  /**
   * Build a locale-prefixed path respecting `localePrefix` config.
   *
   * @example
   * // localePrefix: "as-needed", defaultLocale: "en"
   * i18n.buildLocalePath("/about", "tr")  // "/tr/about"
   * i18n.buildLocalePath("/about", "en")  // "/about"
   *
   * // localePrefix: "always"
   * i18n.buildLocalePath("/about", "en")  // "/en/about"
   *
   * // localePrefix: "never"
   * i18n.buildLocalePath("/about", "tr")  // "/about"
   */
  buildLocalePath(path: string, locale: string): string;

  /**
   * Replace the locale prefix in an existing path.
   *
   * @example
   * i18n.replaceLocaleInPath("/tr/about", "de")  // "/de/about"
   * i18n.replaceLocaleInPath("/about", "tr")     // "/tr/about"
   */
  replaceLocaleInPath(path: string, newLocale: string): string;

  /**
   * @deprecated Use `getLocaleFromRequest` instead — it respects `localePrefix`.
   * Detects locale from Accept-Language header only (ignores URL path).
   */
  detectLocale(request: Request): Promise<string>;

  /**
   * Returns a `Set-Cookie` header value that persists the given locale.
   * Returns `null` if the cookie already matches (avoids redundant headers).
   *
   * Append this to your Response so returning visitors get their previously
   * chosen language — works with any hosting provider, no geo-IP required.
   *
   * @example
   * ```ts
   * const response = await handleRequest(request);
   * const cookie = i18n.getLocaleCookieHeader(locale, request);
   * if (cookie) response.headers.append("Set-Cookie", cookie);
   * return response;
   * ```
   */
  getLocaleCookieHeader(locale: string, request?: Request): string | null;

  /**
   * Get all messages for a locale (CDN + TtlCache).
   */
  getMessages(locale: string): Promise<Messages>;

  /**
   * Get available locale codes from the CDN manifest.
   */
  getLocales(): Promise<string[]>;

  /**
   * Get language options with metadata (for UI rendering).
   */
  getLanguages(): Promise<LanguageOption[]>;
}
