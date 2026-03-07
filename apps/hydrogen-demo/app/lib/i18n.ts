import type { LanguageCode, CountryCode } from "@shopify/hydrogen/storefront-api-types";

export interface I18nLocale {
  language: LanguageCode;
  country: CountryCode;
  pathPrefix: string;
}

/**
 * Maps Better i18n locale codes to Shopify Storefront API enums.
 * Better i18n uses lowercase strings ("en", "tr"), while
 * Shopify uses uppercase enums (EN, TR) with country codes.
 */
export const SUPPORTED_LOCALES: Record<string, I18nLocale> = {
  en: { language: "EN", country: "US", pathPrefix: "" },
  tr: { language: "TR", country: "TR", pathPrefix: "/tr" },
  es: { language: "ES", country: "ES", pathPrefix: "/es" },
  fr: { language: "FR", country: "FR", pathPrefix: "/fr" },
  de: { language: "DE", country: "DE", pathPrefix: "/de" },
};

export const DEFAULT_LOCALE = SUPPORTED_LOCALES.en;

/**
 * Extract locale from URL path prefix.
 *
 * /tr/products/hat → "tr"
 * /products/hat    → "en" (default)
 */
export function getLocaleFromRequest(request: Request): {
  locale: string;
  i18n: I18nLocale;
} {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split("/")[1]?.toLowerCase();

  if (firstSegment && firstSegment in SUPPORTED_LOCALES && firstSegment !== "en") {
    return {
      locale: firstSegment,
      i18n: SUPPORTED_LOCALES[firstSegment],
    };
  }

  return { locale: "en", i18n: DEFAULT_LOCALE };
}
