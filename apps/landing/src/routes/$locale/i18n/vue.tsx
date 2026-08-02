import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  LibraryIntegration,
  SetupGuide,
  CodeExample,
  FrameworkCTA,
  FrameworkFAQ,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { CoreSdkFlow } from "@/components/framework/SdkFlow";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Vue i18n page.
 *
 * IMPORTANT — this page used to document `@better-i18n/vue` with a
 * `useI18n()` import from it. That package does not exist (see `oss/packages/`:
 * core, use-intl, next, expo, server, remix, vite, cli, sdk, mcp, flutter) and
 * the docs only ship React SDKs plus iOS/Flutter/Server. A developer following
 * the old sample hit a 404 on `npm install`, which is a worse first impression
 * than having no Vue page at all.
 *
 * The honest and equally useful story, verified against the source:
 *   - `@better-i18n/core` has ZERO dependencies (packages/core/package.json
 *     `dependencies: {}`) and its only React file is an optional locale-dropdown
 *     helper, so `createI18nCore()` runs unchanged inside a Vue app.
 *   - `vue-i18n` stays the runtime formatter; Better i18n supplies the messages,
 *     the CDN, the AI translation workflow and the dashboard.
 *   - `getMessages(locale)` / `getLanguages()` are the real methods
 *     (packages/core/src/cdn.ts:796-799).
 *   - The CLI's scanner defaults to `[".tsx", ".jsx", ".ts", ".js"]`
 *     (packages/cli/src/analyzer/file-collector.ts:29), so `scan`/`sync` do NOT
 *     read `.vue` SFCs yet. That limitation is stated on the page instead of
 *     being papered over.
 */

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
        frameworkDescription:
          "Vue.js internationalization with vue-i18n and Better I18N: CDN-delivered translations, AI translation workflow, and runtime locale switching via @better-i18n/core.",
        dependencies: ["vue", "vue-i18n", "@better-i18n/core"],
      },
    });
  },
  component: VueI18nPage,
});

/* ── Verified code samples ─────────────────────────────────────────────
   Every Better i18n call below exists in @better-i18n/core's public API
   (packages/core/src/index.ts). vue-i18n calls are its v9+ Composition API. */

const STEP_INSTALL = `npm install @better-i18n/core vue-i18n

# @better-i18n/core ships zero dependencies —
# it is the same client our React SDKs are built on.`;

const STEP_CLIENT = `import { createI18nCore } from '@better-i18n/core'

export const betterI18n = createI18nCore({
  projectId: 'your-org/your-project', // Settings → General → Project ID
  defaultLocale: 'en',
})`;

const STEP_BOOT = `import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { betterI18n } from './lib/better-i18n'

const locale = 'en'

// Messages come from the Better i18n CDN, cached in-memory for 60s.
const messages = await betterI18n.getMessages(locale)

const i18n = createI18n({
  legacy: false,           // Composition API
  locale,
  fallbackLocale: 'en',
  messages: { [locale]: messages },
})

createApp(App).use(i18n).mount('#app')`;

const STEP_SWITCH = `import { useI18n } from 'vue-i18n'
import { betterI18n } from './lib/better-i18n'

const { locale, setLocaleMessage } = useI18n()

// Locales are discovered from the project manifest — no hardcoded list.
const languages = await betterI18n.getLanguages()

async function switchTo(next: string) {
  setLocaleMessage(next, await betterI18n.getMessages(next))
  locale.value = next
}`;

const SFC_EXAMPLE = `<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, d, n } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.greeting', { name: 'World' }) }}</p>

    <!-- ICU plurals authored in the Better i18n dashboard -->
    <p>{{ t('cart.items', { count: 3 }) }}</p>

    <!-- vue-i18n formatters, locale-aware -->
    <time>{{ d(new Date(), 'short') }}</time>
    <span>{{ n(1299.9, 'currency') }}</span>
  </section>
</template>`;

/* Key suffixes, not copy: resolved with t() in the component so the list
   translates with the rest of the page. Each line still maps to shipped
   behaviour of @better-i18n/core, the CDN or the dashboard. */
const FEATURE_KEYS = [
  "cdn",
  "ttlCache",
  "storageFallback",
  "staticData",
  "manifest",
  "aiGlossary",
  "publishPurge",
  "mcp",
  "nuxtServer",
  "icu",
];

