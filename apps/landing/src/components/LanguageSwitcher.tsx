import { LocaleDropdown } from "@better-i18n/use-intl";

/**
 * Language switcher for the landing page.
 *
 * Thin wrapper around `LocaleDropdown` from `@better-i18n/use-intl`.
 * Uses landing's mist color tokens via CSS custom properties.
 */
export function LanguageSwitcher() {
  return (
    <div
      style={{
        "--better-locale-text": "var(--color-mist-700)",
        "--better-locale-hover-bg": "var(--color-mist-100)",
        "--better-locale-active-bg": "var(--color-mist-100)",
        "--better-locale-border": "var(--color-mist-200)",
        "--better-locale-menu-bg": "#ffffff",
        "--better-locale-trigger-bg": "transparent",
        "--better-locale-trigger-border": "var(--color-mist-200)",
        "--better-locale-trigger-radius": "9999px",
      } as React.CSSProperties}
    >
      <LocaleDropdown showLocaleCode={false} />
    </div>
  );
}
