import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { createPageLoader, getPageHead, getBreadcrumbItems } from "@/lib/page-seo";
import {
  parseICUMessage,
  formatICUMessage,
  getICUExamples,
} from "@/lib/tools/icu-parser";
import type { ICUVariable, ICUExample } from "@/lib/tools/icu-parser";

export const Route = createFileRoute("/$locale/tools/icu-playground")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "toolsIcuPlayground",
      pathname: "/tools/icu-playground",
      pageType: "tool",
      metaFallback: {
        title: "ICU Message Format Playground & Validator",
        description:
          "Test ICU message syntax with live preview, multi-locale output, and error explanations.",
      },
    });
  },
  component: ICUPlaygroundPage,
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PREVIEW_LOCALES = ["en", "de", "ja", "ar"] as const;
type PreviewLocale = (typeof PREVIEW_LOCALES)[number];

const LOCALE_LABELS: Record<PreviewLocale, string> = {
  en: "English",
  de: "German",
  ja: "Japanese",
  ar: "Arabic",
};

const CODE_TABS = ["react-intl", "next-intl", "i18next"] as const;
type CodeTab = (typeof CODE_TABS)[number];

const FAQ_ITEMS = [
  {
    question: "What is ICU Message Format?",
    answer:
      "ICU (International Components for Unicode) Message Format is a standard for defining localizable messages that include variables, plural rules, and gender/select logic. It is used by libraries like react-intl, next-intl, and Format.js.",
  },
  {
    question: "How do plural rules work in ICU?",
    answer:
      "Plural rules in ICU use CLDR categories: zero, one, two, few, many, and other. The correct category is selected based on the locale's rules. For example, English only uses 'one' and 'other', while Arabic uses all six categories.",
  },
  {
    question: "What is the difference between select and plural?",
    answer:
      "Plural selects a branch based on a number and the locale's plural rules (e.g., 1 → 'one', 5 → 'other'). Select matches a string value exactly to a branch key (e.g., 'male' → 'He'), making it ideal for gender or category selection.",
  },
  {
    question: "Can I use ICU messages with i18next?",
    answer:
      "Yes — install the i18next-icu plugin and pass it to i18next.init(). Once enabled, you can use full ICU syntax in your translation files alongside i18next's own interpolation.",
  },
  {
    question: "Why does the output differ between locales?",
    answer:
      "Different locales have different plural rules and number formatting conventions. For example, German uses a comma as the decimal separator, and Arabic has six grammatical plural categories instead of English's two.",
  },
] as const;

// ---------------------------------------------------------------------------
// Code snippet generators
// ---------------------------------------------------------------------------

function buildReactIntlSnippet(message: string, variables: Record<string, string | number>): string {
  const varEntries = Object.entries(variables)
    .map(([k, v]) => `    ${k}: ${typeof v === "number" ? v : `"${v}"`}`)
    .join(",\n");
  const varBlock = varEntries ? `\n${varEntries}\n  ` : "";
  return `import { useIntl } from "react-intl";

// In your messages file:
// { "myKey": "${message.replace(/"/g, '\\"')}" }

function MyComponent() {
  const intl = useIntl();
  return (
    <span>
      {intl.formatMessage(
        { id: "myKey" },
        {${varBlock}}
      )}
    </span>
  );
}`;
}

function buildNextIntlSnippet(message: string, variables: Record<string, string | number>): string {
  const varEntries = Object.entries(variables)
    .map(([k, v]) => `    ${k}: ${typeof v === "number" ? v : `"${v}"`}`)
    .join(",\n");
  const varBlock = varEntries ? `\n${varEntries}\n  ` : "";
  return `import { useTranslations } from "next-intl";

// In your en.json:
// { "myKey": "${message.replace(/"/g, '\\"')}" }

function MyComponent() {
  const t = useTranslations();
  return <span>{t("myKey", {${varBlock}})}</span>;
}`;
}

function buildI18nextSnippet(message: string, variables: Record<string, string | number>): string {
  const varEntries = Object.entries(variables)
    .map(([k, v]) => `    ${k}: ${typeof v === "number" ? v : `"${v}"`}`)
    .join(",\n");
  const varBlock = varEntries ? `\n${varEntries}\n  ` : "";
  return `import i18next from "i18next";
import ICU from "i18next-icu";

i18next.use(ICU).init({ /* … */ });

// In your en.json:
// { "myKey": "${message.replace(/"/g, '\\"')}" }

// Usage:
i18next.t("myKey", {${varBlock}});`;
}

function getCodeSnippet(
  tab: CodeTab,
  message: string,
  variables: Record<string, string | number>,
): string {
  switch (tab) {
    case "react-intl":
      return buildReactIntlSnippet(message, variables);
    case "next-intl":
      return buildNextIntlSnippet(message, variables);
    case "i18next":
      return buildI18nextSnippet(message, variables);
  }
}

// ---------------------------------------------------------------------------
// URL hash encoding/decoding
// ---------------------------------------------------------------------------

