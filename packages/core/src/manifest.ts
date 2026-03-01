import type {
  LanguageOption,
  ManifestLanguage,
  ManifestResponse,
} from "./types.js";

/**
 * Normalize a manifest language to a simplified language option
 */
const normalizeLanguage = (language: ManifestLanguage): LanguageOption => ({
  code: language.code,
  name: language.name,
  nativeName:
    language.nativeName || language.name || language.code.toUpperCase(),
  flagUrl: language.flagUrl ?? null,
  isDefault: language.isSource ?? false,
});

/**
 * Extract and normalize languages from manifest
 */
export const extractLanguages = (
  manifest: ManifestResponse
): LanguageOption[] => {
  const languages = Array.isArray(manifest.languages)
    ? manifest.languages
    : [];

  return languages
    .filter(
      (language): language is ManifestLanguage =>
        !!language &&
        typeof language.code === "string" &&
        language.code.length > 0
    )
    .map(normalizeLanguage);
};
