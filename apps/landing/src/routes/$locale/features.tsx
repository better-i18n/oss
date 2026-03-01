import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/features")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "features",
      pathname: "/features",
      pageType: "default",
    });
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  const t = useTranslations("featuresPage");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {t("hero.title", { defaultValue: "Everything you need to" })}
              <span className="block text-mist-600">{t("hero.titleHighlight", { defaultValue: "ship globally" })}</span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "AI-powered translations, git-native workflows, and instant CDN delivery. A complete localization platform built for modern development teams." })}
            </p>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-16">
            {/* AI Translation */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
                  {t("core.ai.badge", { defaultValue: "AI Translation Engine" })}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {t("core.ai.title", { defaultValue: "Translations that understand your product" })}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {t("core.ai.description", { defaultValue: "Our AI engine goes beyond literal word-for-word translation. It reads your glossary, learns your brand voice, and considers the full context of each string — including where it appears in your UI. The result: translations that sound natural in every language while staying true to your product identity." })}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={t("core.ai.glossary.title", { defaultValue: "Brand Glossary" })}
                  description={t("core.ai.glossary.description", { defaultValue: "Define product-specific terms once and enforce them across every translation." })}
                />
                <FeatureItem
                  title={t("core.ai.review.title", { defaultValue: "Review Workflow" })}
                  description={t("core.ai.review.description", { defaultValue: "Approve, edit, or flag AI-generated translations before they go live." })}
                />
                <FeatureItem
                  title={t("core.ai.context.title", { defaultValue: "Contextual Awareness" })}
                  description={t("core.ai.context.description", { defaultValue: "AI sees where each string appears in your app for accurate translations." })}
                />
                <FeatureItem
                  title={t("core.ai.batch.title", { defaultValue: "Batch Processing" })}
                  description={t("core.ai.batch.description", { defaultValue: "Translate entire projects across all target languages in one operation." })}
                />
              </div>
            </div>

            {/* Developer Workflow */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
                  {t("core.workflow.badge", { defaultValue: "Developer Workflow" })}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {t("core.workflow.title", { defaultValue: "Git-native from day one" })}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {t("core.workflow.description", { defaultValue: "Better i18n fits your existing development workflow instead of replacing it. Translations sync through pull requests, deploy through your CI/CD pipeline, and deliver through our global CDN. No context switching between dashboards — manage everything from your code editor or terminal." })}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={t("core.workflow.git.title", { defaultValue: "Git Sync" })}
                  description={t("core.workflow.git.description", { defaultValue: "Automatic PRs with translated content, synced to your repository." })}
                />
                <FeatureItem
                  title={t("core.workflow.cdn.title", { defaultValue: "CDN Delivery" })}
                  description={t("core.workflow.cdn.description", { defaultValue: "Translations served from 300+ edge locations for sub-50ms load times." })}
                />
                <FeatureItem
                  title={t("core.workflow.cli.title", { defaultValue: "CLI & SDK" })}
                  description={t("core.workflow.cli.description", { defaultValue: "Type-safe SDKs for React, Vue, Angular, and more with full autocomplete." })}
                />
                <FeatureItem
                  title={t("core.workflow.ota.title", { defaultValue: "OTA Updates" })}
                  description={t("core.workflow.ota.description", { defaultValue: "Push translation updates without redeploying your application." })}
                />
              </div>
            </div>

            {/* Content Discovery */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
                  {t("core.discovery.badge", { defaultValue: "Content Discovery" })}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {t("core.discovery.title", { defaultValue: "Automatically finds what needs translating" })}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {t("core.discovery.description", { defaultValue: "Our AST-based crawler scans your codebase to find every translatable string, then crawls your website to build a contextual glossary. No more manually tagging strings or maintaining lists of keys — Better i18n discovers and organizes everything for you." })}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={t("core.discovery.ast.title", { defaultValue: "AST Key Detection" })}
                  description={t("core.discovery.ast.description", { defaultValue: "Parses your source code to find every i18n key automatically." })}
                />
                <FeatureItem
                  title={t("core.discovery.crawler.title", { defaultValue: "Website Crawler" })}
                  description={t("core.discovery.crawler.description", { defaultValue: "Analyzes your live site to build terminology and context maps." })}
                />
                <FeatureItem
                  title={t("core.discovery.unused.title", { defaultValue: "Unused Key Detection" })}
                  description={t("core.discovery.unused.description", { defaultValue: "Find and clean up translation keys no longer referenced in code." })}
                />
                <FeatureItem
                  title={t("core.discovery.coverage.title", { defaultValue: "Coverage Reports" })}
                  description={t("core.discovery.coverage.description", { defaultValue: "See exactly which strings are translated, missing, or outdated." })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-8">
            {t("additionalFeatures.title", { defaultValue: "And so much more" })}
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <FeatureItem
                title={t("additionalFeatures.glossary.title", { defaultValue: "Glossary Management" })}
                description={t("additionalFeatures.glossary.description", { defaultValue: "Maintain consistent terminology across all languages with a centralized glossary." })}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.memory.title", { defaultValue: "Translation Memory" })}
                description={t("additionalFeatures.memory.description", { defaultValue: "Reuse previous translations to save time and maintain consistency." })}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.collaboration.title", { defaultValue: "Team Collaboration" })}
                description={t("additionalFeatures.collaboration.description", { defaultValue: "Review, comment, and approve translations with your team in real-time." })}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.versionControl.title", { defaultValue: "Version Control" })}
                description={t("additionalFeatures.versionControl.description", { defaultValue: "Full history of every translation change with rollback support." })}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.qa.title", { defaultValue: "Quality Assurance" })}
                description={t("additionalFeatures.qa.description", { defaultValue: "Automated checks for placeholders, formatting, and translation completeness." })}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.analytics.title", { defaultValue: "Analytics & Insights" })}
                description={t("additionalFeatures.analytics.description", { defaultValue: "Track translation progress, coverage, and team performance across projects." })}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
      <h3 className="text-base font-medium text-mist-950">{title}</h3>
      <p className="mt-2 text-sm text-mist-700 leading-relaxed">{description}</p>
    </div>
  );
}
