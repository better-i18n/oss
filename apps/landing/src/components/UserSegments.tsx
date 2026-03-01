import { useT } from "@/lib/i18n";
import {
  IconGlobe,
  IconCode,
  IconGroup1,
  IconGithub,
  IconCheckmark1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

function TranslatorsCard() {
  const t = useT("segments.translators");

  return (
    <div
      id="for-translators"
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-sm scroll-mt-24"
    >
      {/* Visual Demo Area */}
      <div className="h-[280px] bg-gradient-to-br from-blue-50 to-mist-50 relative overflow-hidden p-6 flex flex-col items-center justify-center shrink-0">
        <div className="size-20 rounded-2xl bg-white border border-mist-200 shadow-lg flex items-center justify-center mb-4">
          <IconGlobe className="w-10 h-10 text-blue-600" />
        </div>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-mist-200 rounded-full shadow-sm">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-mist-700">
              {t("statusBadge", { defaultValue: "AI-Powered" })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-mist-950">
          {t("title", { defaultValue: "For Translators" })}
        </h3>
        <p className="mt-3 text-base text-mist-700 leading-relaxed">
          {t("description", {
            defaultValue:
              "Ship translations faster with AI-powered suggestions backed by your brand glossary. Review and approve in one place, then publish instantly to CDN or GitHub.",
          })}
        </p>

        {/* Key Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature1Title", { defaultValue: "Context-Aware AI" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature1Desc", {
                  defaultValue: "Translations that match your brand voice",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature2Title", {
                  defaultValue: "Human-in-the-Loop",
                })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature2Desc", {
                  defaultValue: "Review, edit, and approve before publishing",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature3Title", {
                  defaultValue: "Instant Publishing",
                })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature3Desc", {
                  defaultValue: "Push to CDN or GitHub with one click",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DevelopersCard() {
  const t = useT("segments.developers");

  return (
    <div
      id="for-developers"
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-sm scroll-mt-24"
    >
      {/* Visual Demo Area */}
      <div className="h-[280px] bg-gradient-to-br from-violet-50 to-mist-50 relative overflow-hidden p-6 flex flex-col items-center justify-center shrink-0">
        <div className="size-20 rounded-2xl bg-white border border-mist-200 shadow-lg flex items-center justify-center mb-4">
          <IconCode className="w-10 h-10 text-violet-600" />
        </div>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-mist-200 rounded-full shadow-sm">
            <IconGithub className="size-3 text-mist-900" />
            <span className="text-xs font-medium text-mist-700">
              {t("statusBadge", { defaultValue: "GitHub Integration" })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-mist-950">
          {t("title", { defaultValue: "For Developers" })}
        </h3>
        <p className="mt-3 text-base text-mist-700 leading-relaxed">
          {t("description", {
            defaultValue:
              "Build smarter with automatic key discovery from your codebase. Type-safe SDKs for React, Next.js, and more. Deploy instantly to global CDN with zero config.",
          })}
        </p>

        {/* Key Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature1Title", { defaultValue: "Auto Key Discovery" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature1Desc", {
                  defaultValue: "Scans your repo and finds all translation keys",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature2Title", { defaultValue: "Type-Safe SDKs" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature2Desc", {
                  defaultValue: "Full TypeScript support with autocomplete",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature3Title", { defaultValue: "Global CDN" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature3Desc", {
                  defaultValue: "Instant updates, cached at the edge worldwide",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTeamsCard() {
  const t = useT("segments.productTeams");

  return (
    <div
      id="for-product-teams"
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-sm scroll-mt-24"
    >
      {/* Visual Demo Area */}
      <div className="h-[280px] bg-gradient-to-br from-amber-50 to-mist-50 relative overflow-hidden p-6 flex flex-col items-center justify-center shrink-0">
        <div className="size-20 rounded-2xl bg-white border border-mist-200 shadow-lg flex items-center justify-center mb-4">
          <IconGroup1 className="w-10 h-10 text-amber-600" />
        </div>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-mist-200 rounded-full shadow-sm">
            <IconGroup1 className="size-3 text-amber-600" />
            <span className="text-xs font-medium text-mist-700">
              {t("statusBadge", { defaultValue: "Team Collaboration" })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-mist-950">
          {t("title", { defaultValue: "For Product Teams" })}
        </h3>
        <p className="mt-3 text-base text-mist-700 leading-relaxed">
          {t("description", {
            defaultValue:
              "Launch globally faster by managing all languages from one dashboard. Track progress in real-time, coordinate with translators and developers, and ship updates instantly.",
          })}
        </p>

        {/* Key Features */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature1Title", {
                  defaultValue: "Centralized Dashboard",
                })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature1Desc", {
                  defaultValue: "All languages, all projects, one place",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature2Title", { defaultValue: "Progress Tracking" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature2Desc", {
                  defaultValue:
                    "Real-time visibility into translation completion",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-5 rounded-full bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <IconCheckmark1 className="size-3 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-mist-950">
                {t("feature3Title", { defaultValue: "Instant Deployment" })}
              </p>
              <p className="text-xs text-mist-600 mt-0.5">
                {t("feature3Desc", {
                  defaultValue: "Ship approved translations to production immediately",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserSegments() {
  const t = useT("userSegments");

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("title", {
                defaultValue: "Built for Every Team",
              })}
            </h2>
            <p className="mt-4 text-lg/8 text-mist-700">
              {t("subtitle", {
                defaultValue:
                  "Whether you're translating, building, or managing - Better i18n adapts to your workflow.",
              })}
            </p>
          </div>

          {/* Segment Cards Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
            <TranslatorsCard />
            <DevelopersCard />
            <ProductTeamsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
