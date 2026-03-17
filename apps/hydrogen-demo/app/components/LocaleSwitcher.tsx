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
      <span className="text-base leading-none" aria-hidden="true">
        {LOCALE_EMOJI[code] || "\u{1F310}"}
      </span>
    );
  }

  return (
    <img
      src={flagUrl}
      alt={alt}
      className="h-4 w-6 rounded-[4px] object-cover"
    />
  );
}

export function LocaleSwitcher({ locale, languages }: LocaleSwitcherProps) {
  const location = useLocation();
  const availableLocales = languages.map((language) => language.code);

  function getLocaleHref(newLocale: string) {
    const currentPath = location.pathname;
    const allLocales = new Set([...availableLocales, locale, "en"]);
    const localePattern = [...allLocales].map(escapeRegExp).join("|");
    const pathWithoutLocale = localePattern
      ? currentPath.replace(new RegExp(`^/(${localePattern})(?=/|$)`), "") || "/"
      : currentPath || "/";
    const newPath =
      newLocale === "en"
        ? pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale}`;

    return newPath + location.search + location.hash;
  }

  const current =
    languages.find((language) => language.code === locale) ||
    languages[0] || {
      code: locale,
      name: locale,
      nativeName: locale,
      flagUrl: null,
    };

  return (
    <details className="group relative">
      <summary className="flex h-11 list-none items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-left shadow-sm transition duration-200 hover:border-black/14 hover:bg-white [&::-webkit-details-marker]:hidden">
        <FlagIcon
          code={current.code}
          flagUrl={current.flagUrl}
          alt={`${current.nativeName || current.name || current.code} flag`}
        />
        <span className="text-sm font-semibold text-slate-800">
          {current.code.toUpperCase()}
        </span>
        <svg
          className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180"
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

      <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-black/8 bg-white p-1.5 shadow-lg">
        <div className="space-y-0.5">
          {languages.map((language) => {
            const isActive = language.code === locale;
            return (
              <a
                key={language.code}
                href={getLocaleHref(language.code)}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <FlagIcon
                  code={language.code}
                  flagUrl={language.flagUrl}
                  alt={`${language.nativeName || language.name || language.code} flag`}
                />

                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {language.nativeName || language.name || language.code}
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
      </div>
    </details>
  );
}
