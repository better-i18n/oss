import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { getMarketingPages, type MarketingPageListItem } from "@/lib/content";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const loadFeaturePages = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPages(data.locale, "feature");
  });

export const Route = createFileRoute("/$locale/features")({
  loader: async ({ params, context }) => {
    const featurePages = await loadFeaturePages({
      data: { locale: params.locale },
    });
    return {
      messages: context.messages,
      locale: context.locale,
      featurePages,
    };
  },
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
  const { featurePages } = Route.useLoaderData();

  /** Translate with fallback — use-intl v4 doesn't support defaultValue */
  const ft = (key: string, fallback: string) =>
    t.has(key) ? t(key) : fallback;

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {ft("hero.title", "Everything you need to")}
              <span className="block text-mist-600">{ft("hero.titleHighlight", "ship globally")}</span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {ft("hero.subtitle", "AI-powered translations, git-native workflows, and instant CDN delivery. A complete localization platform built for modern development teams.")}
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
                  {ft("core.ai.badge", "AI Translation Engine")}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {ft("core.ai.title", "Translations that understand your product")}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {ft("core.ai.description", "Our AI engine goes beyond literal word-for-word translation. It reads your glossary, learns your brand voice, and considers the full context of each string — including where it appears in your UI. The result: translations that sound natural in every language while staying true to your product identity.")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={ft("core.ai.glossary.title", "Brand Glossary")}
                  description={ft("core.ai.glossary.description", "Define product-specific terms once and enforce them across every translation.")}
                />
                <FeatureItem
                  title={ft("core.ai.review.title", "Review Workflow")}
                  description={ft("core.ai.review.description", "Approve, edit, or flag AI-generated translations before they go live.")}
                />
                <FeatureItem
                  title={ft("core.ai.context.title", "Contextual Awareness")}
                  description={ft("core.ai.context.description", "AI sees where each string appears in your app for accurate translations.")}
                />
                <FeatureItem
                  title={ft("core.ai.batch.title", "Batch Processing")}
                  description={ft("core.ai.batch.description", "Translate entire projects across all target languages in one operation.")}
                />
              </div>
            </div>

            {/* Developer Workflow */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
                  {ft("core.workflow.badge", "Developer Workflow")}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {ft("core.workflow.title", "Git-native from day one")}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {ft("core.workflow.description", "Better i18n fits your existing development workflow instead of replacing it. Translations sync through pull requests, deploy through your CI/CD pipeline, and deliver through our global CDN. No context switching between dashboards — manage everything from your code editor or terminal.")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={ft("core.workflow.git.title", "Git Sync")}
                  description={ft("core.workflow.git.description", "Automatic PRs with translated content, synced to your repository.")}
                />
                <FeatureItem
                  title={ft("core.workflow.cdn.title", "CDN Delivery")}
                  description={ft("core.workflow.cdn.description", "Translations served from 300+ edge locations for sub-50ms load times.")}
                />
                <FeatureItem
                  title={ft("core.workflow.cli.title", "CLI & SDK")}
                  description={ft("core.workflow.cli.description", "Type-safe SDKs for React, Vue, Angular, and more with full autocomplete.")}
                />
                <FeatureItem
                  title={ft("core.workflow.ota.title", "OTA Updates")}
                  description={ft("core.workflow.ota.description", "Push translation updates without redeploying your application.")}
                />
              </div>
            </div>

            {/* Content Discovery */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
                  {ft("core.discovery.badge", "Content Discovery")}
                </span>
                <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
                  {ft("core.discovery.title", "Automatically finds what needs translating")}
                </h2>
                <p className="mt-4 text-base/7 text-mist-700">
                  {ft("core.discovery.description", "Our AST-based crawler scans your codebase to find every translatable string, then crawls your website to build a contextual glossary. No more manually tagging strings or maintaining lists of keys — Better i18n discovers and organizes everything for you.")}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureItem
                  title={ft("core.discovery.ast.title", "AST Key Detection")}
                  description={ft("core.discovery.ast.description", "Parses your source code to find every i18n key automatically.")}
                />
                <FeatureItem
                  title={ft("core.discovery.crawler.title", "Website Crawler")}
                  description={ft("core.discovery.crawler.description", "Analyzes your live site to build terminology and context maps.")}
                />
                <FeatureItem
                  title={ft("core.discovery.unused.title", "Unused Key Detection")}
                  description={ft("core.discovery.unused.description", "Find and clean up translation keys no longer referenced in code.")}
                />
                <FeatureItem
                  title={ft("core.discovery.coverage.title", "Coverage Reports")}
                  description={ft("core.discovery.coverage.description", "See exactly which strings are translated, missing, or outdated.")}
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
            {ft("additionalFeatures.title", "And so much more")}
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <FeatureItem
                title={ft("additionalFeatures.glossary.title", "Glossary Management")}
                description={ft("additionalFeatures.glossary.description", "Maintain consistent terminology across all languages with a centralized glossary.")}
              />
            </li>
            <li>
              <FeatureItem
                title={ft("additionalFeatures.memory.title", "Translation Memory")}
                description={ft("additionalFeatures.memory.description", "Reuse previous translations to save time and maintain consistency.")}
              />
            </li>
            <li>
              <FeatureItem
                title={ft("additionalFeatures.collaboration.title", "Team Collaboration")}
                description={ft("additionalFeatures.collaboration.description", "Review, comment, and approve translations with your team in real-time.")}
              />
            </li>
            <li>
              <FeatureItem
                title={ft("additionalFeatures.versionControl.title", "Version Control")}
                description={ft("additionalFeatures.versionControl.description", "Full history of every translation change with rollback support.")}
              />
            </li>
            <li>
              <FeatureItem
                title={ft("additionalFeatures.qa.title", "Quality Assurance")}
                description={ft("additionalFeatures.qa.description", "Automated checks for placeholders, formatting, and translation completeness.")}
              />
            </li>
            <li>
              <FeatureItem
                title={ft("additionalFeatures.analytics.title", "Analytics & Insights")}
                description={ft("additionalFeatures.analytics.description", "Track translation progress, coverage, and team performance across projects.")}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* CMS Feature Pages */}
      {featurePages.length > 0 && (
        <FeaturePagesGrid featurePages={featurePages} locale={locale} />
      )}

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

function FeaturePagesGrid({
  featurePages,
  locale,
}: {
  featurePages: MarketingPageListItem[];
  locale: string;
}) {
  return (
    <section className="py-16 bg-mist-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-3">
          Deep dive into each feature
        </h2>
        <p className="text-base text-mist-600 mb-8 max-w-2xl">
          Learn how each capability works in detail with examples, use cases, and technical documentation.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featurePages.map((feature) => (
            <Link
              key={feature.slug}
              to="/$locale/features/$slug"
              params={{ locale, slug: feature.slug }}
              className="group flex items-center justify-between p-5 rounded-xl bg-white border border-mist-200 hover:border-mist-300 hover:shadow-md transition-all"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
                  {feature.title}
                </h3>
                {feature.heroSubtitle && (
                  <p className="mt-1 text-xs text-mist-500 leading-relaxed line-clamp-2">
                    {feature.heroSubtitle}
                  </p>
                )}
              </div>
              <IconArrowRight className="w-4 h-4 flex-shrink-0 ml-3 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
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
