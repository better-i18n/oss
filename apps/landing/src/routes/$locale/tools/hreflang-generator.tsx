import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LocaleSelector } from "@/components/tools/LocaleSelector";
import { CodeOutput } from "@/components/tools/CodeOutput";
import {
  generateHreflangHtml,
  generateHreflangSitemap,
  generateHreflangHeaders,
  validateHreflang,
} from "@/lib/tools/hreflang";
import type { HreflangValidationWarning } from "@/lib/tools/hreflang";

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/$locale/tools/hreflang-generator")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "toolsHreflangGenerator",
      pathname: "/tools/hreflang-generator",
      pageType: "tool",
      metaFallback: {
        title: "Hreflang Tag Generator & Validator",
        description:
          "Generate and validate hreflang tags for multilingual SEO — HTML, XML sitemap, and HTTP headers.",
      },
    }),
  component: HreflangGeneratorPage,
});

// ─── Constants ───────────────────────────────────────────────────────────────

type OutputFormat = "html" | "xml" | "headers";

const OUTPUT_TABS: readonly { readonly id: OutputFormat; readonly label: string }[] =
  [
    { id: "html", label: "HTML" },
    { id: "xml", label: "XML Sitemap" },
    { id: "headers", label: "HTTP Headers" },
  ] as const;

const FAQ_ITEMS = [
  {
    question: "What is the hreflang attribute?",
    answer:
      "Hreflang is an HTML attribute (and HTTP header / sitemap annotation) that tells search engines which language and region a page is intended for. It helps Google serve the correct language version to users in different regions, preventing duplicate content issues across localised pages.",
  },
  {
    question: "What does x-default mean?",
    answer:
      "The x-default hreflang value designates the fallback URL for users whose browser language does not match any of the specific locale tags. Google recommends pointing it to a language-selection page or to your most widely used locale (typically English).",
  },
  {
    question: "Which implementation method should I use: HTML, XML, or HTTP headers?",
    answer:
      "All three methods are equivalent in Google's eyes. HTML <link> tags work for most sites and are the easiest to implement. XML sitemap entries are useful when you cannot modify page HTML (e.g. PDFs). HTTP headers are the only option for non-HTML resources and work well on server-rendered sites with full header control.",
  },
  {
    question: "Do hreflang tags need to be reciprocal?",
    answer:
      "Yes — every page in a hreflang group must link back to all the others, including itself. If page A references page B with hreflang, page B must also reference page A. Missing reciprocal tags cause Google to ignore the entire set.",
  },
  {
    question: "What are common hreflang mistakes?",
    answer:
      "The most frequent errors are: missing the x-default tag, non-reciprocal annotations, using wrong locale codes (e.g. 'en_US' instead of 'en-US'), duplicate locale codes in the same page, and pointing hreflang URLs to redirecting or non-canonical pages. Use this tool's validation panel to catch these before deployment.",
  },
  {
    question: "Does Better i18n handle hreflang automatically?",
    answer:
      "Yes — Better i18n auto-generates hreflang tags for every locale your app supports, using the canonical URLs from your routing configuration. No manual tag management needed as you add or remove languages.",
  },
] as const;

// ─── Component ───────────────────────────────────────────────────────────────

