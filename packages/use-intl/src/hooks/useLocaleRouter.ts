"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useLocation } from "@tanstack/react-router";
import {
  getLocaleFromPath,
  replaceLocaleInPath,
  addLocalePrefix,
  type LocaleConfig,
} from "@better-i18n/core";
import { useBetterI18n } from "../context.js";

/**
 * Return type for useLocaleRouter hook
 */
export interface UseLocaleRouterReturn {
  /**
   * Current locale (extracted from URL or default)
   */
  locale: string;

  /**
   * Available locales from CDN manifest
   */
  locales: string[];

  /**
   * Default locale (no URL prefix)
   */
  defaultLocale: string;

  /**
   * Navigate to the same page with a new locale
   * Uses TanStack Router's navigate() for proper SPA navigation
   */
  navigate: (locale: string) => void;

  /**
   * Get a localized path for link building
   * @param path - The path to localize
   * @param locale - Target locale (optional, uses current if not specified)
   */
  localePath: (path: string, locale?: string) => string;

  /**
   * Whether languages have been loaded from CDN
   */
  isReady: boolean;
}

/**
 * Hook for router-integrated locale navigation
 *
 * This hook provides a navigation-first approach to locale switching:
 * - Locale changes trigger proper router navigation
 * - Loaders re-execute with the new locale
 * - No state synchronization issues
 * - Works with TanStack Router's file-based routing
 *
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { locale, locales, navigate, isReady } = useLocaleRouter();
 *
 *   if (!isReady) return <Skeleton />;
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
 *
 * @example
 * ```tsx
 * // Building localized links
 * function Navigation() {
 *   const { localePath } = useLocaleRouter();
 *
 *   return (
 *     <nav>
 *       <Link to={localePath('/about')}>About</Link>
 *       <Link to={localePath('/contact', 'tr')}>İletişim (TR)</Link>
 *     </nav>
 *   );
 * }
 * ```
 */
export function useLocaleRouter(): UseLocaleRouterReturn {
  const router = useRouter();
  const location = useLocation();
  const { languages, isLoadingLanguages } = useBetterI18n();

  // Build config from CDN manifest
  const config: LocaleConfig = useMemo(
    () => ({
      locales: languages.map((lang) => lang.code),
      defaultLocale: languages.find((l) => l.isDefault)?.code || "en",
    }),
    [languages]
  );

  // Get effective locale from URL (handles default without prefix)
  const locale = useMemo(() => {
    // If no languages loaded yet, extract from path manually
    if (languages.length === 0) {
      const segments = location.pathname.split("/").filter(Boolean);
      const firstSegment = segments[0];
      // Check if it looks like a locale code (2 letters)
      if (firstSegment && /^[a-z]{2}$/i.test(firstSegment)) {
        return firstSegment;
      }
      return "en"; // fallback
    }
    return getLocaleFromPath(location.pathname, config);
  }, [location.pathname, config, languages]);

  // Navigate to same page with new locale (SPA navigation!)
  const navigate = useCallback(
    (newLocale: string) => {
      const newPath = replaceLocaleInPath(location.pathname, newLocale, config);
      router.navigate({ to: newPath });
    },
    [location.pathname, config, router]
  );

  // Get localized path for links
  const localePath = useCallback(
    (path: string, targetLocale?: string) => {
      const loc = targetLocale || locale;
      return addLocalePrefix(path, loc, config);
    },
    [locale, config]
  );

  return {
    locale,
    locales: config.locales,
    defaultLocale: config.defaultLocale,
    navigate,
    localePath,
    isReady: !isLoadingLanguages && config.locales.length > 0,
  };
}
