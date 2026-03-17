"use client";
import type { ComponentProps, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLanguages } from "./hooks.js";

export interface LanguageSwitcherProps
  extends Omit<ComponentProps<"select">, "value" | "onChange" | "children"> {
  locale: string;
  defaultLocale?: string;
  renderOption?: (language: {
    code: string;
    name?: string;
    nativeName?: string;
  }) => ReactNode;
}

export function LanguageSwitcher({
  locale,
  defaultLocale = "en",
  renderOption,
  ...props
}: LanguageSwitcherProps) {
  const languages = useLanguages();
  const location = useLocation();
  const navigate = useNavigate();

  function handleChange(newLocale: string) {
    const nonDefaultCodes = languages
      .filter((l) => !l.isDefault)
      .map((l) => l.code);
    const regex = new RegExp(`^/(${nonDefaultCodes.join("|")})`);
    const pathWithoutLocale = location.pathname.replace(regex, "") || "/";
    const isDefault = newLocale === defaultLocale;
    navigate(
      (isDefault ? "" : `/${newLocale}`) + pathWithoutLocale + location.search,
    );
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      {...props}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {renderOption
            ? renderOption(lang)
            : lang.nativeName || lang.code}
        </option>
      ))}
    </select>
  );
}
