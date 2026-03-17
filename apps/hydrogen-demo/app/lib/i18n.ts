import type {
  LanguageCode,
  CountryCode,
} from "@shopify/hydrogen/storefront-api-types";
import type { LanguageOption } from "@better-i18n/remix";

export interface I18nLocale {
  language: LanguageCode;
  country: CountryCode;
  pathPrefix: string;
}

/**
 * Derives Shopify Storefront API locale enums from a Better i18n locale code.
 * Better i18n uses lowercase ("en", "tr"), Shopify uses uppercase enums (EN, TR).
 *
 * Supports both simple ("tr") and compound ("en-gb") locale formats.
 * "en" without a region defaults to country "US" (most common Shopify use case).
 */
function deriveShopifyLocale(code: string, isDefault: boolean): I18nLocale {
  const [lang, country] = code.toLowerCase().split("-");
  return {
    language: lang.toUpperCase() as LanguageCode,
    country: (
      country ?? (lang === "en" ? "us" : lang)
    ).toUpperCase() as CountryCode,
    pathPrefix: isDefault ? "" : `/${code}`,
  };
}

/**
 * Extract locale from URL path prefix, validated against CDN language list.
 *
 * /tr/products/hat → "tr"
 * /products/hat    → defaultLocale (default)
 */
export function getLocaleFromRequest(
  request: Request,
  languages: LanguageOption[],
  defaultLocale = "en",
): { locale: string; i18n: I18nLocale } {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split("/")[1]?.toLowerCase();

  if (
    firstSegment &&
    firstSegment !== defaultLocale &&
    languages.some((l) => l.code === firstSegment)
  ) {
    return {
      locale: firstSegment,
      i18n: deriveShopifyLocale(firstSegment, false),
    };
  }

  return {
    locale: defaultLocale,
    i18n: deriveShopifyLocale(defaultLocale, true),
  };
}
