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
  label?: string;
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
      className="h-4 w-6 rounded-[4px] object-cover shadow-[0_2px_10px_-6px_rgba(15,23,42,0.45)]"
    />
  );
}

export function LocaleSwitcher({ locale, languages, label }: LocaleSwitcherProps) {
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
      <summary className="flex min-w-[12.75rem] list-none items-center gap-3 rounded-full border border-black/8 bg-white/78 px-4 py-2.5 text-left shadow-[0_14px_34px_-24px_rgba(15,23,42,0.65)] backdrop-blur transition duration-200 hover:border-black/14 hover:bg-white [&::-webkit-details-marker]:hidden">
        <FlagIcon
          code={current.code}
          flagUrl={current.flagUrl}
          alt={`${current.nativeName || current.name || current.code} flag`}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-800">
            {current.nativeName || current.name || current.code}
          </span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-transform group-open:rotate-180">
          <svg
            className="h-4 w-4"
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
        </span>
      </summary>

      <div className="absolute right-0 top-[calc(100%+0.7rem)] z-50 w-[18rem] overflow-hidden rounded-[28px] border border-black/8 bg-white/95 p-2 shadow-[0_34px_90px_-36px_rgba(15,23,42,0.42)] backdrop-blur-xl">
        <div className="px-3 pb-2 pt-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {label || "Available languages"}
          </p>
        </div>

        <div className="space-y-1">
          {languages.map((language) => {
            const isActive = language.code === locale;
            return (
              <a
                key={language.code}
                href={getLocaleHref(language.code)}
                className={`flex items-center gap-3 rounded-[20px] px-3 py-3 text-left transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isActive ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <FlagIcon
                    code={language.code}
                    flagUrl={language.flagUrl}
                    alt={`${language.nativeName || language.name || language.code} flag`}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {language.nativeName || language.name || language.code}
                  </span>
                </span>

                {isActive ? (
                  <svg
                    className="h-4 w-4 shrink-0"
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
