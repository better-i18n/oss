import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LOCALE_DATABASE } from "@/lib/tools/locales";
import type { LocaleData } from "@/lib/tools/types";

export const Route = createFileRoute("/$locale/tools/locale-explorer")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "toolsLocaleExplorer",
      pathname: "/tools/locale-explorer",
      pageType: "tool",
      metaFallback: {
        title: "Locale Explorer — Language & Region Reference",
        description:
          "Browse 250+ locales with Intl API examples, CLDR plural rules, and framework config snippets.",
      },
    }),
  component: LocaleExplorerPage,
});

const SCRIPT_TYPES = [
  { value: "", label: "All Scripts" },
  { value: "Latn", label: "Latin" },
  { value: "Arab", label: "Arabic" },
  { value: "Cyrl", label: "Cyrillic" },
  { value: "Hans", label: "Chinese Simplified" },
  { value: "Hant", label: "Chinese Traditional" },
  { value: "Deva", label: "Devanagari" },
  { value: "Jpan", label: "Japanese" },
  { value: "Kore", label: "Korean" },
  { value: "Hebr", label: "Hebrew" },
  { value: "Thai", label: "Thai" },
];

function formatSampleDate(code: string): string {
  try {
    return new Intl.DateTimeFormat(code, { dateStyle: "medium" }).format(
      new Date(),
    );
  } catch {
    return "—";
  }
}

const faqItems = [
  {
    question: "What is a BCP 47 locale code?",
    answer:
      "BCP 47 (Best Current Practice 47) is an IETF standard for language tags. A locale code like 'en-US' consists of a primary language subtag ('en' for English) and an optional region subtag ('US' for United States). You can also include script subtags (e.g., 'zh-Hans' for Simplified Chinese) and other extensions.",
  },
  {
    question: "What's the difference between a language tag and a locale?",
    answer:
      "A language tag identifies a natural language (e.g., 'fr' for French), while a locale is a broader concept that includes language plus regional preferences for formatting dates, numbers, currencies, and sorting. A locale like 'fr-CA' specifies French as used in Canada, which may differ from 'fr-FR' in date and number formats.",
  },
  {
    question: "What are CLDR plural categories?",
    answer:
      "CLDR (Common Locale Data Repository) defines plural rules that determine how nouns change based on number. Categories include: zero, one, two, few, many, and other. English has only 'one' and 'other', while Arabic uses all six categories. These rules are essential for correct pluralization in localized apps.",
  },
  {
    question: "What does RTL mean and which locales use it?",
    answer:
      "RTL stands for Right-to-Left — the text direction used in languages like Arabic (ar), Hebrew (he), and Persian (fa). Supporting RTL requires mirroring your UI layout, using CSS logical properties (margin-inline-start instead of margin-left), and setting the dir='rtl' attribute on the HTML element.",
  },
  {
    question: "How do I use these locale codes in my framework?",
    answer:
      "Each locale code shown here is a valid BCP 47 tag you can pass directly to Intl APIs and most i18n libraries. For example: new Intl.DateTimeFormat('ja-JP').format(date) or i18n.changeLanguage('de-DE'). Click any locale row to see ready-to-use config snippets for next-intl, react-intl, and i18next.",
  },
];

