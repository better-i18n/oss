import type { LocaleDetectionOptions, LocaleDetectionResult } from "./types";

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
  if (pathLocale && availableLocales.includes(pathLocale)) {
    locale = pathLocale;
    detectedFrom = "path";
  } else if (cookieLocale && availableLocales.includes(cookieLocale)) {
    locale = cookieLocale;
    detectedFrom = "cookie";
  } else if (headerLocale && availableLocales.includes(headerLocale)) {
    locale = headerLocale;
    detectedFrom = "header";
  } else {
    locale = defaultLocale;
    detectedFrom = "default";
  }

  // Should set cookie if locale differs from current cookie
  const shouldSetCookie = cookieLocale !== locale;

  return { locale, detectedFrom, shouldSetCookie };
}
