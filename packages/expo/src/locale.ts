/**
 * Get the device's primary locale using expo-localization.
 *
 * Falls back to the provided default if expo-localization is not installed
 * or if no locale can be detected.
 *
 * @example
 * ```ts
 * const locale = getDeviceLocale({ fallback: 'en' });
 * // "tr" (on a Turkish device)
 * ```
 */
export const getDeviceLocale = (
  options: { fallback?: string } = {}
): string => {
  const { fallback = "en" } = options;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const localization = require("expo-localization");
    const getLocales: () => Array<{ languageCode: string | null }> =
      localization.getLocales;
    const locales = getLocales();
    return locales[0]?.languageCode ?? fallback;
  } catch {
    return fallback;
  }
};

/**
 * Get all device locales as language codes.
 *
 * Returns an empty array if expo-localization is not installed.
 *
 * @example
 * ```ts
 * const locales = getDeviceLocales();
 * // ["tr", "en", "de"]
 * ```
 */
export const getDeviceLocales = (): string[] => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const localization = require("expo-localization");
    const getLocales: () => Array<{ languageCode: string | null }> =
      localization.getLocales;
    const locales = getLocales();
    return locales
      .map((l) => l.languageCode)
      .filter((code): code is string => code != null);
  } catch {
    return [];
  }
};