function LocaleRow({
  localeData,
  locale,
}: {
  readonly localeData: LocaleData;
  readonly locale: string;
}) {
  const sampleDate = formatSampleDate(localeData.code);

  return (
    <Link
      to="/$locale/tools/locale-explorer/$localeCode"
      params={{ locale, localeCode: localeData.code }}
      className="group grid grid-cols-[minmax(80px,1fr)_minmax(140px,2fr)_minmax(100px,1fr)_80px_60px_minmax(100px,1fr)] items-center gap-4 border-b border-mist-100 px-4 py-3 text-sm transition-colors hover:bg-mist-50 last:border-b-0"
    >
      <span className="font-mono text-xs font-medium text-mist-950">
        {localeData.code}
      </span>
      <span className="text-mist-800">{localeData.englishName}</span>
      <span className="text-mist-600">{localeData.region ?? "—"}</span>
      <span className="text-mist-600">{localeData.script ?? "—"}</span>
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          localeData.direction === "rtl"
            ? "bg-amber-50 text-amber-700"
            : "bg-mist-100 text-mist-600"
        }`}
      >
        {localeData.direction.toUpperCase()}
      </span>
      <span className="text-mist-500 group-hover:text-mist-700 transition-colors">
        {sampleDate}
      </span>
    </Link>
  );
}

function LocaleExplorerPage() {
  const { locale } = Route.useParams();
  const [search, setSearch] = useState("");
  const [rtlOnly, setRtlOnly] = useState(false);
  const [scriptFilter, setScriptFilter] = useState("");

  const filteredLocales = useMemo<readonly LocaleData[]>(() => {
    const q = search.toLowerCase().trim();
    return LOCALE_DATABASE.filter((loc) => {
      if (rtlOnly && loc.direction !== "rtl") return false;
      if (scriptFilter && loc.script !== scriptFilter) return false;
      if (q) {
        return (
          loc.code.toLowerCase().includes(q) ||
          loc.englishName.toLowerCase().includes(q) ||
          loc.nativeName.toLowerCase().includes(q) ||
          (loc.region?.toLowerCase().includes(q) ?? false) ||
          (loc.script?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [search, rtlOnly, scriptFilter]);

  const breadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Free Tools", href: `/${locale}/tools` },
    { label: "Locale Explorer" },
  ];

  return (
    <ToolLayout
      title="Locale Explorer"
      description="Browse all locales with Intl API live output, CLDR plural rules, and ready-to-use framework config snippets."
      subtitle="Free Developer Tool"
      currentSlug="locale-explorer"
      locale={locale}
      faqItems={faqItems}
      breadcrumbs={breadcrumbs}
      ctaText="Support all these locales with Better i18n"
    >
      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, language, country…"
            className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-4 text-sm text-mist-950 placeholder-mist-400 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={scriptFilter}
            onChange={(e) => setScriptFilter(e.target.value)}
            className="rounded-xl border border-mist-200 bg-white px-3 py-2.5 text-sm text-mist-700 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
          >
            {SCRIPT_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setRtlOnly((prev) => !prev)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              rtlOnly
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-mist-200 bg-white text-mist-700 hover:bg-mist-50"
            }`}
          >
            RTL Only
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-4 text-sm text-mist-500">
        Showing{" "}
        <span className="font-medium text-mist-700">{filteredLocales.length}</span>{" "}
        of {LOCALE_DATABASE.length} locales
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
        {/* Header */}
        <div className="grid grid-cols-[minmax(80px,1fr)_minmax(140px,2fr)_minmax(100px,1fr)_80px_60px_minmax(100px,1fr)] gap-4 border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-mist-500">
          <span>Code</span>
          <span>Language</span>
          <span>Region</span>
          <span>Script</span>
          <span>Dir</span>
          <span>Sample Date</span>
        </div>

        {filteredLocales.length === 0 ? (
          <div className="py-16 text-center text-sm text-mist-500">
            No locales match your search.
          </div>
        ) : (
          <div>
            {filteredLocales.map((loc) => (
              <LocaleRow key={loc.code} localeData={loc} locale={locale} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="mt-10 rounded-xl border border-mist-200 bg-mist-950 px-6 py-8 text-center">
        <p className="font-display text-xl font-medium text-white">
          Support all these locales with zero config
        </p>
        <p className="mt-2 text-sm text-mist-400">
          Better i18n auto-detects your locales and syncs translations across every region.
        </p>
        <a
          href="https://dash.better-i18n.com"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-mist-950 transition-colors hover:bg-mist-100"
        >
          Try Better i18n free
        </a>
      </div>
    </ToolLayout>
  );
}
