/** CLDR-sourced locale database for the Locale Explorer tool and locale selectors. */

import type { LocaleData } from "./types";

export const LOCALE_DATABASE: readonly LocaleData[] = [
  // English
  {
    code: "en",
    language: "en",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "English",
    englishName: "English",
    pluralCategories: ["one", "other"],
    speakerPopulation: 1500000000,
  },
  {
    code: "en-US",
    language: "en",
    region: "US",
    script: "Latn",
    direction: "ltr",
    nativeName: "English (United States)",
    englishName: "English (United States)",
    pluralCategories: ["one", "other"],
    speakerPopulation: 310000000,
  },
  {
    code: "en-GB",
    language: "en",
    region: "GB",
    script: "Latn",
    direction: "ltr",
    nativeName: "English (United Kingdom)",
    englishName: "English (United Kingdom)",
    pluralCategories: ["one", "other"],
    speakerPopulation: 67000000,
  },

  // German
  {
    code: "de",
    language: "de",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Deutsch",
    englishName: "German",
    pluralCategories: ["one", "other"],
    speakerPopulation: 130000000,
  },
  {
    code: "de-DE",
    language: "de",
    region: "DE",
    script: "Latn",
    direction: "ltr",
    nativeName: "Deutsch (Deutschland)",
    englishName: "German (Germany)",
    pluralCategories: ["one", "other"],
    speakerPopulation: 83000000,
  },

  // French
  {
    code: "fr",
    language: "fr",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Français",
    englishName: "French",
    pluralCategories: ["one", "many", "other"],
    speakerPopulation: 280000000,
  },

  // Spanish
  {
    code: "es",
    language: "es",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Español",
    englishName: "Spanish",
    pluralCategories: ["one", "many", "other"],
    speakerPopulation: 560000000,
  },

  // Japanese
  {
    code: "ja",
    language: "ja",
    region: null,
    script: "Jpan",
    direction: "ltr",
    nativeName: "日本語",
    englishName: "Japanese",
    pluralCategories: ["other"],
    speakerPopulation: 125000000,
  },
  {
    code: "ja-JP",
    language: "ja",
    region: "JP",
    script: "Jpan",
    direction: "ltr",
    nativeName: "日本語（日本）",
    englishName: "Japanese (Japan)",
    pluralCategories: ["other"],
    speakerPopulation: 125000000,
  },

  // Korean
  {
    code: "ko",
    language: "ko",
    region: null,
    script: "Kore",
    direction: "ltr",
    nativeName: "한국어",
    englishName: "Korean",
    pluralCategories: ["other"],
    speakerPopulation: 80000000,
  },

  // Chinese (Simplified)
  {
    code: "zh",
    language: "zh",
    region: null,
    script: "Hans",
    direction: "ltr",
    nativeName: "中文",
    englishName: "Chinese",
    pluralCategories: ["other"],
    speakerPopulation: 1300000000,
  },
  {
    code: "zh-CN",
    language: "zh",
    region: "CN",
    script: "Hans",
    direction: "ltr",
    nativeName: "中文（中国）",
    englishName: "Chinese (China)",
    pluralCategories: ["other"],
    speakerPopulation: 1000000000,
  },

  // Chinese (Traditional)
  {
    code: "zh-TW",
    language: "zh",
    region: "TW",
    script: "Hant",
    direction: "ltr",
    nativeName: "中文（台灣）",
    englishName: "Chinese (Taiwan)",
    pluralCategories: ["other"],
    speakerPopulation: 23000000,
  },

  // Arabic
  {
    code: "ar",
    language: "ar",
    region: null,
    script: "Arab",
    direction: "rtl",
    nativeName: "العربية",
    englishName: "Arabic",
    pluralCategories: ["zero", "one", "two", "few", "many", "other"],
    speakerPopulation: 420000000,
  },
  {
    code: "ar-SA",
    language: "ar",
    region: "SA",
    script: "Arab",
    direction: "rtl",
    nativeName: "العربية (المملكة العربية السعودية)",
    englishName: "Arabic (Saudi Arabia)",
    pluralCategories: ["zero", "one", "two", "few", "many", "other"],
    speakerPopulation: 35000000,
  },

  // Hindi
  {
    code: "hi",
    language: "hi",
    region: null,
    script: "Deva",
    direction: "ltr",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    pluralCategories: ["one", "other"],
    speakerPopulation: 600000000,
  },

  // Portuguese
  {
    code: "pt",
    language: "pt",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Português",
    englishName: "Portuguese",
    pluralCategories: ["one", "many", "other"],
    speakerPopulation: 260000000,
  },
  {
    code: "pt-BR",
    language: "pt",
    region: "BR",
    script: "Latn",
    direction: "ltr",
    nativeName: "Português (Brasil)",
    englishName: "Portuguese (Brazil)",
    pluralCategories: ["one", "other"],
    speakerPopulation: 215000000,
  },

  // Russian
  {
    code: "ru",
    language: "ru",
    region: null,
    script: "Cyrl",
    direction: "ltr",
    nativeName: "Русский",
    englishName: "Russian",
    pluralCategories: ["one", "few", "many", "other"],
    speakerPopulation: 260000000,
  },

  // Turkish
  {
    code: "tr",
    language: "tr",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Türkçe",
    englishName: "Turkish",
    pluralCategories: ["one", "other"],
    speakerPopulation: 90000000,
  },

  // Italian
  {
    code: "it",
    language: "it",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Italiano",
    englishName: "Italian",
    pluralCategories: ["one", "many", "other"],
    speakerPopulation: 85000000,
  },

  // Dutch
  {
    code: "nl",
    language: "nl",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Nederlands",
    englishName: "Dutch",
    pluralCategories: ["one", "other"],
    speakerPopulation: 30000000,
  },

  // Polish
  {
    code: "pl",
    language: "pl",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Polski",
    englishName: "Polish",
    pluralCategories: ["one", "few", "many", "other"],
    speakerPopulation: 50000000,
  },

  // Swedish
  {
    code: "sv",
    language: "sv",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Svenska",
    englishName: "Swedish",
    pluralCategories: ["one", "other"],
    speakerPopulation: 13000000,
  },

  // Thai
  {
    code: "th",
    language: "th",
    region: null,
    script: "Thai",
    direction: "ltr",
    nativeName: "ภาษาไทย",
    englishName: "Thai",
    pluralCategories: ["other"],
    speakerPopulation: 60000000,
  },

  // Vietnamese
  {
    code: "vi",
    language: "vi",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Tiếng Việt",
    englishName: "Vietnamese",
    pluralCategories: ["other"],
    speakerPopulation: 97000000,
  },

  // Indonesian
  {
    code: "id",
    language: "id",
    region: null,
    script: "Latn",
    direction: "ltr",
    nativeName: "Bahasa Indonesia",
    englishName: "Indonesian",
    pluralCategories: ["other"],
    speakerPopulation: 270000000,
  },

  // Ukrainian
  {
    code: "uk",
    language: "uk",
    region: null,
    script: "Cyrl",
    direction: "ltr",
    nativeName: "Українська",
    englishName: "Ukrainian",
    pluralCategories: ["one", "few", "many", "other"],
    speakerPopulation: 40000000,
  },

  // Hebrew
  {
    code: "he",
    language: "he",
    region: null,
    script: "Hebr",
    direction: "rtl",
    nativeName: "עברית",
    englishName: "Hebrew",
    pluralCategories: ["one", "two", "many", "other"],
    speakerPopulation: 10000000,
  },

  // Persian (Farsi)
  {
    code: "fa",
    language: "fa",
    region: null,
    script: "Arab",
    direction: "rtl",
    nativeName: "فارسی",
    englishName: "Persian",
    pluralCategories: ["one", "other"],
    speakerPopulation: 110000000,
  },
] as const;

/** All locale codes for route generation */
export const ALL_LOCALE_CODES: readonly string[] = LOCALE_DATABASE.map(
  (l) => l.code,
);

/** Look up a locale by code */
export function getLocaleByCode(code: string): LocaleData | undefined {
  return LOCALE_DATABASE.find((l) => l.code === code);
}

/** Get related locales (same language, different region) */
export function getRelatedLocales(code: string): readonly LocaleData[] {
  const locale = getLocaleByCode(code);
  if (!locale) return [];
  return LOCALE_DATABASE.filter(
    (l) => l.language === locale.language && l.code !== code,
  );
}
