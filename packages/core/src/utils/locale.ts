/**
 * Locale configuration for URL path handling
 */
export interface LocaleConfig {
  /**
   * List of supported locale codes
   * @example ['en', 'tr', 'de', 'fr']
   */
  locales: string[];

  /**
   * Default locale code (will NOT have a prefix in URL)
   * @example 'en'
   */
  defaultLocale: string;
}

/**
 * Extract locale from URL pathname
 *
 * Returns the locale if found in the first path segment, or null for default locale
 * (which has no prefix in URL per next-intl/Paraglide JS convention)
 *
 * @example
 * extractLocale('/tr/about', config) // 'tr'
 * extractLocale('/about', config)    // null (means use default)
 * extractLocale('/', config)         // null
 */
export function extractLocale(
  pathname: string,
  config: LocaleConfig
): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && config.locales.includes(firstSegment)) {
    return firstSegment;
  }

  return null; // Default locale - no prefix in URL
}

/**
 * Get the effective locale from URL pathname
 *
 * Unlike extractLocale, this always returns a valid locale string
 * (returns defaultLocale when no prefix is present)
 *
 * @example
 * getLocaleFromPath('/tr/about', config) // 'tr'
 * getLocaleFromPath('/about', config)    // 'en' (default)
 * getLocaleFromPath('/', config)         // 'en' (default)
 */
export function getLocaleFromPath(
  pathname: string,
  config: LocaleConfig
): string {
  return extractLocale(pathname, config) || config.defaultLocale;
}

/**
 * Check if pathname has a locale prefix
 *
 * @example
 * hasLocalePrefix('/tr/about', config) // true
 * hasLocalePrefix('/about', config)    // false
 */
export function hasLocalePrefix(
  pathname: string,
  config: LocaleConfig
): boolean {
  return extractLocale(pathname, config) !== null;
}

/**
 * Remove locale prefix from pathname
 *
 * @example
 * removeLocalePrefix('/tr/about', config) // '/about'
 * removeLocalePrefix('/about', config)    // '/about' (unchanged)
 * removeLocalePrefix('/tr', config)       // '/'
 */
export function removeLocalePrefix(
  pathname: string,
  config: LocaleConfig
): string {
  const locale = extractLocale(pathname, config);
  if (!locale) return pathname;

  const result = pathname.replace(new RegExp(`^/${locale}`), "");
  return result || "/";
}

/**
 * Add locale prefix to pathname (respects default locale convention)
 *
 * Default locale does NOT get a prefix (follows next-intl/Paraglide JS pattern)
 *
 * @example
 * addLocalePrefix('/about', 'tr', config) // '/tr/about'
 * addLocalePrefix('/about', 'en', config) // '/about' (en is default, no prefix)
 * addLocalePrefix('/', 'tr', config)      // '/tr'
 */
export function addLocalePrefix(
  pathname: string,
  locale: string,
  config: LocaleConfig
): string {
  // Don't add prefix for default locale
  if (locale === config.defaultLocale) {
    return pathname;
  }

  if (pathname === "/" || pathname === "") {
    return `/${locale}`;
  }
  return `/${locale}${pathname}`;
}

/**
 * Replace/add locale in pathname
 *
 * Handles the default locale specially (removes prefix instead of adding)
 * This is the main utility for locale switching in URLs
 *
 * @example
 * replaceLocaleInPath('/about', 'tr', config)    // '/tr/about'
 * replaceLocaleInPath('/tr/about', 'en', config) // '/about' (en is default)
 * replaceLocaleInPath('/tr/about', 'de', config) // '/de/about'
 * replaceLocaleInPath('/en/about', 'tr', config) // '/tr/about'
 */
export function replaceLocaleInPath(
  pathname: string,
  newLocale: string,
  config: LocaleConfig
): string {
  // Remove existing locale prefix if present
  const cleanPath = removeLocalePrefix(pathname, config);

  // Don't add prefix for default locale
  if (newLocale === config.defaultLocale) {
    return cleanPath;
  }

  // Add new locale prefix
  return `/${newLocale}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Create a localized path builder for a specific locale config
 *
 * Useful for creating navigation helpers with a fixed config
 *
 * @example
 * const localePath = createLocalePath(config);
 * localePath('/about', 'tr') // '/tr/about'
 * localePath('/about')       // Uses current locale from context
 */
export function createLocalePath(config: LocaleConfig) {
  return (path: string, locale?: string): string => {
    const targetLocale = locale || config.defaultLocale;
    return addLocalePrefix(path, targetLocale, config);
  };
}
