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

/** BCP 47 locale segment: "tr", "de", "zh-cn", "pt-br" etc. */
const LOCALE_SEGMENT = /^[a-z]{2}(-[a-z]{2})?$/;

/**
 * Extract locale from URL path prefix.
 *
 * Validates the segment against the CDN language list when available.
 * Falls back to a BCP 47 pattern check when the list is empty (cold start /
 * CDN miss) so the locale is never silently dropped to the default.
 *
 * /tr/products/hat → "tr"
 * /products/hat    → defaultLocale
 */
export function getLocaleFromRequest(
  request: Request,
  languages: LanguageOption[],
  defaultLocale = "en",
): { locale: string; i18n: I18nLocale } {
  const url = new URL(request.url);
  const firstSegment = url.pathname.split("/")[1]?.toLowerCase();

  if (firstSegment && firstSegment !== defaultLocale) {
    const inList =
      languages.length > 0
        ? languages.some((l) => l.code === firstSegment)
        : LOCALE_SEGMENT.test(firstSegment); // CDN unavailable — accept any BCP 47 code

    if (inList) {
      return {
        locale: firstSegment,
        i18n: deriveShopifyLocale(firstSegment, false),
      };
    }
  }

  return {
    locale: defaultLocale,
    i18n: deriveShopifyLocale(defaultLocale, true),
  };
}
