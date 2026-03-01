import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import Features from "@/components/Features";
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
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n Features",
        description: "Explore features: AI translations, Git integration, OTA updates, CDN delivery, type-safe SDKs, and collaboration tools for developer-first i18n.",
      },
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

      {/* Features Grid from homepage */}
      <Features />

      {/* Additional Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-8">
            {t("additionalFeatures.title", { defaultValue: "And so much more" })}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem
              title={t("additionalFeatures.glossary.title", { defaultValue: "Glossary Management" })}
              description={t("additionalFeatures.glossary.description", { defaultValue: "Maintain consistent terminology across all languages with a centralized glossary." })}
            />
            <FeatureItem
              title={t("additionalFeatures.memory.title", { defaultValue: "Translation Memory" })}
              description={t("additionalFeatures.memory.description", { defaultValue: "Reuse previous translations to save time and maintain consistency." })}
            />
            <FeatureItem
              title={t("additionalFeatures.collaboration.title", { defaultValue: "Team Collaboration" })}
              description={t("additionalFeatures.collaboration.description", { defaultValue: "Review, comment, and approve translations with your team in real-time." })}
            />
            <FeatureItem
              title={t("additionalFeatures.versionControl.title", { defaultValue: "Version Control" })}
              description={t("additionalFeatures.versionControl.description", { defaultValue: "Full history of every translation change with rollback support." })}
            />
            <FeatureItem
              title={t("additionalFeatures.qa.title", { defaultValue: "Quality Assurance" })}
              description={t("additionalFeatures.qa.description", { defaultValue: "Automated checks for placeholders, formatting, and translation completeness." })}
            />
            <FeatureItem
              title={t("additionalFeatures.analytics.title", { defaultValue: "Analytics & Insights" })}
              description={t("additionalFeatures.analytics.description", { defaultValue: "Track translation progress, coverage, and team performance across projects." })}
            />
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="for" />
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
