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
  };
}

export interface LocaleDetectionOptions {
  project: string;
  defaultLocale: string;
  pathLocale?: string | null;
  cookieLocale?: string | null;
  headerLocale?: string | null;
  availableLocales: string[];
}

export interface LocaleDetectionResult {
  locale: string;
  detectedFrom: "path" | "cookie" | "header" | "default";
  shouldSetCookie: boolean;
}
