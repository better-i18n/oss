import { LocaleDropdown } from "@better-i18n/use-intl";

/**
 * Language switcher with proper router integration.
 *
 * Thin wrapper around `LocaleDropdown` from `@better-i18n/use-intl`.
 * Uses useLocaleRouter() internally — triggers TanStack Router navigation,
 * causing loaders to re-execute with the new locale.
 */
export function LanguageSwitcher() {
  return <LocaleDropdown />;
}
