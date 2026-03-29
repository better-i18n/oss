"use client";

import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LocaleDropdownBase,
  type LocaleDropdownBaseProps,
  type LocaleDropdownRenderContext,
} from "@better-i18n/core/react";
import { useLanguages, useLocale } from "./hooks.js";

export type { LocaleDropdownRenderContext };

export interface LocaleDropdownProps
  extends Omit<LocaleDropdownBaseProps, "locale" | "languages" | "onLocaleChange" | "isLoading"> {
  /** Default locale (no URL prefix). @default "en" */
  defaultLocale?: string;
}

/**
 * Styled locale dropdown for Remix / React Router with URL-based locale switching.
 *
 * Uses `useLanguages()` and `useLocale()` from the Remix provider context, and
 * React Router's `useNavigate()` for SPA navigation.
 *
 * @example
 * ```tsx
 * import { LocaleDropdown } from "@better-i18n/remix/react";
 *
 * function Header() {
 *   return <LocaleDropdown />;
 * }
 * ```
 */
export function LocaleDropdown({ defaultLocale = "en", ...props }: LocaleDropdownProps) {
  const locale = useLocale();
  const languages = useLanguages();
  const location = useLocation();
  const navigateTo = useNavigate();
  const isLoading = languages.length === 0;

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      const nonDefaultCodes = languages.filter((l) => !l.isDefault).map((l) => l.code);
      const regex = new RegExp(`^/(${nonDefaultCodes.join("|")})`);
      const pathWithoutLocale = location.pathname.replace(regex, "") || "/";
      const isDefault = newLocale === defaultLocale;
      navigateTo((isDefault ? "" : `/${newLocale}`) + pathWithoutLocale + location.search);
    },
    [languages, location.pathname, location.search, defaultLocale, navigateTo],
  );

  return (
    <LocaleDropdownBase
      locale={locale}
      languages={languages}
      onLocaleChange={handleLocaleChange}
      isLoading={isLoading}
      {...props}
    />
  );
}