const SETUP_STEPS = [
  {
    step: 1,
    id: "step1",
    code: STEP_INSTALL,
    fileName: "terminal",
    language: "bash",
  },
  {
    step: 2,
    id: "step2",
    code: STEP_CLIENT,
    fileName: "src/lib/better-i18n.ts",
    language: "ts",
  },
  {
    step: 3,
    id: "step3",
    code: STEP_BOOT,
    fileName: "src/main.ts",
    language: "ts",
  },
  {
    step: 4,
    id: "step4",
    code: STEP_SWITCH,
    fileName: "src/components/LocaleSwitcher.vue",
    language: "vue",
  },
];

const LIBRARIES = [
  {
    name: "vue-i18n",
    id: "vueI18n",
  },
  {
    name: "Nuxt",
    id: "nuxt",
  },
  {
    name: "Vue Router",
    id: "vueRouter",
  },
];

function VueI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  /* Copy comes from the CDN, structure from the module-scope constants above:
     the code samples and file names stay in the file (they are code, not copy),
     the prose is resolved here. */
  const features = FEATURE_KEYS.map((k) => t(`i18n.vue.features.${k}`));
  const setupSteps = SETUP_STEPS.map((step) => ({
    ...step,
    title: t(`i18n.vue.setup.${step.id}.title`),
    description: t(`i18n.vue.setup.${step.id}.description`),
  }));
  const libraries = LIBRARIES.map((lib) => ({
    ...lib,
    description: t(`i18n.vue.libraries.${lib.id}.description`),
    integrationText: t(`i18n.vue.libraries.${lib.id}.integration`),
  }));

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

      <SetupGuide
        icon="rocket"
        eyebrow={t("i18n.vue.eyebrow.setup")}
        title={t("i18n.vue.setup.title")}
        subtitle={t("i18n.vue.setup.subtitle")}
        steps={setupSteps}
      />

      {/* How the SDK actually behaves at runtime — the picture the framework
          pages were missing between all the code blocks. Numbers are the shipped
          ones: CDN max-age=60, in-memory TTL 60s, HTTP 200 on every CDN answer,
          zero dependencies in @better-i18n/core. */}
      {/* One shared architecture story for all framework pages (CoreSdkFlow),
          instead of this page keeping its own copy of the read path, the
          fallback chain and the publish path. When the platform changes, one
          component changes — not five pages. */}
      <CoreSdkFlow
        title={t("i18n.vue.flow.title")}
        subtitle={t("i18n.vue.flow.subtitle")}
        appTitle={t("i18n.vue.flow.appTitle")}
        appMeta={t("i18n.vue.flow.appMeta")}
      />

      <CodeExample
        icon="code-brackets"
        eyebrow={t("i18n.vue.eyebrow.component")}
        title={t("i18n.vue.codeExample.title")}
        description={t("i18n.vue.codeExample.description")}
        code={SFC_EXAMPLE}
        fileName="src/components/Home.vue"
        language="vue"
      />

      <FeatureList
        icon="zap"
        eyebrow={t("i18n.vue.eyebrow.whatYouGet")}
        title={t("i18n.vue.featuresTitle")}
        subtitle={t("i18n.vue.featuresSubtitle")}
        features={features}
      />

      <LibraryIntegration
        icon="api-connection"
        eyebrow={t("i18n.vue.eyebrow.worksWith")}
        title={t("i18n.vue.libraries.title")}
        subtitle={t("i18n.vue.libraries.subtitle")}
        libraries={libraries}
      />

      <ComparisonRelatedTopics heading={t("i18n.vue.relatedTitle")} links={relatedLinks} locale={locale} />

      <FrameworkFAQ
        title={t("i18n.vue.faq.title")}
        items={[
          "wrapper",
          "bestLibrary",
          "compositionApi",
          "cliSfc",
          "nuxtSsr",
          "plurals",
          "cdnFails",
          "publishSpeed",
        ].map((id) => ({
          id,
          question: t(`i18n.vue.faq.items.${id}.question`),
          answer: t(`i18n.vue.faq.items.${id}.answer`),
        }))}
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
        secondaryHref="https://docs.better-i18n.com/frameworks/quick-start"
      />
    </MarketingLayout>
  );
}
