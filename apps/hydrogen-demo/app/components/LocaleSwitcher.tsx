import { useLocation } from "react-router";
import type { LanguageOption } from "@better-i18n/remix";

const LOCALE_EMOJI: Record<string, string> = {
  en: "\u{1F1EC}\u{1F1E7}",
  tr: "\u{1F1F9}\u{1F1F7}",
  es: "\u{1F1EA}\u{1F1F8}",
  fr: "\u{1F1EB}\u{1F1F7}",
  de: "\u{1F1E9}\u{1F1EA}",
};

interface LocaleSwitcherProps {
  locale: string;
  languages: LanguageOption[];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function FlagIcon({
  code,
  flagUrl,
  alt,
}: {
  code: string;
  flagUrl?: string | null;
  alt: string;
}) {
  if (!flagUrl) {
    return (
      <span className="text-sm leading-none" aria-hidden="true">
        {LOCALE_EMOJI[code] ?? "\u{1F310}"}
      </span>
    );
  }
  return <img src={flagUrl} alt={alt} className="h-3.5 w-5 object-cover" />;
}

export function LocaleSwitcher({ locale, languages }: LocaleSwitcherProps) {
  const location = useLocation();
  const availableLocales = languages.map((l) => l.code);

  function getLocaleHref(newLocale: string) {
    const currentPath = location.pathname;
    const allLocales = new Set([...availableLocales, locale, "en"]);
    const localePattern = [...allLocales].map(escapeRegExp).join("|");
    const pathWithoutLocale = localePattern
      ? currentPath.replace(
          new RegExp(`^/(${localePattern})(?=/|$)`),
          "",
        ) || "/"
      : currentPath || "/";
    const newPath =
      newLocale === "en"
        ? pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale}`;
    return newPath + location.search + location.hash;
  }

  const current =
    languages.find((l) => l.code === locale) ??
    languages[0] ?? {
      code: locale,
      name: locale,
      nativeName: locale,
      flagUrl: null,
    };

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 border border-stone-200 bg-white px-3 py-1.5 text-left text-[13px] text-stone-600 transition-colors hover:bg-stone-50 [&::-webkit-details-marker]:hidden">
        <FlagIcon
          code={current.code}
          flagUrl={current.flagUrl}
          alt={`${current.nativeName ?? current.name ?? current.code} flag`}
        />
        <span className="font-medium">{current.code.toUpperCase()}</span>
        <svg
          className="h-3 w-3 text-stone-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden border border-stone-200 bg-white shadow-lg">
        {languages.map((lang) => {
          const isActive = lang.code === locale;
          return (
            <a
              key={lang.code}
              href={getLocaleHref(lang.code)}
              className={`flex items-center gap-2.5 px-3 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <FlagIcon
                code={lang.code}
                flagUrl={lang.flagUrl}
                alt={`${lang.nativeName ?? lang.name ?? lang.code} flag`}
              />
              <span className="flex-1 truncate">
                {lang.nativeName ?? lang.name ?? lang.code}
              </span>
              {isActive ? (
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : null}
            </a>
          );
        })}
      </div>
    </details>
  );
}
