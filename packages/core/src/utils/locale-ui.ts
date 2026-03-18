/**
 * UI utilities for locale display: flag resolution, country codes, and labels.
 *
 * Extracted from the platform's LanguageSwitcher for use across all OSS packages.
 * Zero dependencies — works in any React environment.
 */

/**
 * Maps primary language codes to their most commonly associated country codes.
 * Used as a fallback when no explicit `countryCode` or regional subtag is available.
 */
export const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  ar: "sa",
  bg: "bg",
  bn: "bd",
  cs: "cz",
  da: "dk",
  de: "de",
  el: "gr",
  en: "gb",
  es: "es",
  et: "ee",
  fi: "fi",
  fr: "fr",
  he: "il",
  hi: "in",
  hr: "hr",
  hu: "hu",
  id: "id",
  it: "it",
  ja: "jp",
  ko: "kr",
  lt: "lt",
  lv: "lv",
  ms: "my",
  nl: "nl",
  no: "no",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  ru: "ru",
  sk: "sk",
  sl: "si",
  sr: "rs",
  sv: "se",
  th: "th",
  tr: "tr",
  uk: "ua",
  vi: "vn",
  zh: "cn",
};

/**
 * Derives a two-letter country code from a locale string.
 *
 * Resolution order:
 * 1. Regional subtag (e.g., "pt-BR" → "br")
 * 2. LANGUAGE_TO_COUNTRY map (e.g., "ja" → "jp")
 * 3. null if no mapping exists
 */
export function getCountryCodeFromLocale(locale: string): string | null {
  const normalizedLocale = locale.trim().toLowerCase();
  if (!normalizedLocale) return null;

  const [, regionOrScript] = normalizedLocale.split("-");
  if (regionOrScript && /^[a-z]{2}$/i.test(regionOrScript)) {
    return regionOrScript.toLowerCase();
  }

  return (
    LANGUAGE_TO_COUNTRY[normalizedLocale] ||
    LANGUAGE_TO_COUNTRY[normalizedLocale.split("-")[0]] ||
    null
  );
}

/**
 * Converts a two-letter country code to its flag emoji using regional indicator symbols.
 *
 * @example
 * getFlagEmoji("us") // "🇺🇸"
 * getFlagEmoji("tr") // "🇹🇷"
 * getFlagEmoji(null)  // null
 */
export function getFlagEmoji(countryCode?: string | null): string | null {
  if (!countryCode || !/^[a-z]{2}$/i.test(countryCode)) return null;

  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

/** Minimal language shape for UI utilities — compatible with `LanguageOption`. */
interface LanguageLike {
  code: string;
  name?: string;
  nativeName?: string;
}

/**
 * Returns the best display label for a language.
 * Priority: nativeName → name → uppercased code.
 */
export function getLanguageLabel(language: LanguageLike): string {
  return language.nativeName || language.name || language.code.toUpperCase();
}

/** Resolved flag info for rendering. */
export type ResolvedFlag =
  | { type: "url"; url: string }
  | { type: "emoji"; emoji: string }
  | { type: "none" };

/** Minimal shape needed for flag resolution. */
interface FlagResolvable {
  code: string;
  countryCode?: string | null;
  flagUrl?: string | null;
}

/**
 * Resolves the best available flag representation for a language.
 *
 * Resolution order:
 * 1. `flagUrl` → image URL (custom flag from CDN manifest)
 * 2. Emoji flag derived from country code or locale
 * 3. `{ type: "none" }` — caller should render a globe icon
 */
export function resolveFlag(language: FlagResolvable): ResolvedFlag {
  if (language.flagUrl) {
    return { type: "url", url: language.flagUrl };
  }

  const countryCode =
    language.countryCode || getCountryCodeFromLocale(language.code);
  const emoji = getFlagEmoji(countryCode);

  if (emoji) {
    return { type: "emoji", emoji };
  }

  return { type: "none" };
}