interface HashState {
  readonly message: string;
  readonly values: Record<string, string | number>;
}

function encodeHash(state: HashState): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  } catch {
    return "";
  }
}

function decodeHash(hash: string): HashState | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const decoded = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (typeof decoded.message !== "string") return null;
    return decoded as HashState;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VariableControl({
  variable,
  value,
  onChange,
}: {
  readonly variable: ICUVariable;
  readonly value: string | number;
  readonly onChange: (name: string, value: string | number) => void;
}) {
  const handleChange = useCallback(
    (newValue: string | number) => onChange(variable.name, newValue),
    [onChange, variable.name],
  );

  if (variable.type === "select" && variable.options && variable.options.length > 0) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mist-600">
          <code className="rounded bg-mist-100 px-1 py-0.5 text-xs text-mist-800">
            {variable.name}
          </code>{" "}
          <span className="text-mist-400">(select)</span>
        </label>
        <select
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-mist-900 focus:border-mist-400 focus:outline-none"
        >
          {variable.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value="other">other</option>
        </select>
      </div>
    );
  }

  if (variable.type === "number" || variable.type === "plural") {
    const numVal = typeof value === "number" ? value : Number(value);
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center justify-between text-xs font-medium text-mist-600">
          <span>
            <code className="rounded bg-mist-100 px-1 py-0.5 text-xs text-mist-800">
              {variable.name}
            </code>{" "}
            <span className="text-mist-400">({variable.type})</span>
          </span>
          <span className="font-mono text-mist-800">{numVal}</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={numVal}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full accent-mist-950"
        />
      </div>
    );
  }

  // date type — just show a text input for a date string
  if (variable.type === "date") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-mist-600">
          <code className="rounded bg-mist-100 px-1 py-0.5 text-xs text-mist-800">
            {variable.name}
          </code>{" "}
          <span className="text-mist-400">(date)</span>
        </label>
        <input
          type="date"
          value={String(value)}
          onChange={(e) => handleChange(e.target.value)}
          className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-mist-900 focus:border-mist-400 focus:outline-none"
        />
      </div>
    );
  }

  // string
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-mist-600">
        <code className="rounded bg-mist-100 px-1 py-0.5 text-xs text-mist-800">
          {variable.name}
        </code>{" "}
        <span className="text-mist-400">(string)</span>
      </label>
      <input
        type="text"
        value={String(value)}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-mist-900 focus:border-mist-400 focus:outline-none"
        placeholder={variable.name}
      />
    </div>
  );
}

