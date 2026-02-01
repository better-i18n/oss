"use client";

import type { ComponentProps, ReactNode } from "react";
import { useLocaleRouter } from "./hooks/useLocaleRouter";
import { useLanguages } from "./hooks";

export interface LanguageSwitcherProps
  extends Omit<ComponentProps<"select">, "value" | "onChange" | "children"> {
  /**
   * Render function for custom option display
   */
  renderOption?: (language: {
    code: string;
    name?: string;
    nativeName?: string;
    flagUrl?: string | null;
    isDefault?: boolean;
  }) => ReactNode;

  /**
   * Label for loading state
   */
  loadingLabel?: string;
}

/**
 * Pre-built language switcher component with router integration
 *
 * Uses useLocaleRouter() internally for proper SPA navigation.
 * Locale changes trigger router navigation, which re-executes loaders.
 *
 * @example
 * ```tsx
 * // Basic usage - just works!
 * <LanguageSwitcher />
 *
 * // With custom styling
 * <LanguageSwitcher className="my-select" />
 *
 * // Custom option rendering
 * <LanguageSwitcher
 *   renderOption={(lang) => (
 *     <>
 *       {lang.flagUrl && <img src={lang.flagUrl} alt="" />}
 *       {lang.nativeName}
 *     </>
 *   )}
 * />
 * ```
 */
export function LanguageSwitcher({
  renderOption,
  loadingLabel = "Loading...",
  ...props
}: LanguageSwitcherProps) {
  const { locale, navigate, isReady } = useLocaleRouter();
  const { languages } = useLanguages();

  if (!isReady) {
    return (
      <select disabled {...props}>
        <option>{loadingLabel}</option>
      </select>
    );
  }

  return (
    <select value={locale} onChange={(e) => navigate(e.target.value)} {...props}>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {renderOption ? renderOption(lang) : lang.nativeName || lang.code}
        </option>
      ))}
    </select>
  );
}
