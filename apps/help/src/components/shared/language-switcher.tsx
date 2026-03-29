import { LocaleDropdown } from "@better-i18n/use-intl";

/**
 * Help center locale switcher.
 *
 * Thin wrapper around `LocaleDropdown` with mist color theme applied
 * via CSS custom properties.
 */
export function LanguageSwitcher() {
  return (
    <div
      style={{
        "--better-locale-text": "var(--color-mist-600)",
        "--better-locale-hover-bg": "var(--color-mist-100)",
        "--better-locale-active-bg": "var(--color-mist-100)",
        "--better-locale-border": "var(--color-border)",
        "--better-locale-menu-bg": "var(--color-card)",
      } as React.CSSProperties}
    >
      <LocaleDropdown showLocaleCode={false} />
    </div>
  );
}
