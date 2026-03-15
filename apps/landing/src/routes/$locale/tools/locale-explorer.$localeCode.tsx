import { createFileRoute, Link } from "@tanstack/react-router";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { CodeOutput } from "@/components/tools/CodeOutput";
import {
  getLocaleByCode,
  getRelatedLocales,
} from "@/lib/tools/locales";

export const Route = createFileRoute(
  "/$locale/tools/locale-explorer/$localeCode",
)({
  loader: createPageLoader(),
  head: ({ loaderData, params }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "toolsLocaleExplorerDetail",
      pathname: `/tools/locale-explorer/${params.localeCode}`,
      metaFallback: {
        title: `${params.localeCode} Locale Reference & Formatting Guide`,
        description: `Complete reference for ${params.localeCode} locale — date/number formatting, plural rules, and framework config.`,
      },
    }),
  component: LocaleDetailPage,
});

// --- Intl helpers ---

interface DateSample {
  readonly label: string;
  readonly style: "short" | "medium" | "long" | "full";
}

const DATE_STYLES: readonly DateSample[] = [
  { label: "Short", style: "short" },
  { label: "Medium", style: "medium" },
  { label: "Long", style: "long" },
  { label: "Full", style: "full" },
];

function formatDate(code: string, style: Intl.DateTimeFormatOptions["dateStyle"]): string {
  try {
    return new Intl.DateTimeFormat(code, { dateStyle: style }).format(new Date());
  } catch {
    return "—";
  }
}

function formatNumber(code: string, value: number, style: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(code, style).format(value);
  } catch {
    return "—";
  }
}

function formatRelativeTime(code: string): string {
  try {
    const rtf = new Intl.RelativeTimeFormat(code, { numeric: "auto" });
    return rtf.format(-3, "day");
  } catch {
    return "—";
  }
}

function formatList(code: string): string {
  try {
    const lf = new Intl.ListFormat(code, { style: "long", type: "conjunction" });
    return lf.format(["apples", "oranges", "bananas"]);
  } catch {
    return "—";
  }
}

const PLURAL_EXAMPLE_NUMBERS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 11,
  other: 100,
};

function getPluralCategory(code: string, n: number): string {
  try {
    const pr = new Intl.PluralRules(code);
    return pr.select(n);
  } catch {
    return "—";
  }
}

// --- Framework config snippet builders ---

function buildNextIntlConfig(code: string): string {
  return `// next-intl configuration
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl({});

// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['${code}', 'en'],
  defaultLocale: 'en',
});`;
}

function buildReactIntlConfig(code: string): string {
  return `// react-intl configuration
import { IntlProvider } from 'react-intl';
import messages from './messages/${code}.json';

function App() {
  return (
    <IntlProvider locale="${code}" messages={messages}>
      {/* your app */}
    </IntlProvider>
  );
}`;
}

function buildI18nextConfig(code: string): string {
  return `// i18next configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: '${code}',
    fallbackLng: 'en',
    resources: {
      '${code}': {
        translation: require('./locales/${code}/translation.json'),
      },
    },
  });

export default i18n;`;
}

// --- Components ---

interface SectionHeadingProps {
  readonly children: string;
}
function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="font-display text-xl font-medium text-mist-950 mb-4">
      {children}
    </h2>
  );
}

interface InfoRowProps {
  readonly label: string;
  readonly value: string;
}
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-mist-100 last:border-b-0">
      <span className="text-sm text-mist-600">{label}</span>
      <span className="text-sm font-medium text-mist-950">{value}</span>
    </div>
  );
}