function HreflangGeneratorPage() {
  const { locale } = Route.useParams();

  const [baseUrl, setBaseUrl] = useState("https://example.com");
  const [selectedLocales, setSelectedLocales] = useState<readonly string[]>([
    "en",
    "fr",
    "de",
  ]);
  const [xDefault, setXDefault] = useState<string>("en");
  const [activeTab, setActiveTab] = useState<OutputFormat>("html");

  // Derive output from current state
  const output = useMemo<string>(() => {
    if (selectedLocales.length === 0) return "";
    const resolvedXDefault =
      xDefault && selectedLocales.includes(xDefault) ? xDefault : undefined;

    switch (activeTab) {
      case "html":
        return generateHreflangHtml(baseUrl, selectedLocales, resolvedXDefault);
      case "xml":
        return generateHreflangSitemap(
          baseUrl,
          selectedLocales,
          resolvedXDefault,
        );
      case "headers":
        return generateHreflangHeaders(
          baseUrl,
          selectedLocales,
          resolvedXDefault,
        );
    }
  }, [baseUrl, selectedLocales, xDefault, activeTab]);

  const warnings = useMemo<readonly HreflangValidationWarning[]>(() => {
    const resolvedXDefault =
      xDefault && selectedLocales.includes(xDefault) ? xDefault : undefined;
    return validateHreflang(selectedLocales, resolvedXDefault);
  }, [selectedLocales, xDefault]);

  const handleLocalesChange = (next: readonly string[]) => {
    setSelectedLocales(next);
    // Keep xDefault valid — reset if the chosen locale was removed
    if (xDefault && !next.includes(xDefault)) {
      setXDefault(next[0] ?? "");
    }
  };

  const handleDownload = () => {
    const extensions: Record<OutputFormat, string> = {
      html: "html",
      xml: "xml",
      headers: "txt",
    };
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hreflang.${extensions[activeTab]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Hreflang Tag Generator & Validator"
      description="Generate and validate hreflang tags for multilingual SEO in HTML, XML sitemap, and HTTP header formats."
      subtitle="Free browser-based tool — no sign-up required"
      currentSlug="hreflang-generator"
      locale={locale}
      faqItems={FAQ_ITEMS}
      breadcrumbs={[
        { label: "Free Tools", href: "/tools" },
        { label: "Hreflang Generator" },
      ]}
      ctaText="Auto-generate hreflang with Better i18n"
      ctaHref="https://dash.better-i18n.com"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ── Left column: inputs ── */}
        <div className="flex flex-col gap-6">
          {/* Base URL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="base-url"
              className="text-sm font-medium text-mist-700"
            >
              Base URL
            </label>
            <input
              id="base-url"
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-mist-200 bg-white px-4 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
            />
            <p className="text-xs text-mist-500">
              The root URL of your site. Locale codes will be appended as path
              segments (e.g.{" "}
              <code className="rounded bg-mist-100 px-1 py-0.5 font-mono text-[11px]">
                /en/
              </code>
              ).
            </p>
          </div>

          {/* Locale selector */}
          <LocaleSelector
            selected={selectedLocales}
            onChange={handleLocalesChange}
            label="Languages / Locales"
            placeholder="Search locales…"
          />

          {/* x-default */}
          {selectedLocales.length > 0 && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="x-default"
                className="text-sm font-medium text-mist-700"
              >
                x-default locale
              </label>
              <select
                id="x-default"
                value={xDefault}
                onChange={(e) => setXDefault(e.target.value)}
                className="w-full rounded-lg border border-mist-200 bg-white px-4 py-2.5 text-sm text-mist-950 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
              >
                {selectedLocales.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <p className="text-xs text-mist-500">
                Shown to users whose language does not match any locale tag.
                Usually your default or English locale.
              </p>
            </div>
          )}

          {/* Validation warnings */}
          {warnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-amber-800">
                Validation Warnings
              </h3>
              <ul className="flex flex-col gap-1.5">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-amber-800"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{w.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length === 0 && selectedLocales.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <svg
                  className="h-4 w-4 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Configuration looks good — no issues detected.
              </p>
            </div>
          )}
        </div>

        {/* ── Right column: output ── */}
        <div className="flex flex-col gap-4">
          {/* Format tabs */}
          <div
            className="inline-flex rounded-lg border border-mist-200 bg-mist-100 p-1"
            role="tablist"
            aria-label="Output format"
          >
            {OUTPUT_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-mist-950 text-white shadow-sm"
                    : "text-mist-700 hover:text-mist-950",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code output */}
          {selectedLocales.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-mist-300 bg-mist-50 p-8 text-center">
              <p className="text-sm text-mist-500">
                Select at least one locale to generate hreflang tags.
              </p>
            </div>
          ) : (
            <>
              <CodeOutput
                code={output}
                language={
                  activeTab === "html"
                    ? "html"
                    : activeTab === "xml"
                      ? "xml"
                      : "text"
                }
                label={
                  activeTab === "html"
                    ? "HTML <head> snippet"
                    : activeTab === "xml"
                      ? "XML sitemap entry"
                      : "HTTP Link header"
                }
                maxHeight="420px"
              />

              {/* Download button */}
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-mist-200 bg-white px-4 py-2 text-sm font-medium text-mist-700 transition-colors hover:bg-mist-50 hover:text-mist-950"
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
                Download
              </button>
            </>
          )}

          {/* How-to tip */}
          {activeTab === "html" && selectedLocales.length > 0 && (
            <div className="rounded-xl border border-mist-200 bg-mist-50 p-4 text-sm text-mist-700">
              <strong className="text-mist-950">How to use:</strong> Paste these
              tags inside the{" "}
              <code className="rounded bg-mist-200 px-1 font-mono text-[11px]">
                &lt;head&gt;
              </code>{" "}
              element of <em>every</em> localised page — each page must
              self-reference its own locale and include all siblings.
            </div>
          )}
          {activeTab === "xml" && selectedLocales.length > 0 && (
            <div className="rounded-xl border border-mist-200 bg-mist-50 p-4 text-sm text-mist-700">
              <strong className="text-mist-950">How to use:</strong> Add the{" "}
              <code className="rounded bg-mist-200 px-1 font-mono text-[11px]">
                xmlns:xhtml
              </code>{" "}
              namespace to your{" "}
              <code className="rounded bg-mist-200 px-1 font-mono text-[11px]">
                &lt;urlset&gt;
              </code>{" "}
              element and include a{" "}
              <code className="rounded bg-mist-200 px-1 font-mono text-[11px]">
                &lt;url&gt;
              </code>{" "}
              block like this for each page in your sitemap.
            </div>
          )}
          {activeTab === "headers" && selectedLocales.length > 0 && (
            <div className="rounded-xl border border-mist-200 bg-mist-50 p-4 text-sm text-mist-700">
              <strong className="text-mist-950">How to use:</strong> Set this
              value as the{" "}
              <code className="rounded bg-mist-200 px-1 font-mono text-[11px]">
                Link
              </code>{" "}
              HTTP response header on your server. Useful when you cannot modify
              the HTML source (e.g. PDFs, server-rendered APIs).
            </div>
          )}
        </div>
      </div>

      {/* CTA note */}
      <p className="mt-10 text-center text-sm text-mist-600">
        Better i18n auto-generates hreflang for your localized app — no manual
        tag management required.{" "}
        <a
          href="https://dash.better-i18n.com"
          className="font-medium text-mist-950 underline underline-offset-2 hover:text-mist-700"
        >
          Get started for free
        </a>
        .
      </p>
    </ToolLayout>
  );
}
