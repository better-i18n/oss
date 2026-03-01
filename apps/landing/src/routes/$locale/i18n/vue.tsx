import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  RelatedPages,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";

export const Route = createFileRoute("/$locale/i18n/vue")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nVue",
      pathname: "/i18n/vue",
      pageType: "framework",
      structuredDataOptions: {
        framework: "Vue.js",
        frameworkDescription: "Vue.js internationalization with Composition API, SFC i18n blocks, and Nuxt integration.",
        dependencies: ["vue", "@better-i18n/vue"],
      },
    });
  },
  component: VueI18nPage,
});

function VueI18nPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.vue.features.composition"),
    t("i18n.vue.features.options"),
    t("i18n.vue.features.sfc"),
    t("i18n.vue.features.pluralization"),
    t("i18n.vue.features.datetime"),
    t("i18n.vue.features.number"),
    t("i18n.vue.features.lazyLoading"),
    t("i18n.vue.features.nuxt"),
    t("i18n.vue.features.devtools"),
  ];

  const codeExample = `<script setup>
import { useI18n } from '@better-i18n/vue';

const { t } = useI18n();
</script>

<template>
  <div>
    <h1>{{ t('welcome') }}</h1>
    <p>{{ t('greeting', { name: 'World' }) }}</p>
  </div>
</template>`;

  const relatedPages = [
    { name: "Nuxt i18n", href: "/$locale/i18n/nuxt", description: t("i18n.vue.related.nuxt") },
    { name: "React i18n", href: "/$locale/i18n/react", description: t("i18n.vue.related.react") },
    { name: t("i18n.vue.related.comparisons"), href: "/$locale/compare", description: t("i18n.vue.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <FrameworkHero
        title={t("i18n.vue.hero.title")}
        subtitle={t("i18n.vue.hero.subtitle")}
        badgeText="Vue i18n"
      />

      <FeatureList title={t("i18n.vue.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.vue.codeExample.title")}
        description={t("i18n.vue.codeExample.description")}
        code={codeExample}
      />

      <RelatedPages title={t("i18n.vue.relatedTitle")} pages={relatedPages} locale={locale} />

      <OtherFrameworks
        title={t("i18n.vue.otherFrameworks")}
        currentFramework="vue"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.vue.cta.title")}
        subtitle={t("i18n.vue.cta.subtitle")}
        primaryCTA={t("i18n.vue.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.vue.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com"
      />
    </MarketingLayout>
  );
}
