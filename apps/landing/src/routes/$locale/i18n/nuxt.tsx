import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/i18n/nuxt")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nNuxt",
      pathname: "/i18n/nuxt",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Nuxt",
        frameworkDescription: "Nuxt 3 i18n with auto-routing, middleware support, and SEO-friendly localization.",
        dependencies: ["nuxt", "vue", "@better-i18n/nuxt"],
      },
    });
  },
  component: NuxtI18nPage,
});

function NuxtI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.nuxt.features.nuxt3"),
    t("i18n.nuxt.features.autoImport"),
    t("i18n.nuxt.features.seo"),
    t("i18n.nuxt.features.routing"),
    t("i18n.nuxt.features.lazyLoading"),
    t("i18n.nuxt.features.ssr"),
    t("i18n.nuxt.features.devtools"),
    t("i18n.nuxt.features.nitro"),
    t("i18n.nuxt.features.hybrid"),
  ];

  const codeExample = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@better-i18n/nuxt'],
  betterI18n: {
    project: 'my-org/my-project',
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de']
  }
})

// pages/index.vue
<script setup>
const { t } = useI18n()
</script>

<template>
  <h1>{{ t('welcome') }}</h1>
</template>`;

  const relatedLinks = [
    { title: "Vue i18n", to: "/$locale/i18n/vue", description: t("i18n.nuxt.related.vue") },
    { title: "Next.js i18n", to: "/$locale/i18n/nextjs", description: t("i18n.nuxt.related.nextjs") },
    { title: t("i18n.nuxt.related.comparisons"), to: "/$locale/compare", description: t("i18n.nuxt.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.nuxt.hero.title")}
        subtitle={t("i18n.nuxt.hero.subtitle")}
        badgeText="Nuxt i18n"
      />

      <FeatureList title={t("i18n.nuxt.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.nuxt.codeExample.title")}
        description={t("i18n.nuxt.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics heading={t("i18n.nuxt.relatedTitle")} links={relatedLinks} locale={locale} />

      <OtherFrameworks
        title={t("i18n.nuxt.otherFrameworks")}
        currentFramework="nuxt"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.nuxt.cta.title")}
        subtitle={t("i18n.nuxt.cta.subtitle")}
        primaryCTA={t("i18n.nuxt.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.nuxt.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
