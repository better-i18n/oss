"use client";

import {
  LocaleDropdownBase,
  type LocaleDropdownBaseProps,
  type LocaleDropdownRenderContext,
  type LocaleDropdownTriggerContext,
} from "@better-i18n/core/react";
import { useLocalePath } from "../hooks/useLocalePath.js";
import { useLanguages } from "../hooks.js";

export type { LocaleDropdownRenderContext, LocaleDropdownTriggerContext };

export type LocaleDropdownProps = Omit<
  LocaleDropdownBaseProps,
  "locale" | "languages" | "onLocaleChange" | "isLoading"
>;

/**
 * Styled locale dropdown with TanStack Router integration.
 *
 * Uses `useLocalePath()` and `useLanguages()` internally — works
 * out of the box inside `<BetterI18nProvider>`.
 *
 * @example
 * ```tsx
 * // Zero config
 * <LocaleDropdown />
 *
 * // Headless
 * <LocaleDropdown variant="unstyled" renderItem={({ language, isActive }) => ...} />
 *
 * // Force open upward (e.g. in a footer)
 * <LocaleDropdown placement="top" />
 * ```
 */
export function LocaleDropdown(props: LocaleDropdownProps) {
  const { locale, navigate, isReady } = useLocalePath();
  const { languages, isLoading } = useLanguages();

  return (
    <LocaleDropdownBase
      locale={locale}
      languages={languages}
      onLocaleChange={navigate}
      isLoading={!isReady || isLoading}
      {...props}
    />
  );
}
