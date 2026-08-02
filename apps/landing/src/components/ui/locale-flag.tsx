/**
 * Locale flag + locale chip.
 *
 * Flags come from the platform's own asset host (`s3.better-i18n.com/flags/{cc}`),
 * the same source the dashboard's language picker uses, so a marketing page and
 * the product can never drift apart on how a language looks.
 *
 * Note the host keys flags by COUNTRY code, not language: `ja` and `ko` 404 —
 * the files are `jp` and `kr`. That mapping is the whole reason this is one
 * shared module instead of an inline URL at each call site.
 */

const FLAG_BASE = "https://s3.better-i18n.com/flags";

/** Locale → country code for the flag asset. */
const FLAG_COUNTRY: Record<string, string> = {
  en: "gb",
  tr: "tr",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  nl: "nl",
  ja: "jp",
  ko: "kr",
  zh: "cn",
  pt: "br",
  ru: "ru",
};

export function LocaleFlag({ locale, size = 14 }: { locale: string; size?: number }) {
  const country = FLAG_COUNTRY[locale] ?? locale;
  return (
    <img
      src={`${FLAG_BASE}/${country}/w320.png`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      // Flags are wider than tall; a fixed box with object-cover keeps a row of
      // them optically equal instead of jittering with each aspect ratio.
      //
      // The inset hairline is load-bearing, not decoration: several flags are a
      // white field with a mark in it (jp above all). Without an edge, `ja` on a
      // white card renders as a stray red dot with no flag around it.
      className="shrink-0 rounded-[2px] object-cover"
      style={{
        width: size,
        height: Math.round(size * 0.72),
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
      }}
    />
  );
}

/** Locale chip: flag + uppercase code, used wherever the panel names a locale. */
export function LocaleChip({ locale, label }: { locale: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-black/[0.06] px-1 py-px">
      <LocaleFlag locale={locale} size={12} />
      <span className="font-mono text-[10px] font-medium text-mist-600">
        {(label ?? locale).toUpperCase()}
      </span>
    </span>
  );
}
