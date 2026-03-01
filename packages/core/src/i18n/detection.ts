import type { LocaleDetectionOptions, LocaleDetectionResult } from "./types.js";
import { normalizeLocale } from "../utils/locale.js";

/** Case-insensitive locale lookup — returns the canonical (CDN) form if matched */
const findLocale = (code: string | null | undefined, available: string[]) =>
  code ? available.find((a) => normalizeLocale(a) === normalizeLocale(code)) : undefined;

/**
 * Framework-agnostic locale detection logic
 */
export function detectLocale(
  options: LocaleDetectionOptions,
): LocaleDetectionResult {
  const {
    pathLocale,
    cookieLocale,
    headerLocale,
    defaultLocale,
    availableLocales,
  } = options;

  let locale: string;
  let detectedFrom: LocaleDetectionResult["detectedFrom"];

  // Priority: path > cookie > header > default
  const pathMatch = findLocale(pathLocale, availableLocales);
  const cookieMatch = findLocale(cookieLocale, availableLocales);
  const headerMatch = findLocale(headerLocale, availableLocales);

  if (pathMatch) {
    locale = pathMatch;
    detectedFrom = "path";
  } else if (cookieMatch) {
    locale = cookieMatch;
    detectedFrom = "cookie";
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
