"use client";

import { useBetterI18n } from "./context";

/**
 * Hook to get available languages from CDN manifest
 *
 * @example
 * ```tsx
 * function LanguageList() {
 *   const { languages, isLoading } = useLanguages()
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <ul>
 *       {languages.map((lang) => (
 *         <li key={lang.code}>
 *           {lang.nativeName} ({lang.code})
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useLanguages() {
  const { languages, isLoadingLanguages } = useBetterI18n();

  return {
    languages,
    isLoading: isLoadingLanguages,
  };
}

/**
 * Hook to get current locale (read-only)
 *
 * For locale switching with proper router navigation, use useLocaleRouter() instead.
 *
 * @example
 * ```tsx
 * function LocaleDisplay() {
 *   const { locale, isLoading } = useLocale()
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return <span>Current locale: {locale}</span>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // For locale switching, use useLocaleRouter:
 * import { useLocaleRouter } from '@better-i18n/use-intl'
 *
 * function LocaleSwitcher() {
 *   const { locale, navigate } = useLocaleRouter()
 *   return (
 *     <button onClick={() => navigate(locale === 'en' ? 'tr' : 'en')}>
 *       Toggle: {locale}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLocale() {
  const { locale, isLoadingMessages } = useBetterI18n();

  return {
    locale,
    isLoading: isLoadingMessages,
  };
}

// Re-export use-intl hooks for convenience
export {
  useTranslations,
  useFormatter,
  useMessages,
  useNow,
  useTimeZone,
  useLocale as useIntlLocale,
} from "use-intl";
