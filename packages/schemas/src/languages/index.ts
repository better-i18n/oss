/**
 * Language utilities and mappings
 *
 * Shared across the monorepo for consistent language handling.
 */

// Map common language codes to display names
export const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  cs: "Czech",
  hu: "Hungarian",
  ro: "Romanian",
  uk: "Ukrainian",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  hi: "Hindi",
  bn: "Bengali",
  he: "Hebrew",
  el: "Greek",
  bg: "Bulgarian",
  sk: "Slovak",
  sl: "Slovenian",
  hr: "Croatian",
  sr: "Serbian",
  lt: "Lithuanian",
  lv: "Latvian",
  et: "Estonian",
  ca: "Catalan",
  eu: "Basque",
  gl: "Galician",
};

// Map common language codes to country codes for flags
export const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  en: "gb",
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  pt: "pt",
  ru: "ru",
  zh: "cn",
  ja: "jp",
  ko: "kr",
  ar: "sa",
  pl: "pl",
  nl: "nl",
  sv: "se",
  no: "no",
  da: "dk",
  fi: "fi",
  cs: "cz",
  hu: "hu",
  ro: "ro",
  uk: "ua",
  vi: "vn",
  th: "th",
  id: "id",
  ms: "my",
  hi: "in",
  bn: "bd",
  he: "il",
  el: "gr",
  bg: "bg",
  sk: "sk",
  sl: "si",
  hr: "hr",
  sr: "rs",
  lt: "lt",
  lv: "lv",
  et: "ee",
  ca: "es-ct",
  eu: "es-pv",
  gl: "es-ga",
};

/**
 * Get country code from language code for flag mapping
 */
export function getCountryCode(langCode: string): string {
  const code = langCode.toLowerCase();
  // Handle locale variants (e.g. en-US -> us)
  if (code.includes("-")) {
    const parts = code.split("-");
    return parts[1].toLowerCase();
  }
  return LANGUAGE_TO_COUNTRY[code] || code;
}

/**
 * Get language name from code, with fallback to uppercase code
 */
export function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code.toUpperCase();
}

/**
 * Get language code from name (reverse lookup)
 * Returns undefined if not found
 */
export function getLanguageCode(name: string): string | undefined {
  const lowerName = name.toLowerCase();
  for (const [code, langName] of Object.entries(LANGUAGE_NAMES)) {
    if (langName.toLowerCase() === lowerName) {
      return code;
    }
  }
  return undefined;
}
