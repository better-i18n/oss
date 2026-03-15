import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileUploadZone } from "@/components/tools/FileUploadZone";
import { LocaleSelector } from "@/components/tools/LocaleSelector";
import {
  COST_TIERS,
  LANGUAGE_PRESETS,
  MONTHLY_CHANGE_RATE,
  calculateCosts,
  countWordsFromJson,
} from "@/lib/tools/cost-data";

export const Route = createFileRoute("/$locale/tools/cost-calculator")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "toolsCostCalculator",
      pathname: "/tools/cost-calculator",
      pageType: "tool",
      metaFallback: {
        title: "Localization Cost Calculator",
        description:
          "Estimate localization costs across human translation, AI+review, and Better i18n pricing.",
      },
    }),
  component: CostCalculatorPage,
});

const faqItems = [
  {
    question: "How are translation costs calculated?",
    answer:
      "Translation costs are typically calculated per source word. Rates vary by language pair, subject matter complexity, and translation method. Professional human translators usually charge $0.10–$0.25 per word, while AI-assisted workflows can reduce costs by 50–90%.",
  },
  {
    question: "What is the difference between human and AI translation?",
    answer:
      "Human translators provide nuanced, culturally-aware translation with domain expertise. AI translation is significantly faster and cheaper but may require human review for critical content. The 'Human + AI Review' tier combines machine translation speed with human quality checks.",
  },
  {
    question: "What does monthly maintenance cost include?",
    answer:
      "Monthly maintenance covers new content, updated strings, and iterative changes to your product. Typically 10–20% of your original content changes each month as features evolve. This estimate uses a 15% monthly change rate as a baseline.",
  },
  {
    question: "How many languages should I support?",
    answer:
      "The optimal number depends on your target markets. European markets often require 5–10 languages, while global products may need 20+. Each additional language multiplies costs linearly — but also multiplies potential revenue from new markets.",
  },
  {
    question: "How does Better i18n reduce localization costs?",
    answer:
      "Better i18n uses context-aware AI to generate high-quality translations, leverages translation memory to avoid re-translating existing strings, and provides a developer-first SDK that eliminates integration overhead. First 1,000 keys are free to get started.",
  },
];

type Step = 1 | 2 | 3;

interface WordCountState {
  readonly count: number;
  readonly detectedKeys: number;
  readonly source: "manual" | "file";
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
}

