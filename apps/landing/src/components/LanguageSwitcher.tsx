import { Button } from "@better-i18n/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@better-i18n/ui/components/dropdown-menu";
import { cn } from "@better-i18n/ui/lib/utils";
import { useLanguages, useLocaleRouter } from "@better-i18n/use-intl";
import {
  IconChevronBottom,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

/**
 * Language switcher with proper router integration.
 *
 * Uses useLocaleRouter() which triggers TanStack Router navigation,
 * causing loaders to re-execute with the new locale. This ensures:
 * - Proper SPA navigation (no full page reload)
 * - Loaders fetch new messages
 * - URL updates correctly
 * - Browser history works as expected
 */
export function LanguageSwitcher() {
  const { locale, navigate, isReady } = useLocaleRouter();
  const { languages, isLoading: isLoadingLangs } = useLanguages();

  const handleChange = (newLocale: string) => {
    // Router navigation handles everything:
    // - URL update
    // - Loader re-execution (fetches new messages)
    // - Component re-render with new locale
    navigate(newLocale);
  };

  if (!isReady || isLoadingLangs) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-mist-500">
        <IconGlobe className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  const currentLanguage = languages.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 font-medium text-mist-600 hover:text-mist-950 hover:bg-mist-100"
        >
          {currentLanguage?.flagUrl ? (
            <img
              src={currentLanguage.flagUrl}
              alt=""
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <IconGlobe className="mr-2 h-4 w-4" />
          )}
          {currentLanguage?.nativeName || locale.toUpperCase()}
          <IconChevronBottom className="ml-2 h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] z-[100] bg-white"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={cn(
              "flex items-center justify-between gap-3 cursor-pointer",
              locale === lang.code ? "bg-mist-50 font-semibold" : "",
            )}
          >
            <div className="flex items-center gap-2.5">
              {lang.flagUrl && (
                <img
                  src={lang.flagUrl}
                  alt=""
                  className="h-4 w-4 rounded-full object-cover shrink-0"
                />
              )}
              <span>{lang.nativeName}</span>
            </div>
            <span className="text-[10px] text-mist-400 uppercase font-mono">
              {lang.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
