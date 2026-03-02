import { useSyncExternalStore } from "react";
import type { LanguageOption } from "@better-i18n/core";
import { subscribeLanguages, getLanguagesSnapshot } from "./helpers.js";

/**
 * React hook that returns the available languages from the CDN manifest.
 *
 * Returns `[]` before `initBetterI18n` completes, then automatically
 * re-renders with the full language list once initialization finishes.
 *
 * @example
 * ```tsx
 * import { useLanguages } from '@better-i18n/expo';
 *
 * function LanguagePicker() {
 *   const languages = useLanguages();
 *   return languages.map(lang => <Text key={lang.code}>{lang.nativeName}</Text>);
 * }
 * ```
 */
export function useLanguages(): LanguageOption[] {
  return useSyncExternalStore(subscribeLanguages, getLanguagesSnapshot);
}