function StepIndicator({
  step,
  currentStep,
  label,
}: {
  readonly step: number;
  readonly currentStep: Step;
  readonly label: string;
}) {
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
          isCompleted
            ? "bg-mist-950 text-white"
            : isActive
              ? "border-2 border-mist-950 bg-white text-mist-950"
              : "border-2 border-mist-200 bg-white text-mist-400",
        ].join(" ")}
      >
        {isCompleted ? (
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          step
        )}
      </div>
      <span
        className={[
          "text-sm font-medium",
          isActive ? "text-mist-950" : isCompleted ? "text-mist-700" : "text-mist-400",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

function CostCard({
  tierIndex,
  tierName,
  description,
  min,
  max,
  monthlyMin,
  monthlyMax,
  isHighlighted,
  savingsPercent,
}: {
  readonly tierIndex: number;
  readonly tierName: string;
  readonly description: string;
  readonly min: number;
  readonly max: number;
  readonly monthlyMin: number;
  readonly monthlyMax: number;
  readonly isHighlighted: boolean;
  readonly savingsPercent?: number;
}) {
  return (
    <div
      className={[
        "relative flex flex-col gap-4 rounded-xl p-6",
        isHighlighted
          ? "border-2 border-mist-950 bg-mist-50"
          : "border border-mist-200 bg-white",
      ].join(" ")}
    >
      {savingsPercent !== undefined && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-semibold">
          Save up to {savingsPercent}% vs human
        </span>
      )}

      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-mist-950">{tierName}</h3>
          {tierIndex === 2 && (
            <span className="rounded-full bg-mist-950 px-2.5 py-0.5 text-xs font-medium text-white">
              Recommended
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-mist-600">{description}</p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-mist-500">
          One-time (initial)
        </p>
        <p className="mt-1 text-2xl font-bold text-mist-950">
          {formatCurrency(min)}
          <span className="text-base font-normal text-mist-500">
            {" "}– {formatCurrency(max)}
          </span>
        </p>
      </div>

      <div className="border-t border-mist-200 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-mist-500">
          Monthly maintenance
        </p>
        <p className="mt-1 text-lg font-semibold text-mist-700">
          {formatCurrency(monthlyMin)}
          <span className="text-sm font-normal text-mist-500">
            {" "}– {formatCurrency(monthlyMax)}
          </span>
          <span className="text-xs text-mist-400">/mo</span>
        </p>
      </div>
    </div>
  );
}

function CostCalculatorPage() {
  const { locale } = Route.useParams();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [wordCountState, setWordCountState] = useState<WordCountState>({
    count: 5000,
    detectedKeys: 0,
    source: "manual",
  });
  const [manualWordCount, setManualWordCount] = useState("5000");
  const [selectedLanguages, setSelectedLanguages] = useState<readonly string[]>(
    [],
  );

  const handleFileContent = (content: string) => {
    const { words, keys } = countWordsFromJson(content);
    if (words > 0) {
      setWordCountState({ count: words, detectedKeys: keys, source: "file" });
      setManualWordCount(String(words));
    }
  };

  const handleManualWordCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = e.target.value;
    setManualWordCount(raw);
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setWordCountState({ count: parsed, detectedKeys: 0, source: "manual" });
    }
  };

  const handlePreset = (presetKey: keyof typeof LANGUAGE_PRESETS) => {
    const codes = LANGUAGE_PRESETS[presetKey];
    setSelectedLanguages(codes);
  };

  const costs = useMemo(
    () => calculateCosts(wordCountState.count, Math.max(selectedLanguages.length, 1)),
    [wordCountState.count, selectedLanguages.length],
  );

  const humanCost = costs[0];
  const betterI18nCost = costs[2];

  const savingsPercent =
    humanCost && betterI18nCost
      ? Math.round(((humanCost.avg - betterI18nCost.avg) / humanCost.avg) * 100)
      : 0;

  const breadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Free Tools", href: `/${locale}/tools` },
    { label: "Cost Calculator" },
  ];

  return (
    <ToolLayout
      title="Localization Cost Calculator"
      description="Estimate your translation costs with a side-by-side comparison of professional human, AI-assisted, and Better i18n pricing."
      subtitle="Free Tool"
      currentSlug="cost-calculator"
      locale={locale}
      faqItems={faqItems}
      breadcrumbs={breadcrumbs}
      ctaText="Start translating now — first 1,000 keys free"
    >
      {/* Step indicator */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <StepIndicator step={1} currentStep={currentStep} label="Project Info" />
        <div className="hidden h-px flex-1 bg-mist-200 sm:block" aria-hidden="true" />
        <StepIndicator step={2} currentStep={currentStep} label="Target Languages" />
        <div className="hidden h-px flex-1 bg-mist-200 sm:block" aria-hidden="true" />
        <StepIndicator step={3} currentStep={currentStep} label="Cost Breakdown" />
      </div>

      {/* Step 1: Project Info */}
      {currentStep === 1 && (
        <div className="rounded-xl border border-mist-200 bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-mist-950">
            Step 1: Project Info
          </h2>
          <p className="mb-6 text-sm text-mist-600">
            Enter your word count manually or upload a JSON translation file to auto-detect it.
          </p>

          <div className="mb-6">
            <label
              htmlFor="wordCount"
              className="mb-1.5 block text-sm font-medium text-mist-700"
            >
              Word count (source language)
            </label>
            <input
              id="wordCount"
              type="number"
              min="1"
              value={manualWordCount}
              onChange={handleManualWordCountChange}
              className="w-full max-w-xs rounded-xl border border-mist-200 bg-white px-4 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-400 focus:outline-none focus:ring-2 focus:ring-mist-200"
              placeholder="e.g. 5000"
            />
            {wordCountState.source === "file" && wordCountState.detectedKeys > 0 && (
              <p className="mt-2 text-xs text-mist-500">
                Auto-detected:{" "}
                <span className="font-medium text-mist-700">
                  {wordCountState.count.toLocaleString()} words
                </span>{" "}
                across{" "}
                <span className="font-medium text-mist-700">
                  {wordCountState.detectedKeys} keys
                </span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-medium text-mist-700">
              Or upload your translation file (JSON)
            </p>
            <FileUploadZone
              onFileContent={handleFileContent}
              accept=".json,application/json"
              label="Upload JSON translation file"
              hint="Drag and drop a .json file here to auto-count words"
              placeholder='{"key": "Hello world", "greeting": "Welcome!"}'
            />
          </div>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={wordCountState.count <= 0}
            className="inline-flex items-center justify-center rounded-xl bg-mist-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mist-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Languages
          </button>
        </div>
      )}

      {/* Step 2: Target Languages */}
      {currentStep === 2 && (
        <div className="rounded-xl border border-mist-200 bg-white p-6">
          <h2 className="mb-1 text-lg font-semibold text-mist-950">
            Step 2: Target Languages
          </h2>
          <p className="mb-4 text-sm text-mist-600">
            Select which languages you want to translate into.{" "}
            <span className="font-medium text-mist-950">
              {selectedLanguages.length} selected
            </span>
          </p>

          {/* Quick preset buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePreset("european")}
              className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1.5 text-xs font-medium text-mist-700 transition-colors hover:border-mist-400 hover:bg-mist-50"
            >
              European (10)
            </button>
            <button
              type="button"
              onClick={() => handlePreset("apac")}
              className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1.5 text-xs font-medium text-mist-700 transition-colors hover:border-mist-400 hover:bg-mist-50"
            >
              APAC (8)
            </button>
            <button
              type="button"
              onClick={() => handlePreset("global20")}
              className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1.5 text-xs font-medium text-mist-700 transition-colors hover:border-mist-400 hover:bg-mist-50"
            >
              Global Top 20
            </button>
          </div>

          <div className="mb-6">
            <LocaleSelector
              selected={selectedLanguages}
              onChange={setSelectedLanguages}
              label="Select target languages"
              placeholder="Search languages..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center justify-center rounded-xl border border-mist-200 bg-white px-5 py-2.5 text-sm font-medium text-mist-700 transition-colors hover:bg-mist-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={selectedLanguages.length === 0}
              className="inline-flex items-center justify-center rounded-xl bg-mist-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mist-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Calculate Costs
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results Dashboard */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-8">
          {/* Summary bar */}
          <div className="rounded-xl border border-mist-200 bg-white px-6 py-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-mist-700">
              <span>
                <span className="font-semibold text-mist-950">
                  {wordCountState.count.toLocaleString()}
                </span>{" "}
                words
              </span>
              <span>
                <span className="font-semibold text-mist-950">
                  {selectedLanguages.length}
                </span>{" "}
                languages
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="ml-auto text-xs text-mist-500 underline hover:text-mist-950"
              >
                Edit
              </button>
            </div>
          </div>

          {/* Cost cards */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-mist-950">
              Cost Comparison
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {costs.map((item, index) => {
                const monthlyMin =
                  item.min * MONTHLY_CHANGE_RATE;
                const monthlyMax =
                  item.max * MONTHLY_CHANGE_RATE;
                const isHighlighted = index === 2;

                return (
                  <CostCard
                    key={item.tier.name}
                    tierIndex={index}
                    tierName={item.tier.name}
                    description={item.tier.description}
                    min={item.min}
                    max={item.max}
                    monthlyMin={monthlyMin}
                    monthlyMax={monthlyMax}
                    isHighlighted={isHighlighted}
                    savingsPercent={isHighlighted ? savingsPercent : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* Savings highlight */}
          <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-600"
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
            <div>
              <p className="text-sm font-semibold text-green-900">
                Save up to {savingsPercent}% with Better i18n
              </p>
              <p className="text-xs text-green-700">
                Compared to professional human translation at the same quality level.
              </p>
            </div>
          </div>

          {/* Per-language breakdown table */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-mist-950">
              Per-Language Cost Breakdown
            </h2>
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mist-200 bg-mist-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-mist-500">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Per language (min)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Per language (max)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Total ({selectedLanguages.length} lang)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {COST_TIERS.map((tier) => {
                    const perLangMin = wordCountState.count * tier.minPerWord;
                    const perLangMax = wordCountState.count * tier.maxPerWord;
                    const totalMin = perLangMin * selectedLanguages.length;
                    const totalMax = perLangMax * selectedLanguages.length;
                    const isBetterI18n = tier.name === "Better i18n AI";

                    return (
                      <tr
                        key={tier.name}
                        className={isBetterI18n ? "bg-mist-50 font-medium" : ""}
                      >
                        <td className="px-4 py-3 text-mist-950">
                          {tier.name}
                          {isBetterI18n && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-mist-950 px-2 py-0.5 text-[10px] font-medium text-white">
                              Best value
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-mist-700">
                          {formatCurrency(perLangMin)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-mist-700">
                          {formatCurrency(perLangMax)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-mist-950">
                          {formatCurrency(totalMin)} – {formatCurrency(totalMax)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly maintenance estimate */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-mist-950">
              Monthly Maintenance Estimate
            </h2>
            <p className="mb-4 text-sm text-mist-600">
              Based on a {Math.round(MONTHLY_CHANGE_RATE * 100)}% monthly content change rate across{" "}
              {selectedLanguages.length} languages.
            </p>
            <div className="overflow-hidden rounded-xl border border-mist-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mist-200 bg-mist-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-mist-500">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Monthly (min)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Monthly (max)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-mist-500">
                      Annual estimate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {COST_TIERS.map((tier) => {
                    const monthlyMin =
                      wordCountState.count *
                      MONTHLY_CHANGE_RATE *
                      selectedLanguages.length *
                      tier.minPerWord;
                    const monthlyMax =
                      wordCountState.count *
                      MONTHLY_CHANGE_RATE *
                      selectedLanguages.length *
                      tier.maxPerWord;
                    const isBetterI18n = tier.name === "Better i18n AI";

                    return (
                      <tr
                        key={tier.name}
                        className={isBetterI18n ? "bg-mist-50 font-medium" : ""}
                      >
                        <td className="px-4 py-3 text-mist-950">{tier.name}</td>
                        <td className="px-4 py-3 text-right font-mono text-mist-700">
                          {formatCurrency(monthlyMin)}/mo
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-mist-700">
                          {formatCurrency(monthlyMax)}/mo
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-mist-950">
                          {formatCurrency(monthlyMin * 12)} –{" "}
                          {formatCurrency(monthlyMax * 12)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA banner */}
          <div className="rounded-xl border border-mist-200 bg-mist-950 px-6 py-8 text-center">
            <p className="font-display text-xl font-medium text-white">
              Start translating now — first 1,000 keys free
            </p>
            <p className="mt-2 text-sm text-mist-400">
              No credit card required. Get AI-powered translations with context-aware quality.
            </p>
            <a
              href="https://dash.better-i18n.com"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-mist-950 transition-colors hover:bg-mist-100"
            >
              Get started free
            </a>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