function LocalePreviewRow({
  locale,
  label,
  message,
  values,
}: {
  readonly locale: string;
  readonly label: string;
  readonly message: string;
  readonly values: Record<string, string | number>;
}) {
  const output = useMemo(() => {
    try {
      return formatICUMessage(message, values, locale);
    } catch (err) {
      return `[Error: ${err instanceof Error ? err.message : String(err)}]`;
    }
  }, [message, values, locale]);

  const isRtl = locale === "ar";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-mist-100 bg-mist-50 px-4 py-3">
      <span className="mt-0.5 min-w-[3.5rem] text-xs font-medium text-mist-500">{label}</span>
      <span
        className="flex-1 text-sm text-mist-900"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {output}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

function ICUPlaygroundPage() {
  const { locale } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const messages = loaderData?.messages || {};

  const EXAMPLES = useMemo(() => getICUExamples(), []);

  const [message, setMessage] = useState<string>(EXAMPLES[0].message);
  const [values, setValues] = useState<Record<string, string | number>>(EXAMPLES[0].variables);
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("react-intl");
  const [copied, setCopied] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");

  // Parse result
  const parseResult = useMemo(() => parseICUMessage(message), [message]);

  // Sync values when variables change (add missing keys, keep existing)
  const syncedValues = useMemo<Record<string, string | number>>(() => {
    const next: Record<string, string | number> = {};
    for (const variable of parseResult.variables) {
      if (values[variable.name] !== undefined) {
        next[variable.name] = values[variable.name];
      } else {
        // sensible defaults
        if (variable.type === "plural" || variable.type === "number") {
          next[variable.name] = 1;
        } else if (variable.type === "date") {
          next[variable.name] = new Date().toISOString().slice(0, 10);
        } else if (variable.type === "select" && variable.options?.[0]) {
          next[variable.name] = variable.options[0];
        } else {
          next[variable.name] = variable.name;
        }
      }
    }
    return next;
  }, [parseResult.variables, values]);

  // Load state from URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash === "#") return;
    const state = decodeHash(hash);
    if (state) {
      setMessage(state.message);
      setValues(state.values);
    }
  }, []);

  // Update URL hash whenever message or values change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = encodeHash({ message, values: syncedValues });
    if (hash) {
      window.history.replaceState(null, "", `#${hash}`);
    }
  }, [message, syncedValues]);

  const handleValueChange = useCallback((name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleExampleSelect = useCallback(
    (example: ICUExample) => {
      setMessage(example.message);
      setValues(example.variables);
    },
    [],
  );

  const handleCopySnippet = useCallback(() => {
    const snippet = getCodeSnippet(activeCodeTab, message, syncedValues);
    navigator.clipboard.writeText(snippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeCodeTab, message, syncedValues]);

  const handleShare = useCallback(() => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setShareLabel("Copied!");
    setTimeout(() => setShareLabel("Share"), 2000);
  }, []);

  const codeSnippet = useMemo(
    () => getCodeSnippet(activeCodeTab, message, syncedValues),
    [activeCodeTab, message, syncedValues],
  );

  const breadcrumbs = getBreadcrumbItems("/tools/icu-playground", messages as unknown as Record<string, string>);

  return (
    <ToolLayout
      title="ICU Message Format Playground"
      description="Test ICU message syntax with live preview, multi-locale output, and instant error explanations."
      subtitle="Free i18n Tool"
      currentSlug="icu-playground"
      locale={locale}
      faqItems={FAQ_ITEMS}
      breadcrumbs={breadcrumbs}
      ctaText="Manage all your ICU messages in Better i18n"
      ctaHref="https://dash.better-i18n.com"
    >
      {/* Top toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="example-select" className="text-sm font-medium text-mist-700">
            Load example:
          </label>
          <select
            id="example-select"
            className="rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm text-mist-900 focus:border-mist-400 focus:outline-none"
            defaultValue=""
            onChange={(e) => {
              const example = EXAMPLES.find((ex) => ex.name === e.target.value);
              if (example) handleExampleSelect(example);
            }}
          >
            <option value="" disabled>
              Choose an example…
            </option>
            {EXAMPLES.map((ex) => (
              <option key={ex.name} value={ex.name}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-sm font-medium text-mist-700 hover:bg-mist-50"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          {shareLabel}
        </button>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left panel — input */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm">
            <div className="border-b border-mist-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-mist-900">ICU Message</h2>
              <p className="mt-0.5 text-xs text-mist-500">
                Edit your message using ICU syntax below
              </p>
            </div>
            <div className="p-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full resize-none rounded-xl border border-mist-200 bg-mist-50 px-4 py-3 font-mono text-sm text-mist-900 placeholder-mist-400 focus:border-mist-400 focus:outline-none"
                placeholder="Enter ICU message, e.g. Hello, {name}!"
                aria-label="ICU message input"
              />
            </div>

            {/* Error panel */}
            {!parseResult.valid && parseResult.error && (
              <div className="mx-4 mb-4 rounded-xl border border-red-100 bg-red-50 p-3">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 size-4 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-red-700">Parse error</p>
                    <p className="mt-0.5 text-xs text-red-600">{parseResult.error}</p>
                  </div>
                </div>
              </div>
            )}

            {parseResult.valid && (
              <div className="mx-4 mb-4 rounded-xl border border-green-100 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                  <svg className="size-4 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-medium text-green-700">Valid ICU message</p>
                </div>
              </div>
            )}
          </div>

          {/* Variable controls */}
          {parseResult.variables.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm">
              <div className="border-b border-mist-100 px-5 py-3">
                <h2 className="text-sm font-semibold text-mist-900">Variables</h2>
                <p className="mt-0.5 text-xs text-mist-500">
                  Adjust values to see live output changes
                </p>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {parseResult.variables.map((variable) => (
                  <VariableControl
                    key={variable.name}
                    variable={variable}
                    value={syncedValues[variable.name] ?? ""}
                    onChange={handleValueChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — preview */}
        <div className="flex flex-col gap-4">
          {/* Multi-locale preview */}
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm">
            <div className="border-b border-mist-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-mist-900">Multi-locale Preview</h2>
              <p className="mt-0.5 text-xs text-mist-500">
                Live output across 4 locales using Intl.PluralRules
              </p>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {PREVIEW_LOCALES.map((loc) => (
                <LocalePreviewRow
                  key={loc}
                  locale={loc}
                  label={LOCALE_LABELS[loc]}
                  message={message}
                  values={syncedValues}
                />
              ))}
            </div>
          </div>

          {/* Code snippet */}
          <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-mist-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-mist-900">Code Snippet</h2>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="text-xs font-medium text-mist-600 hover:text-mist-900"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-mist-100">
              {CODE_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    activeCodeTab === tab
                      ? "border-b-2 border-mist-900 text-mist-900"
                      : "text-mist-500 hover:text-mist-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <pre className="overflow-x-auto bg-mist-950 p-4 text-xs leading-5 text-mist-100">
              <code>{codeSnippet}</code>
            </pre>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-mist-200 bg-gradient-to-br from-mist-50 to-white p-5">
            <p className="text-sm font-semibold text-mist-900">
              Managing hundreds of ICU messages?
            </p>
            <p className="mt-1 text-sm text-mist-600">
              Better i18n handles validation, delivery, and AI-powered translations — so your team ships faster.
            </p>
            <a
              href="https://dash.better-i18n.com"
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-mist-950 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800"
            >
              Try Better i18n free
            </a>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
