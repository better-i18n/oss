import { getLocales, getLanguages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";

let _cachedLocales: string[] | null = null;
let _cachedCountryToLocale: Record<string, string> | null = null;

/**
 * Fetch available locales from CDN manifest and cache them.
 * Call this once during app initialization (e.g., in root beforeLoad).
 */
export async function fetchLocales(): Promise<string[]> {
  if (_cachedLocales) return _cachedLocales;

  // Client-side: read from SSR-injected script tag to avoid a CDN round-trip
  if (typeof document !== "undefined") {
    const el = document.getElementById("__i18n_locales__");
    if (el?.textContent) {
      try {
        const parsed = JSON.parse(el.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          _cachedLocales = parsed;
          return _cachedLocales;
        }
      } catch {
        // parse failed → fall through to CDN fetch
      }
    }
  }

  _cachedLocales = await getLocales({ project: i18nConfig.project });
  return _cachedLocales;
}

/**
 * Get cached locales synchronously.
 * Returns cached locales if available, or falls back to defaultLocale.
 * Safe to call in sync contexts (e.g., head() functions) after fetchLocales() has been called.
 */
export function getCachedLocales(): string[] {
  return _cachedLocales || [i18nConfig.defaultLocale];
}

/**
 * Build country→locale map from CDN manifest languages.
 *
 * Uses manifest's `countryCode` field (e.g. "jp"→"ja", "cn"→"zh-hans")
 * which is the single source of truth from the Better i18n dashboard.
 *
 * Also adds multi-country overrides (e.g. AT→de, MX→es) using
 * LANGUAGE_TO_COUNTRY from core as a reverse lookup base.
 *
 * Cached after first call — manifest is fetched once per worker lifecycle.
 */
export async function fetchCountryToLocaleMap(): Promise<Record<string, string>> {
  if (_cachedCountryToLocale) return _cachedCountryToLocale;

  const languages = await getLanguages({ project: i18nConfig.project });
  const map: Record<string, string> = {};

  // Primary: manifest countryCode → locale code
  for (const lang of languages) {
    if (lang.countryCode) {
      map[lang.countryCode.toLowerCase()] = lang.code;
    }
  }

  // Secondary: add multi-country overrides
  // For countries not in manifest but whose language is available
  const availableCodes = new Set(languages.map((l) => l.code));
  const MULTI_COUNTRY: Record<string, string> = {
    // German-speaking
    at: "de", ch: "de",
    // French-speaking
    be: "fr", lu: "fr", ca: "fr",
    // Spanish-speaking
    mx: "es", ar: "es", co: "es", cl: "es", pe: "es", ve: "es", ec: "es",
    // Portuguese-speaking
    br: "pt-br",
    // Arabic-speaking
    ae: "ar", eg: "ar", ma: "ar", dz: "ar", iq: "ar", kw: "ar", qa: "ar",
    // Chinese-speaking
    sg: "zh-hans", tw: "zh-hans", hk: "zh-hans",
    // English-speaking (fallback — don't override)
    us: "en", gb: "en", au: "en", nz: "en",
  };

  for (const [country, locale] of Object.entries(MULTI_COUNTRY)) {
    // Only add if not already mapped AND the locale is available
    if (!map[country] && availableCodes.has(locale)) {
      map[country] = locale;
    }
  }

  _cachedCountryToLocale = map;
  return map;
}

/**
 * Resolve a CF country code to a locale.
 * Returns the matching locale or undefined if no mapping exists.
 */
export async function resolveLocaleFromCountry(
  countryCode: string,
): Promise<string | undefined> {
  const map = await fetchCountryToLocaleMap();
  return map[countryCode.toLowerCase()];
}