function LocaleDetailPage() {
  const { locale, localeCode } = Route.useParams();
  const localeData = getLocaleByCode(localeCode);
  const relatedLocales = getRelatedLocales(localeCode);

  const breadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Free Tools", href: `/${locale}/tools` },
    { label: "Locale Explorer", href: `/${locale}/tools/locale-explorer` },
    { label: localeCode },
  ];

  if (!localeData) {
    return (
      <ToolLayout
        title={`Locale "${localeCode}" not found`}
        description="This locale code was not found in our database."
        currentSlug="locale-explorer"
        locale={locale}
        breadcrumbs={breadcrumbs}
      >
        <div className="rounded-xl border border-mist-200 bg-white p-8 text-center">
          <p className="text-mist-600 mb-4">
            The locale <code className="rounded bg-mist-100 px-1.5 py-0.5 text-sm">{localeCode}</code> is not in our database.
          </p>
          <Link
            to="/$locale/tools/locale-explorer"
            params={{ locale }}
            className="inline-flex items-center justify-center rounded-xl border border-mist-200 px-4 py-2 text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors"
          >
            Browse all locales
          </Link>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title={`${localeData.englishName} (${localeCode})`}
      description={`Complete reference for the ${localeCode} locale — live Intl API output, CLDR plural rules, and framework config snippets.`}
      subtitle="Locale Reference"
      currentSlug="locale-explorer"
      locale={locale}
      breadcrumbs={breadcrumbs}
      ctaText="This locale is supported by Better i18n"
    >
      <div className="space-y-10">

        {/* 1. Locale Metadata */}
        <section>
          <SectionHeading>Locale Metadata</SectionHeading>
          <div className="overflow-hidden rounded-xl border border-mist-200 bg-white px-4">
            <InfoRow label="BCP 47 Code" value={localeData.code} />
            <InfoRow label="Native Name" value={localeData.nativeName} />
            <InfoRow label="English Name" value={localeData.englishName} />
            <InfoRow label="Language" value={localeData.language} />
            <InfoRow label="Region" value={localeData.region ?? "None (base locale)"} />
            <InfoRow label="Script" value={localeData.script ?? "—"} />
            <InfoRow
              label="Text Direction"
              value={localeData.direction === "rtl" ? "Right-to-Left (RTL)" : "Left-to-Right (LTR)"}
            />
            <InfoRow
              label="CLDR Plural Categories"
              value={localeData.pluralCategories.join(", ")}
            />
            {localeData.speakerPopulation !== null && (
              <InfoRow
                label="Estimated Speakers"
                value={`~${new Intl.NumberFormat("en").format(localeData.speakerPopulation)}`}
              />
            )}
          </div>
        </section>

        {/* 2. Intl API Live Output */}
        <section>
          <SectionHeading>Intl API Live Output</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Date formatting */}
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <div className="border-b border-mist-100 bg-mist-50 px-4 py-2.5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-mist-500">
                  DateTimeFormat
                </h3>
              </div>
              <div className="px-4">
                {DATE_STYLES.map(({ label, style }) => (
                  <div
                    key={style}
                    className="flex items-center justify-between py-2.5 border-b border-mist-100 last:border-b-0"
                  >
                    <span className="text-xs font-medium text-mist-500">{label}</span>
                    <span
                      className="text-sm text-mist-950"
                      dir={localeData.direction}
                    >
                      {formatDate(localeCode, style)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Number formatting */}
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <div className="border-b border-mist-100 bg-mist-50 px-4 py-2.5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-mist-500">
                  NumberFormat
                </h3>
              </div>
              <div className="px-4">
                <div className="flex items-center justify-between py-2.5 border-b border-mist-100">
                  <span className="text-xs font-medium text-mist-500">Decimal</span>
                  <span className="text-sm text-mist-950" dir={localeData.direction}>
                    {formatNumber(localeCode, 1234567.89, { style: "decimal" })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-mist-100">
                  <span className="text-xs font-medium text-mist-500">Currency (USD)</span>
                  <span className="text-sm text-mist-950" dir={localeData.direction}>
                    {formatNumber(localeCode, 9.99, { style: "currency", currency: "USD" })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 border-b border-mist-100">
                  <span className="text-xs font-medium text-mist-500">Percent</span>
                  <span className="text-sm text-mist-950" dir={localeData.direction}>
                    {formatNumber(localeCode, 0.754, { style: "percent" })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-xs font-medium text-mist-500">Compact</span>
                  <span className="text-sm text-mist-950" dir={localeData.direction}>
                    {formatNumber(localeCode, 1200000, { notation: "compact" })}
                  </span>
                </div>
              </div>
            </div>

            {/* RelativeTimeFormat */}
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <div className="border-b border-mist-100 bg-mist-50 px-4 py-2.5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-mist-500">
                  RelativeTimeFormat
                </h3>
              </div>
              <div className="px-4 py-3">
                <span className="text-sm text-mist-950" dir={localeData.direction}>
                  {formatRelativeTime(localeCode)}
                </span>
                <p className="mt-1 text-xs text-mist-400">
                  Output for: -3 days ago
                </p>
              </div>
            </div>

            {/* ListFormat */}
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <div className="border-b border-mist-100 bg-mist-50 px-4 py-2.5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-mist-500">
                  ListFormat
                </h3>
              </div>
              <div className="px-4 py-3">
                <span className="text-sm text-mist-950" dir={localeData.direction}>
                  {formatList(localeCode)}
                </span>
                <p className="mt-1 text-xs text-mist-400">
                  Conjunction list: apples, oranges, bananas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Plural Rules */}
        <section>
          <SectionHeading>CLDR Plural Rules</SectionHeading>
          <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
            <div className="border-b border-mist-100 bg-mist-50 px-4 py-2.5">
              <p className="text-xs text-mist-500">
                Categories supported by <code className="font-mono">{localeCode}</code>:{" "}
                <span className="font-medium text-mist-700">
                  {localeData.pluralCategories.join(", ")}
                </span>
              </p>
            </div>
            <div className="divide-y divide-mist-100">
              {localeData.pluralCategories.map((category) => {
                const exampleN = PLURAL_EXAMPLE_NUMBERS[category] ?? 100;
                const resolved = getPluralCategory(localeCode, exampleN);
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-lg bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-700">
                        {category}
                      </span>
                      <span className="text-sm text-mist-500">
                        Example number: <code className="font-mono">{exampleN}</code>
                      </span>
                    </div>
                    <span className="text-sm text-mist-700">
                      → <span className="font-medium">{resolved}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Framework Config Snippets */}
        <section>
          <SectionHeading>Framework Config Snippets</SectionHeading>
          <div className="space-y-4">
            <CodeOutput
              code={buildNextIntlConfig(localeCode)}
              language="typescript"
              label="next-intl"
            />
            <CodeOutput
              code={buildReactIntlConfig(localeCode)}
              language="tsx"
              label="react-intl"
            />
            <CodeOutput
              code={buildI18nextConfig(localeCode)}
              language="typescript"
              label="i18next"
            />
          </div>
        </section>

        {/* 5. Related Locales */}
        {relatedLocales.length > 0 && (
          <section>
            <SectionHeading>Related Locales</SectionHeading>
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <div className="grid grid-cols-[minmax(80px,1fr)_minmax(140px,2fr)_80px_60px] gap-4 border-b border-mist-200 bg-mist-50 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-mist-500">
                <span>Code</span>
                <span>Name</span>
                <span>Script</span>
                <span>Dir</span>
              </div>
              {relatedLocales.map((rel) => (
                <Link
                  key={rel.code}
                  to="/$locale/tools/locale-explorer/$localeCode"
                  params={{ locale, localeCode: rel.code }}
                  className="grid grid-cols-[minmax(80px,1fr)_minmax(140px,2fr)_80px_60px] items-center gap-4 border-b border-mist-100 px-4 py-3 text-sm transition-colors hover:bg-mist-50 last:border-b-0"
                >
                  <span className="font-mono text-xs font-medium text-mist-950">
                    {rel.code}
                  </span>
                  <span className="text-mist-800">{rel.englishName}</span>
                  <span className="text-mist-600">{rel.script ?? "—"}</span>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      rel.direction === "rtl"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-mist-100 text-mist-600"
                    }`}
                  >
                    {rel.direction.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <div className="rounded-xl border border-mist-200 bg-mist-950 px-6 py-8 text-center">
          <p className="font-display text-xl font-medium text-white">
            {localeData.englishName} is supported by Better i18n
          </p>
          <p className="mt-2 text-sm text-mist-400">
            Add <code className="font-mono text-mist-300">{localeCode}</code> to your project in seconds — no manual config required.
          </p>
          <a
            href="https://dash.better-i18n.com"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-mist-950 transition-colors hover:bg-mist-100"
          >
            Start free trial
          </a>
        </div>

      </div>
    </ToolLayout>
  );
}
