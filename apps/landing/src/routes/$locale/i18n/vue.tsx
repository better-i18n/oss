import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  CodeExample,
  FrameworkCTA,
  FrameworkFAQ,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

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
  const t = useT("marketing");
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

  const relatedLinks = [
    { title: "Nuxt i18n", to: "/$locale/i18n/nuxt", description: t("i18n.vue.related.nuxt") },
    { title: "React i18n", to: "/$locale/i18n/react", description: t("i18n.vue.related.react") },
    { title: t("i18n.vue.related.comparisons"), to: "/$locale/compare", description: t("i18n.vue.related.comparisonsDesc") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
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

      <ComparisonRelatedTopics heading={t("i18n.vue.relatedTitle")} links={relatedLinks} locale={locale} />

      <FrameworkFAQ
        title="Vue i18n — Frequently Asked Questions"
        items={[
          {
            question: "What is the best i18n library for Vue.js?",
            answer: "vue-i18n is the official internationalization plugin for Vue.js, maintained by the Vue core team. It supports Vue 2 and Vue 3, the Composition API, and integrates natively with Nuxt via @nuxtjs/i18n. For teams that also need a translation management platform, Better i18n connects directly to vue-i18n projects via CDN delivery and CLI sync.",
          },
          {
            question: "How does Vue i18n work with the Composition API?",
            answer: "In Vue 3 with the Composition API, you call useI18n() inside setup() to get the t() translation function, d() for date formatting, and n() for number formatting. The composable is reactive — changing the locale automatically re-renders all components that reference translated strings. With Better i18n, translations are fetched from the CDN on first load and cached in-memory for subsequent route changes.",
          },
          {
            question: "Can I use Better i18n with Nuxt?",
            answer: "Yes. Better i18n works with Nuxt through the @better-i18n/core package or via direct CDN integration. You add the CDN loader in your Nuxt plugin, point it to your Better i18n project, and translations are available server-side and client-side. The @nuxtjs/i18n module handles routing and locale switching while Better i18n handles translation delivery and management.",
          },
          {
            question: "How do I handle pluralization in Vue i18n?",
            answer: "vue-i18n supports ICU message format and its own pipe-based pluralization syntax. For ICU (recommended for complex rules), you define messages like '{count, plural, one {# item} other {# items}}'. For simple cases, vue-i18n's pipe syntax '{0} item | {0} items' works well. Better i18n's dashboard preserves ICU syntax and ensures translators see the correct plural forms for each target language.",
          },
          {
            question: "What is lazy loading in Vue i18n and why does it matter?",
            answer: "Lazy loading means translation files are only fetched when a user switches to that locale — reducing initial bundle size. Better i18n implements lazy loading automatically via CDN: your app only downloads the active locale's translations, and the CDN serves them from the edge closest to your user. This keeps Time-to-Interactive fast regardless of how many languages you support.",
          },
          {
            question: "How do I extract and sync Vue i18n keys to Better i18n?",
            answer: "The Better i18n CLI (`@better-i18n/cli`) scans your Vue files for t() calls, extracts all translation keys, and pushes them to your Better i18n project. Running `better-i18n sync` in CI keeps your dashboard in sync with your codebase automatically. New keys appear in the dashboard ready for translation, and published translations are served via CDN within seconds.",
          },
        ]}
      />

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
