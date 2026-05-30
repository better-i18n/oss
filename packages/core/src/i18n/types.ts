export type LocalePrefix = "as-needed" | "always" | "never";

export interface I18nMiddlewareConfig {
  project: string;
  defaultLocale: string;
  /**
   * URL locale prefix behavior (passed to next-intl middleware)
   * @default "as-needed"
   */
  localePrefix?: LocalePrefix;
  detection?: {
    cookie?: boolean; // default: true
    browserLanguage?: boolean; // default: true
    cookieName?: string; // default: 'locale'
    cookieMaxAge?: number; // default: 31536000 (1 year)
    /**
     * Name of the cookie that marks a locale as an *explicit* user choice
     * (set only by `useSetLocale()` on the client — never auto-written by the
     * middleware). Lets a callback distinguish "the user deliberately picked
     * this language" from "we auto-detected/persisted it", which is what you
     * need to apply a tenant/org default without overriding a real choice.
     *
     * @default `${cookieName}_explicit` (e.g. "locale_explicit")
     */
    explicitCookieName?: string;
  };
}

export interface LocaleDetectionOptions {
  project: string;
  defaultLocale: string;
  pathLocale?: string | null;
  cookieLocale?: string | null;
  headerLocale?: string | null;
  /**
   * ISO 3166-1 alpha-2 country code from geo-IP detection.
   * Pass this from your edge platform:
   * - Cloudflare Workers: `request.cf?.country`
   * - Vercel Edge: `request.geo?.country`
   * - Node.js behind CF: `request.headers.get("CF-IPCountry")`
   *
   * Used with `countryLocaleMap` to resolve country → locale.
   * Priority: path > cookie > geo (country) > header > default
   */
  countryCode?: string | null;
  /**
   * Country code → locale mapping. Built from CDN manifest's
   * `languages[].countryCode` field via `buildCountryLocaleMap()`.
   *
   * If not provided but `countryCode` is set, falls back to
   * `LANGUAGE_TO_COUNTRY` reverse lookup from core.
   */
  countryLocaleMap?: Record<string, string>;
  availableLocales: string[];
}

export interface LocaleDetectionResult {
  locale: string;
  detectedFrom: "path" | "cookie" | "geo" | "header" | "default";
  shouldSetCookie: boolean;
}
