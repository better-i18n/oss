import { createFileRoute, Link } from "@tanstack/react-router";
import { createPageLoader, getPageHead, getBreadcrumbItems } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { MarketingBreadcrumb } from "@/components/MarketingBreadcrumb";
import { FORMATS } from "@/lib/tools/formats";

export const Route = createFileRoute("/$locale/tools/translation-file-converter")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "translationFileConverter",
      pathname: "/tools/translation-file-converter",
      pageType: "tool",
      metaFallback: {
        title: "Translation File Converter — Better i18n Free Tools",
        description:
          "Convert translation files between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Java Properties. Free, browser-based, no upload required.",
      },
      structuredDataOptions: {
        title: "Translation File Converter",
        description:
          "Convert translation files between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Java Properties.",
        url: "https://better-i18n.com/tools/translation-file-converter",
      },
    });
  },
  component: TranslationFileConverterHubPage,
});

const FAQ_ITEMS = [
  {
    question: "What is a translation file?",
    answer:
      "A translation file stores localized strings for an application in a structured format. Each file maps a key (or source text) to a translated value. Different frameworks and platforms use different file formats: React apps typically use JSON, Ruby on Rails uses YAML, Android uses XML, iOS uses .strings files, and GNU gettext uses PO files.",
  },
  {
    question: "What formats does this converter support?",
    answer:
      "This tool supports 9 formats: JSON (flat and nested), PO/gettext, XLIFF 1.2, ARB (Flutter/Dart), YAML, CSV, Android strings.xml, iOS .strings, and Java .properties. All conversions run in the browser — no file is uploaded to any server.",
  },
  {
    question: "Does it support nested JSON?",
    answer:
      "Yes. When you paste nested JSON like {\"buttons\": {\"submit\": \"Send\"}}, the converter flattens the keys using dot notation (buttons.submit = Send). When converting back to JSON, dot-separated keys are expanded back into a nested structure.",
  },
  {
    question: "What is the ARB format?",
    answer:
      "ARB (Application Resource Bundle) is the standard localization format for Flutter and Dart applications. It looks like JSON but includes @key metadata entries with descriptions and placeholder info. This converter handles both the string entries and their metadata.",
  },
  {
    question: "What is the PO/gettext format?",
    answer:
      "PO (Portable Object) is the GNU gettext translation format, commonly used by PHP, Python, Ruby, and C/C++ applications. Each entry has a msgid (source string) and msgstr (translated string), with optional context and comments.",
  },
  {
    question: "Is my file data secure?",
    answer:
      "Yes. All parsing and conversion happens entirely in your browser using JavaScript. No file content is ever sent to a server. Your translation strings remain private on your device.",
  },
] as const;

const ACTIVE_FORMATS = new Set(["json"]);

function TranslationFileConverterHubPage() {
  const { locale } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const messages = loaderData?.messages || {};

  const breadcrumbs = getBreadcrumbItems("/tools/translation-file-converter", messages);

  return (
    <ToolLayout
      title="Translation File Converter"
      description="Convert translation files between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Java Properties — all in the browser."
      currentSlug="translation-file-converter"
      locale={locale}
      faqItems={FAQ_ITEMS as unknown as Array<{ question: string; answer: string }>}
      breadcrumbs={breadcrumbs}
    >
      {/* Format Matrix */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-mist-950 mb-2">
          Choose a conversion pair
        </h2>
        <p className="text-sm text-mist-600 mb-6">
          Click a cell to convert between formats. More format pairs are coming soon.
        </p>
        <FormatMatrix locale={locale} />
      </section>

      {/* Format Descriptions */}
      <section>
        <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-mist-950 mb-6">
          Supported formats
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((format) => (
            <div
              key={format.id}
              className="rounded-xl border border-mist-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md border border-mist-200 bg-mist-50 px-2 py-0.5 font-mono text-xs text-mist-700">
                  {format.extension}
                </span>
                <h3 className="text-sm font-medium text-mist-950">{format.name}</h3>
              </div>
              <p className="text-xs/5 text-mist-600">{format.description}</p>
            </div>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}

function FormatMatrix({ locale }: { locale: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-mist-200 bg-white">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr className="bg-mist-50">
            <th className="border-b border-r border-mist-200 px-3 py-2 text-left text-xs font-medium text-mist-500 w-28">
              From \ To
            </th>
            {FORMATS.map((format) => (
              <th
                key={format.id}
                className="border-b border-r border-mist-200 px-3 py-2 text-center font-medium text-mist-700 last:border-r-0 min-w-[80px]"
              >
                {format.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FORMATS.map((sourceFormat) => (
            <tr key={sourceFormat.id} className="border-b border-mist-100 last:border-b-0">
              <td className="border-r border-mist-200 px-3 py-2 font-medium text-mist-700 bg-mist-50 whitespace-nowrap">
                {sourceFormat.name}
              </td>
              {FORMATS.map((targetFormat) => (
                <MatrixCell
                  key={targetFormat.id}
                  sourceId={sourceFormat.id}
                  targetId={targetFormat.id}
                  locale={locale}
                  isActive={ACTIVE_FORMATS.has(sourceFormat.id) && ACTIVE_FORMATS.has(targetFormat.id)}
                  isSame={sourceFormat.id === targetFormat.id}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MatrixCellProps {
  readonly sourceId: string;
  readonly targetId: string;
  readonly locale: string;
  readonly isActive: boolean;
  readonly isSame: boolean;
}

function MatrixCell({ sourceId, targetId, locale, isActive, isSame }: MatrixCellProps) {
  if (isSame) {
    return (
      <td className="border-r border-mist-100 px-3 py-2 text-center last:border-r-0">
        <span className="text-mist-200">—</span>
      </td>
    );
  }

  const slug = `${sourceId}-to-${targetId}`;

  if (isActive) {
    return (
      <td className="border-r border-mist-100 px-3 py-2 text-center last:border-r-0">
        <Link
          to="/$locale/tools/translation-file-converter/$pair"
          params={{ locale, pair: slug }}
          className="inline-flex items-center justify-center rounded-lg bg-mist-950 px-2 py-1 text-xs font-medium text-white hover:bg-mist-700 transition-colors"
          title={`Convert ${sourceId} to ${targetId}`}
        >
          Convert
        </Link>
      </td>
    );
  }

  return (
    <td className="border-r border-mist-100 px-3 py-2 text-center last:border-r-0">
      <span
        className="inline-flex items-center justify-center rounded-lg border border-mist-100 bg-mist-50 px-2 py-1 text-xs text-mist-300 cursor-not-allowed"
        title="Coming soon"
      >
        Soon
      </span>
    </td>
  );
}
