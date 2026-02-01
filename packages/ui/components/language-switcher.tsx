"use client";

import { IconCheckmark1, IconChevronBottom, IconGlobe } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import * as React from "react";

import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface LanguageOption {
  code: string;
  name?: string;
  nativeName?: string;
  flagUrl?: string | null;
}

export interface LanguageSwitcherProps {
  currentLocale: string;
  languages: LanguageOption[];
  isLoading?: boolean;
  onSelect: (locale: string) => void;
  className?: string;
  menuClassName?: string;
}

const getLanguageLabel = (language: LanguageOption) =>
  language.nativeName || language.name || language.code.toUpperCase();

export function LanguageSwitcher({
  currentLocale,
  languages,
  isLoading = false,
  onSelect,
  className,
  menuClassName,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (isLoading) {
    return (
      <button
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400",
          className,
        )}
        disabled
        aria-busy="true"
      >
        <IconGlobe className="size-4 animate-pulse" />
        <span className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </button>
    );
  }

  const currentLanguage = languages.find(
    (language) => language.code === currentLocale,
  );
  const currentLabel = currentLanguage
    ? getLanguageLabel(currentLanguage)
    : currentLocale.toUpperCase();
  const canToggle = languages.length > 1;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={!canToggle}>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            !canToggle &&
            "cursor-default opacity-70 hover:bg-transparent dark:hover:bg-transparent",
            className,
          )}
          aria-label="Select language"
        >
          {currentLanguage?.flagUrl ? (
            <img
              src={currentLanguage.flagUrl}
              alt={currentLabel}
              className="h-4 w-5 object-cover rounded-sm"
              loading="lazy"
            />
          ) : (
            <IconGlobe className="size-4 text-gray-400" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{currentLabel}</span>
          {canToggle ? (
            <IconChevronBottom
              className={cn(
                "size-4 text-gray-400 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          ) : null}
        </button>
      </DropdownMenuTrigger>
      {canToggle ? (
        <DropdownMenuContent
          align="end"
          className={cn(
            "w-48 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-background shadow-lg py-1",
            menuClassName,
          )}
        >
          {languages.map((language) => {
            const label = getLanguageLabel(language);
            const isActive = language.code === currentLocale;
            return (
              <DropdownMenuItem
                key={language.code}
                onSelect={() => onSelect(language.code)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors",
                  isActive
                    ? "bg-gray-100 dark:bg-background text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800",
                )}
              >
                {language.flagUrl ? (
                  <img
                    src={language.flagUrl}
                    alt={label}
                    className="h-4 w-5 object-cover rounded-sm"
                    loading="lazy"
                  />
                ) : (
                  <IconGlobe className="size-4 text-gray-400" aria-hidden="true" />
                )}
                <span className="flex-1 text-left">{label}</span>
                {isActive ? (
                  <IconCheckmark1 className="size-4 text-emerald-500" />
                ) : null}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
}
