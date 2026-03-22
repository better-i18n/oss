"use client";

import { createContext, useContext } from "react";
import type { BetterI18nContextValue } from "./types.js";

/**
 * Context for Better i18n specific state
 */
export const BetterI18nContext = createContext<BetterI18nContextValue | null>(
  null
);

/**
 * Hook to access Better i18n context
 *
 * Provides locale state, language list, and `setLocale()` for switching.
 * For higher-level APIs, use `useLocale()` or `useLocaleRouter()`.
 *
 * @example
 * ```tsx
 * function LanguageInfo() {
 *   const { locale, setLocale, languages, isLoadingLanguages } = useBetterI18n()
 *
 *   if (isLoadingLanguages) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       <p>Current: {locale}</p>
 *       <p>Available: {languages.map(l => l.code).join(', ')}</p>
 *       <button onClick={() => setLocale('tr')}>Switch to Turkish</button>
 *     </div>
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
