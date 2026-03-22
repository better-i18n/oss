"use client";

import { useBetterI18n } from "./context.js";

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
 * Hook to get current locale and switch between locales
 *
 * @example
 * ```tsx
 * function LocaleDisplay() {
 *   const { locale, setLocale, isLoading } = useLocale()
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       <span>Current: {locale}</span>
 *       <button onClick={() => setLocale('tr')}>Switch to Turkish</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLocale() {
  const { locale, setLocale, isLoadingMessages } = useBetterI18n();

  return {
    locale,
    setLocale,
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
