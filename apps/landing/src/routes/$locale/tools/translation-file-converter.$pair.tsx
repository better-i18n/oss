import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { createPageLoader, getPageHead, getBreadcrumbItems } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileUploadZone } from "@/components/tools/FileUploadZone";
import { CodeOutput } from "@/components/tools/CodeOutput";
import { getFormatPairBySlug } from "@/lib/tools/formats";
import { convert } from "@/lib/tools/converters";

export const Route = createFileRoute(
  "/$locale/tools/translation-file-converter/$pair",
)({
  loader: async (ctx) => {
    const { pair } = ctx.params;
    const formatPair = getFormatPairBySlug(pair);
    if (!formatPair) throw notFound();
    const pageLoader = createPageLoader();
    const loaderData = await pageLoader(ctx);
    return { ...loaderData, formatPair };
  },
  head: ({ loaderData }) => {
    const pair = loaderData?.formatPair;
    const sourceName = pair?.source.name ?? "";
    const targetName = pair?.target.name ?? "";
    const title = `${sourceName} to ${targetName} Converter — Better i18n`;
    const description = `Convert ${sourceName} translation files to ${targetName} format instantly. Free, browser-based converter — no file upload required.`;

    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "translationFileConverter",
      pathname: `/tools/translation-file-converter/${loaderData?.formatPair?.slug ?? ""}`,
      pageType: "tool",
      metaFallback: { title, description },
      structuredDataOptions: {
        title,
        description,
        url: `https://better-i18n.com/tools/translation-file-converter/${loaderData?.formatPair?.slug ?? ""}`,
      },
    });
  },
  notFoundComponent: PairNotFound,
  component: ConverterPairPage,
});

const FAQ_ITEMS = [
  {
    question: "How does the converter work?",
    answer:
      "Paste or upload your source file in the left panel, then click Convert. The converter parses your file in the browser and serializes it to the target format. No data leaves your device.",
  },
  {
    question: "What happens to nested keys?",
    answer:
      "Nested structures (like nested JSON or YAML) are flattened to dot-separated keys during conversion. When converting back to JSON or YAML, the dots are expanded back into nested objects.",
  },
  {
    question: "Are there any file size limits?",
    answer:
      "There are no server-side limits because all processing happens in your browser. In practice, very large files (tens of thousands of keys) may cause a brief UI pause during conversion.",
  },
  {
    question: "How do I download the converted file?",
    answer:
      "After converting, click the Download button below the output panel. The file will be saved with the correct extension for the target format.",
  },
] as const;

function ConverterPairPage() {
  const { locale } = Route.useParams();
  const { formatPair, messages } = Route.useLoaderData();

  const [inputContent, setInputContent] = useState("");
  const [outputContent, setOutputContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const breadcrumbs = getBreadcrumbItems(
    `/tools/translation-file-converter/${formatPair.slug}`,
    messages,
  );

  const handleFileContent = (content: string) => {
    setInputContent(content);
    setOutputContent("");
    setError(null);
  };

  const handleConvert = () => {
    if (!inputContent.trim()) {
      setError("Please provide input content to convert.");
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = convert(inputContent, formatPair.source.id, formatPair.target.id);
      setOutputContent(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Conversion failed. Please check your input format.";
      setError(`Error: ${message}`);
      setOutputContent("");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!outputContent) return;
    const blob = new Blob([outputContent], { type: formatPair.target.mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `translations${formatPair.target.extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title={`${formatPair.source.name} to ${formatPair.target.name} Converter`}
      description={`Convert ${formatPair.source.name} translation files to ${formatPair.target.name} format. Paste your content or upload a file — conversion happens instantly in the browser.`}
      subtitle={`${formatPair.source.extension} → ${formatPair.target.extension}`}
      currentSlug="translation-file-converter"
      locale={locale}
      faqItems={FAQ_ITEMS as unknown as Array<{ question: string; answer: string }>}
      breadcrumbs={breadcrumbs}
    >
      {/* Converter UI */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Input */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-mist-700">
              Input{" "}
              <span className="rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 font-mono text-xs text-mist-600">
                {formatPair.source.extension}
              </span>
            </h2>
            <span className="text-xs text-mist-500">{formatPair.source.name}</span>
          </div>
          <FileUploadZone
            onFileContent={handleFileContent}
            accept={formatPair.source.extension}
            label={`Upload ${formatPair.source.name} file`}
            hint={`Drag and drop a ${formatPair.source.extension} file, or paste content below`}
            placeholder={`Paste your ${formatPair.source.name} content here...`}
          />
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-mist-700">
              Output{" "}
              <span className="rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 font-mono text-xs text-mist-600">
                {formatPair.target.extension}
              </span>
            </h2>
            <span className="text-xs text-mist-500">{formatPair.target.name}</span>
          </div>

          {outputContent ? (
            <div className="flex flex-col gap-3">
              <CodeOutput
                code={outputContent}
                language={formatPair.target.id}
                label={`${formatPair.target.name} output`}
                maxHeight="400px"
              />
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm font-medium text-mist-700 hover:bg-mist-50 hover:text-mist-950 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Download {formatPair.target.extension}
              </button>
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-mist-200 bg-mist-50 p-8 text-center">
              <p className="text-sm text-mist-500">
                Converted output will appear here after you click Convert
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Convert button + error */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 w-full max-w-lg text-center" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleConvert}
          disabled={isConverting || !inputContent.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-mist-950 px-8 py-3 text-sm font-medium text-white hover:bg-mist-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConverting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
              </svg>
              Convert {formatPair.source.name} → {formatPair.target.name}
            </>
          )}
        </button>
      </div>

      {/* Format descriptions */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormatInfoCard
          label="Source format"
          name={formatPair.source.name}
          extension={formatPair.source.extension}
          description={formatPair.source.description}
        />
        <FormatInfoCard
          label="Target format"
          name={formatPair.target.name}
          extension={formatPair.target.extension}
          description={formatPair.target.description}
        />
      </div>
    </ToolLayout>
  );
}

interface FormatInfoCardProps {
  readonly label: string;
  readonly name: string;
  readonly extension: string;
  readonly description: string;
}

function FormatInfoCard({ label, name, extension, description }: FormatInfoCardProps) {
  return (
    <div className="rounded-xl border border-mist-200 bg-white p-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mist-500 mb-2">
        {label}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="rounded-md border border-mist-200 bg-mist-50 px-1.5 py-0.5 font-mono text-xs text-mist-700">
          {extension}
        </span>
        <span className="text-sm font-medium text-mist-950">{name}</span>
      </div>
      <p className="text-xs/5 text-mist-600">{description}</p>
    </div>
  );
}

function PairNotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-medium text-mist-950">
        Format pair not found
      </h1>
      <p className="mt-3 text-mist-600">
        This conversion pair doesn't exist or isn't supported yet.
      </p>
      <a
        href="../translation-file-converter"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
      >
        View all converters
      </a>
    </div>
  );
}
