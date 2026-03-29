import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@better-i18n/ui/components/dropdown-menu";
import { cn } from "@better-i18n/ui/lib/utils";
import { useLanguages, useLocalePath } from "@better-i18n/use-intl";
import { IconCheckmark1, IconChevronBottom, IconGlobe } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useState } from "react";

export function LanguageSwitcher() {
  const { locale, navigate, isReady } = useLocalePath();
  const { languages, isLoading: isLoadingLangs } = useLanguages();
  const [isOpen, setIsOpen] = useState(false);

  const isLoading = !isReady || isLoadingLangs;
  const currentLanguage = isLoading ? undefined : languages.find((l) => l.code === locale);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg">
        <span className="size-4 rounded-full bg-mist-200 animate-pulse" />
        <span className="w-14 h-3.5 rounded bg-mist-200 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm font-medium text-mist-600 outline-none",
            "before:absolute before:inset-0 before:rounded-lg before:bg-mist-100 before:opacity-0 before:scale-[0.97] before:transition-all before:duration-150 before:ease-out",
            "hover:text-mist-950 hover:before:opacity-100 hover:before:scale-100",
            "focus-visible:before:opacity-100 focus-visible:before:scale-100",
          )}
          aria-label="Select language"
        >
          <span className="relative flex items-center gap-2">
            {currentLanguage?.flagUrl ? (
              <img
                src={currentLanguage.flagUrl}
                alt=""
                className="size-4 rounded-full object-cover flex-none"
              />
            ) : (
              <IconGlobe className="size-4 flex-none" />
            )}
            <span className="hidden sm:inline">
              {currentLanguage?.nativeName || locale.toUpperCase()}
            </span>
            <IconChevronBottom
              className={cn(
                "size-3.5 opacity-50 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 max-h-[70vh] overflow-y-auto z-[100] rounded-xl border-[var(--color-border)] bg-[var(--color-card)] shadow-xl shadow-black/[0.08] p-1.5"
      >
        {languages.map((lang) => {
          const isActive = locale === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => navigate(lang.code)}
              className={cn(
                "relative flex items-center gap-2.5 px-2.5 py-2 text-sm cursor-pointer rounded-lg outline-none pr-9",
                "before:absolute before:inset-0 before:rounded-lg before:transition-all before:duration-150 before:ease-out before:-z-10",
                isActive
                  ? "before:bg-mist-100 before:opacity-100 before:scale-100 text-mist-950 font-medium"
                  : "before:bg-mist-100 before:opacity-0 before:scale-[0.97] text-mist-600",
                "data-[highlighted]:before:opacity-100 data-[highlighted]:before:scale-100 data-[highlighted]:text-mist-950",
              )}
            >
              {lang.flagUrl ? (
                <img
                  src={lang.flagUrl}
                  alt=""
                  className="size-4 rounded-full object-cover flex-none"
                />
              ) : (
                <IconGlobe className="size-4 flex-none text-mist-400" />
              )}
              <span className="flex-1 truncate">{lang.nativeName || lang.code}</span>
              <span className="text-[10px] text-mist-400 uppercase font-mono flex-none">
                {lang.code}
              </span>
              {isActive && (
                <IconCheckmark1 className="absolute right-2.5 size-3.5 text-emerald-500 flex-none" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
