import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { normalizeLocale } from "@better-i18n/core";
import type { LanguageOption } from "@better-i18n/core";
import { useLanguages } from "./hooks.js";

export interface UseLocaleSwitcherReturn {
  /** Available languages from the CDN manifest. Empty array before `initBetterI18n` completes. */
  languages: LanguageOption[];
  /** Current active locale (normalized to lowercase BCP 47). */
  currentLocale: string;
  /** Switch to a new locale. Pre-loads translations before switching to prevent flash. */
  changeLocale: (locale: string) => Promise<void>;
}

/**
 * Hook for building a custom locale switcher UI in React Native.
 *
 * Combines `useLanguages()` for the language list with `i18next.changeLanguage()`
 * (pre-patched by `initBetterI18n` to pre-load translations before switching).
 *
 * @example
 * ```tsx
 * import { useLocaleSwitcher } from '@better-i18n/expo';
 *
 * function LanguagePicker() {
 *   const { languages, currentLocale, changeLocale } = useLocaleSwitcher();
 *
 *   return (
 *     <FlatList
 *       data={languages}
 *       keyExtractor={(item) => item.code}
 *       renderItem={({ item }) => (
 *         <Pressable onPress={() => changeLocale(item.code)}>
 *           <Text style={item.code === currentLocale ? styles.active : undefined}>
 *             {item.nativeName || item.code}
 *           </Text>
 *         </Pressable>
 *       )}
 *     />
 *   );
 * }
 * ```
 */
export function useLocaleSwitcher(): UseLocaleSwitcherReturn {
  const languages = useLanguages();
  const { i18n } = useTranslation();

  const currentLocale = useMemo(
    () => normalizeLocale(i18n.language),
    [i18n.language],
  );

  const changeLocale = useCallback(
    async (locale: string) => {
      await i18n.changeLanguage(normalizeLocale(locale));
    },
    [i18n],
  );

  return { languages, currentLocale, changeLocale };
}
