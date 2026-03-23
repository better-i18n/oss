"use client";

import { useCallback, useMemo } from "react";
import { addLocalePrefix, type LocaleConfig } from "@better-i18n/core";
import { useBetterI18n } from "../context.js";

/**
 * Return type for useLocalePath hook
 */
export interface UseLocalePathReturn {
  /**
   * Current locale from context
   */
  locale: string;

  /**
   * Available locale codes from CDN manifest
   */
  locales: string[];

  /**
   * Default locale (no URL prefix in "as-needed" mode)
   */
  defaultLocale: string;

  /**
   * Get a localized path for link building.
   * Router-agnostic — works with any routing library.
   *
   * @param path - The path to localize (e.g., "/about")
   * @param targetLocale - Target locale (optional, uses current if not specified)
   * @returns Localized path (e.g., "/tr/about")
   */
  localePath: (path: string, targetLocale?: string) => string;

  /**
   * Switch to a new locale via the provider's `setLocale()`.
   * When `onLocaleChange` is configured on the provider, the router
   * callback handles URL updates. Otherwise, `setLocale()` uses
   * `replaceState` as a fallback.
   */
  navigate: (locale: string) => void;

  /**
   * Whether languages have been loaded from CDN
   */
  isReady: boolean;
}

/**
 * Router-agnostic hook for locale path building and navigation.
 *
 * Unlike `useLocaleRouter` (from `@better-i18n/use-intl/router`), this hook
 * has **no router dependency** — it works with React Router, TanStack Router,
 * plain Vite apps, or any other setup.
 *
 * For TanStack Router-specific navigation (reading locale from URL params,
 * using `router.navigate()`), use `useLocaleRouter` from the `/router` export.
 *
 * @example
 * ```tsx
 * function Navigation() {
 *   const { localePath, locale } = useLocalePath();
 *
 *   return (
 *     <nav>
 *       <Link to={localePath('/about')}>About</Link>
 *       <Link to={localePath('/contact', 'tr')}>İletişim</Link>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Language switcher (works with any router)
 * function LanguageSwitcher() {
 *   const { locale, locales, navigate, isReady } = useLocalePath();
 *
 *   if (!isReady) return null;
 *
 *   return (
 *     <select value={locale} onChange={(e) => navigate(e.target.value)}>
 *       {locales.map((loc) => (
 *         <option key={loc} value={loc}>{loc}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLocalePath(): UseLocalePathReturn {
  const {
    languages,
    isLoadingLanguages,
    localePrefix,
    locale,
    setLocale,
  } = useBetterI18n();

  const config: LocaleConfig = useMemo(
    () => ({
      locales: languages.map((lang) => lang.code),
      defaultLocale: languages.find((l) => l.isDefault)?.code || "en",
      localePrefix,
    }),
    [languages, localePrefix],
  );

  const localePath = useCallback(
    (path: string, targetLocale?: string) => {
      const loc = targetLocale || locale;
      return addLocalePrefix(path, loc, config);
    },
    [locale, config],
  );

  return {
    locale,
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    localePath,
    navigate: setLocale,
    isReady: !isLoadingLanguages && config.locales.length > 0,
  };
}
