import type { LocaleDetectionOptions, LocaleDetectionResult } from "./types.js";
import type { LanguageOption } from "../types.js";
import { normalizeLocale } from "../utils/locale.js";
import { LANGUAGE_TO_COUNTRY } from "../utils/locale-ui.js";

/** Case-insensitive locale lookup — returns the canonical (CDN) form if matched */
const findLocale = (code: string | null | undefined, available: string[]) =>
  code ? available.find((a) => normalizeLocale(a) === normalizeLocale(code)) : undefined;

/**
 * Build a country→locale map from CDN manifest languages.
 *
 * Uses each language's `countryCode` field as the primary source
 * (set in the Better i18n dashboard). Falls back to `LANGUAGE_TO_COUNTRY`
 * reverse lookup for languages without explicit country codes.
 *
 * Also includes multi-country overrides (e.g. AT→de, MX→es) so that
 * visitors from countries sharing a language are correctly mapped.
 *
 * @example
 * ```ts
 * const languages = await i18n.getLanguages();
 * const countryMap = buildCountryLocaleMap(languages);
 * // { tr: "tr", de: "de", jp: "ja", cn: "zh-hans", at: "de", mx: "es", ... }
 * ```
 */
export function buildCountryLocaleMap(
  languages: LanguageOption[],
): Record<string, string> {
  const map: Record<string, string> = {};
  const availableCodes = new Set(languages.map((l) => l.code));

  // Primary: manifest countryCode → locale code
  for (const lang of languages) {
    if (lang.countryCode) {
      map[lang.countryCode.toLowerCase()] = lang.code;
    }
  }

  // Secondary: reverse LANGUAGE_TO_COUNTRY for languages with no countryCode
  for (const lang of languages) {
    if (!lang.countryCode) {
      const country = LANGUAGE_TO_COUNTRY[lang.code]
        || LANGUAGE_TO_COUNTRY[lang.code.split("-")[0]];
      if (country && !map[country]) {
        map[country] = lang.code;
      }
    }
  }

  // Multi-country overrides: countries whose primary language is available
  // but they aren't the "home country" for that language
  const MULTI_COUNTRY: Record<string, string> = {
    // German-speaking
    at: "de", ch: "de", li: "de",
    // French-speaking
    be: "fr", lu: "fr", mc: "fr",
    // Spanish-speaking
    mx: "es", ar: "es", co: "es", cl: "es", pe: "es",
    ve: "es", ec: "es", gt: "es", cu: "es", do: "es",
    hn: "es", sv: "es", ni: "es", cr: "es", pa: "es",
    uy: "es", py: "es", bo: "es",
    // Portuguese-speaking
    br: "pt-br", ao: "pt", mz: "pt",
    // Arabic-speaking
    ae: "ar", eg: "ar", ma: "ar", dz: "ar", iq: "ar",
    kw: "ar", qa: "ar", bh: "ar", om: "ar", jo: "ar", lb: "ar",
    // Chinese-speaking
    sg: "zh-hans", tw: "zh-hans", hk: "zh-hans", mo: "zh-hans",
    // English-speaking (fallback)
    us: "en", gb: "en", au: "en", nz: "en", ca: "en", ie: "en",
    // Russian-speaking
    by: "ru", kz: "ru", kg: "ru",
    // Malay-speaking
    bn: "ms",
  };

  for (const [country, locale] of Object.entries(MULTI_COUNTRY)) {
    if (!map[country] && availableCodes.has(locale)) {
      map[country] = locale;
    }
  }

  return map;
}

/**
 * Framework-agnostic locale detection with geo-IP support.
 *
 * Detection priority: path > cookie > geo (country) > Accept-Language header > default
 *
 * @example
 * ```ts
 * // In your middleware/loader:
 * const languages = await i18n.getLanguages();
 * const countryMap = buildCountryLocaleMap(languages);
 *
 * const result = detectLocale({
 *   project: "acme/web",
 *   defaultLocale: "en",
 *   availableLocales: languages.map(l => l.code),
 *   pathLocale: getLocaleFromURL(pathname),
 *   cookieLocale: getCookie("locale"),
 *   countryCode: request.cf?.country,     // Cloudflare
 *   // countryCode: request.geo?.country,  // Vercel
 *   countryLocaleMap: countryMap,
 *   headerLocale: parseAcceptLanguage(request),
 * });
 *
 * // result.locale = "tr"
 * // result.detectedFrom = "geo"
 * ```
 */
