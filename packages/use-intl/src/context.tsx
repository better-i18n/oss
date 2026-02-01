"use client";

import { createContext, useContext } from "react";
import type { BetterI18nContextValue } from "./types";

/**
 * Context for Better i18n specific state
 */
export const BetterI18nContext = createContext<BetterI18nContextValue | null>(
  null
);

/**
 * Hook to access Better i18n context
 *
 * Note: For locale switching, use useLocaleRouter() which integrates with TanStack Router.
 *
 * @example
 * ```tsx
 * function LanguageInfo() {
 *   const { locale, languages, isLoadingLanguages } = useBetterI18n()
 *
 *   if (isLoadingLanguages) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       Current: {locale}
 *       Available: {languages.map(l => l.code).join(', ')}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // For language switching with proper router navigation:
 * import { useLocaleRouter } from '@better-i18n/use-intl'
 *
 * function LanguageSwitcher() {
 *   const { locale, locales, navigate } = useLocaleRouter()
 *   return (
 *     <select value={locale} onChange={(e) => navigate(e.target.value)}>
 *       {locales.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
 *     </select>
 *   )
 * }
 * ```
 */
export function useBetterI18n(): BetterI18nContextValue {
  const context = useContext(BetterI18nContext);

  if (!context) {
    throw new Error(
      "[better-i18n] useBetterI18n must be used within a BetterI18nProvider"
    );
  }

  return context;
}
