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
   * Navigate to the same page with a new locale.
   * Uses TanStack Router navigation when available,
   * falls back to context-based `setLocale()` otherwise.
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
 * Hook for locale navigation with automatic router detection.
 *
 * When TanStack Router context is available, locale changes trigger
 * proper SPA navigation. When no router is present (e.g., plain Vite
 * apps), falls back to the provider's `setLocale()` for state-based
 * locale switching.
 *
 * @example
 * ```tsx
 * // Works in both router and non-router environments
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
  const {
    languages,
    isLoadingLanguages,
    localePrefix,
    locale: contextLocale,
    setLocale,
  } = useBetterI18n();

  // Safely detect TanStack Router context.
  // When no <RouterProvider> is in the tree, these hooks throw —
  // we catch gracefully and fall back to context-based locale switching.
  //
  // Router context presence is static — it never changes during a component's lifecycle.
  // The hook count is consistent between renders because useContext (called internally
  // by useRouter/useLocation) always executes before any throw.
  let router: ReturnType<typeof useRouter> | null = null;
  let location: ReturnType<typeof useLocation> | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    router = useRouter();
  } catch {
    // No TanStack Router context — will use context-based navigation
  }

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    location = useLocation();
  } catch {
    // No TanStack Router context
  }

  const hasRouter = router != null && location != null;

  // Build config from CDN manifest — includes localePrefix for URL strategy
  const config: LocaleConfig = useMemo(
    () => ({
      locales: languages.map((lang) => lang.code),
      defaultLocale: languages.find((l) => l.isDefault)?.code || "en",
      localePrefix,
    }),
    [languages, localePrefix]
  );

  // Get effective locale: from URL when router is available, from context otherwise
  const locale = useMemo(() => {
    if (!hasRouter || !location) {
      return contextLocale;
    }
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
  }, [hasRouter, location, config, languages, contextLocale]);

  // Navigate: router-based SPA navigation or context-based state update
  const navigate = useCallback(
    (newLocale: string) => {
      if (hasRouter && router && location) {
        const newPath = replaceLocaleInPath(location.pathname, newLocale, config);
        router.navigate({ to: newPath });
      } else {
        // No router — update locale via provider state
        setLocale(newLocale);
      }
    },
    [hasRouter, location, config, router, setLocale]
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