export function detectLocale(
  options: LocaleDetectionOptions,
): LocaleDetectionResult {
  const {
    pathLocale,
    cookieLocale,
    headerLocale,
    countryCode,
    countryLocaleMap,
    defaultLocale,
    availableLocales,
  } = options;

  let locale: string;
  let detectedFrom: LocaleDetectionResult["detectedFrom"];

  // Priority: path > cookie > geo > header > default
  const pathMatch = findLocale(pathLocale, availableLocales);
  const cookieMatch = findLocale(cookieLocale, availableLocales);
  const geoMatch = resolveGeoLocale(countryCode, countryLocaleMap, availableLocales);
  const headerMatch = findLocale(headerLocale, availableLocales);

  if (pathMatch) {
    locale = pathMatch;
    detectedFrom = "path";
  } else if (cookieMatch) {
    locale = cookieMatch;
    detectedFrom = "cookie";
  } else if (geoMatch) {
    locale = geoMatch;
    detectedFrom = "geo";
  } else if (headerMatch) {
    locale = headerMatch;
    detectedFrom = "header";
  } else {
    locale = defaultLocale;
    detectedFrom = "default";
  }

  // Should set cookie if locale differs from current cookie
  const shouldSetCookie = cookieLocale !== locale;

  return { locale, detectedFrom, shouldSetCookie };
}

/**
 * Built-in multi-country overrides for countries that share a language
 * with another country already in LANGUAGE_TO_COUNTRY.
 * This allows geo detection to work without a manifest-driven map.
 */
const BUILT_IN_COUNTRY_OVERRIDES: Record<string, string> = {
  // German-speaking
  at: "de", ch: "de", li: "de",
  // French-speaking
  be: "fr", lu: "fr", mc: "fr",
  // Spanish-speaking
  mx: "es", ar: "es", co: "es", cl: "es", pe: "es",
  ve: "es", ec: "es", gt: "es", cu: "es", hn: "es",
  sv: "es", ni: "es", cr: "es", pa: "es", uy: "es",
  py: "es", bo: "es", do: "es",
  // Portuguese-speaking
  br: "pt", ao: "pt", mz: "pt",
  // Arabic-speaking
  ae: "ar", eg: "ar", ma: "ar", dz: "ar", iq: "ar",
  kw: "ar", qa: "ar", bh: "ar", om: "ar", jo: "ar", lb: "ar",
  // Chinese-speaking
  sg: "zh", tw: "zh", hk: "zh", mo: "zh",
  // Russian-speaking
  by: "ru", kz: "ru", kg: "ru",
  // Malay-speaking
  bn: "ms",
  // English-speaking
  us: "en", au: "en", nz: "en", ca: "en", ie: "en",
};

/**
 * Fuzzy locale match — finds a locale in available list even when the
 * base language matches but the full code differs.
 * e.g., lang="zh", available=["zh-hans"] → returns "zh-hans"
 * e.g., lang="pt", available=["pt-br", "pt"] → returns "pt"
 */
function fuzzyFindLocale(lang: string, available: string[]): string | undefined {
  // Exact match first
  const exact = findLocale(lang, available);
  if (exact) return exact;

  // Base language match (zh → zh-hans, pt → pt-br)
  const base = lang.split("-")[0].toLowerCase();
  return available.find((a) => a.toLowerCase().startsWith(base + "-"))
    ?? available.find((a) => a.toLowerCase() === base);
}

/**
 * Resolve a country code to a locale.
 *
 * Resolution chain:
 * 1. Explicit countryLocaleMap (manifest-driven, most accurate)
 * 2. LANGUAGE_TO_COUNTRY reverse lookup (built-in)
 * 3. BUILT_IN_COUNTRY_OVERRIDES (multi-country fallback)
 *
 * All lookups use fuzzy matching so zh→zh-hans, pt→pt-br work.
 */
function resolveGeoLocale(
  countryCode: string | null | undefined,
  countryLocaleMap: Record<string, string> | undefined,
  availableLocales: string[],
): string | undefined {
  if (!countryCode) return undefined;

  const normalized = countryCode.toLowerCase();

  // 1. Explicit map (manifest-driven)
  if (countryLocaleMap) {
    const mapped = countryLocaleMap[normalized];
    if (mapped) {
      const match = fuzzyFindLocale(mapped, availableLocales);
      if (match) return match;
    }
  }

  // 2. Reverse LANGUAGE_TO_COUNTRY (e.g., tr→"tr", ja→"jp")
  for (const [lang, country] of Object.entries(LANGUAGE_TO_COUNTRY)) {
    if (country === normalized) {
      const match = fuzzyFindLocale(lang, availableLocales);
      if (match) return match;
    }
  }

  // 3. Multi-country overrides (e.g., AT→de, MX→es, BR→pt)
  const override = BUILT_IN_COUNTRY_OVERRIDES[normalized];
  if (override) {
    const match = fuzzyFindLocale(override, availableLocales);
    if (match) return match;
  }

  return undefined;
}
