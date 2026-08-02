import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  FrameworkHero,
  FeatureList,
  SetupGuide,
  CodeExample,
  TabbedCode,
  FrameworkCTA,
  OtherFrameworks,
} from "@/components/FrameworkComparison";
import { CoreSdkFlow } from "@/components/framework/SdkFlow";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * Vanilla JavaScript i18n.
 *
 * This page used to declare `@better-i18n/js` as its dependency. That package
 * does not exist — `oss/packages/` ships core, use-intl, next, expo, server,
 * remix, vite, cli, sdk, mcp and flutter — so `npm install @better-i18n/js`
 * 404s for anyone who follows the page.
 *
 * The correction happens to be the simplest true story on the site: plain
 * JavaScript is exactly what `@better-i18n/core` already is. Zero dependencies
 * (packages/core/package.json `dependencies: {}`), no framework import on the
 * main path, and the public API (`createI18nCore`, `getMessages`,
 * `getLanguages`, `normalizeLocale` — packages/core/src/index.ts) is what every
 * framework SDK here is built on. There is no wrapper to install because there
 * is no framework to wrap.
 *
 * The Intl code sample below is existing indexed content and is kept verbatim.
 */

export const Route = createFileRoute("/$locale/i18n/javascript")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nJavaScript",
      pathname: "/i18n/javascript",
      pageType: "framework",
      structuredDataOptions: {
        framework: "JavaScript",
        frameworkDescription:
          "JavaScript internationalization with the Intl API and @better-i18n/core: CDN-delivered translations, in-memory caching, and no framework dependency.",
        dependencies: ["@better-i18n/core"],
      },
    });
  },
  component: JavaScriptI18nPage,
});

const INSTALL_CODE = `npm install @better-i18n/core

# Zero dependencies. Runs in browsers, Node, Deno,
# Bun and Cloudflare Workers.`;

const CLIENT_CODE = `import { createI18nCore } from '@better-i18n/core'

export const i18n = createI18nCore({
  projectId: 'your-org/your-project', // Settings → General → Project ID
  defaultLocale: 'en',
})`;

const READ_CODE = `import { i18n } from './i18n.js'

const messages = await i18n.getMessages('en')

// getMessages resolves to { namespace: { key: value } }
const t = (path) =>
  path.split('.').reduce((node, part) => node?.[part], messages) ?? path

document.querySelector('h1').textContent = t('home.title')

// Locales come from the project manifest, not a hardcoded array
const languages = await i18n.getLanguages()`;

const SWITCH_CODE = `import { i18n } from './i18n.js'
import { normalizeLocale } from '@better-i18n/core'

let current = 'en'
let messages = await i18n.getMessages(current)

export async function setLocale(next) {
  // The CDN stores locales lowercased: pt-BR → pt-br
  current = normalizeLocale(next)
  messages = await i18n.getMessages(current)
  document.documentElement.lang = current
  render()
}`;

const FETCH_CODE = `// No SDK at all — the CDN is a plain JSON endpoint.
const ORG = 'your-org'
const PROJECT = 'your-project'

async function loadMessages(locale) {
  const res = await fetch(
    \`https://cdn.better-i18n.com/\${ORG}/\${PROJECT}/\${locale}/translations.json\`
  )
  // The CDN always answers 200 — on an internal error it returns {}
  return res.json()
}

// Available locales, from the manifest
async function loadLocales() {
  const res = await fetch(
    \`https://cdn.better-i18n.com/\${ORG}/\${PROJECT}/manifest.json\`
  )
  return res.json()
}`;

/* Existing indexed content — kept verbatim. */
const INTL_CODE = `// Using the built-in Intl API
const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});
console.log(formatter.format(1234.56)); // "1.234,56 €"

// Date formatting
const date = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
console.log(date.format(new Date())); // "2026年3月2日"

// Pluralization
const plural = new Intl.PluralRules('en');
const suffixes = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
function ordinal(n) {
  return \`\${n}\${suffixes[plural.select(n)]}\`;
}`;

function JavaScriptI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const features = [
    t("i18n.javascript.features.intlApi"),
    t("i18n.javascript.features.numberFormat"),
    t("i18n.javascript.features.dateTimeFormat"),
    t("i18n.javascript.features.pluralRules"),
    t("i18n.javascript.features.messageFormat"),
    t("i18n.javascript.features.relativeTime"),
    t("i18n.javascript.features.listFormat"),
    t("i18n.javascript.features.collator"),
    t("i18n.javascript.features.segmenter"),
  ];

  const relatedLinks = [
    {
      title: "React i18n",
      to: "/$locale/i18n/react",
      description: t("i18n.javascript.related.react"),
    },
    {
      title: "Next.js i18n",
      to: "/$locale/i18n/nextjs",
      description: t("i18n.javascript.related.nextjs"),
    },
    {
      title: t("i18n.javascript.related.comparisons"),
      to: "/$locale/compare",
      description: t("i18n.javascript.related.comparisonsDesc"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.javascript.hero.title")}
        subtitle={t("i18n.javascript.hero.subtitle")}
        badgeText="JavaScript i18n"
      />

      <SetupGuide
        icon="rocket"
        eyebrow="Setup"
        title={t("i18n.javascript.setup.title")}
        subtitle={t("i18n.javascript.setup.subtitle")}
        steps={[
          {
            step: 1,
            title: t("i18n.javascript.setup.step1.title"),
            description: t("i18n.javascript.setup.step1.description"),
            code: INSTALL_CODE,
            fileName: "terminal",
            language: "bash",
          },
          {
            step: 2,
            title: t("i18n.javascript.setup.step2.title"),
            description: t("i18n.javascript.setup.step2.description"),
            code: CLIENT_CODE,
            fileName: "i18n.js",
            language: "js",
          },
          {
            step: 3,
            title: t("i18n.javascript.setup.step3.title"),
            description: t("i18n.javascript.setup.step3.description"),
            code: READ_CODE,
            fileName: "main.js",
            language: "js",
          },
        ]}
      />

      <CoreSdkFlow
        title={t("i18n.javascript.flow.title")}
        subtitle={t("i18n.javascript.flow.subtitle")}
        appTitle="Your JavaScript app"
        appMeta="Reads from the plain object getMessages() already returned."
      />

      <TabbedCode
        icon="code"
        eyebrow="Two ways"
        title={t("i18n.javascript.tabbed.title")}
        description={t("i18n.javascript.tabbed.subtitle")}
        tabs={[
          { label: "core", code: SWITCH_CODE, fileName: "locale.js" },
          { label: "fetch", code: FETCH_CODE, fileName: "cdn.js" },
        ]}
      />

      <CodeExample
        icon="code-brackets"
        eyebrow="Formatting"
        title={t("i18n.javascript.codeExample.title")}
        description={t("i18n.javascript.codeExample.description")}
        code={INTL_CODE}
        fileName="format.js"
        language="js"
      />

      <FeatureList
        icon="zap"
        eyebrow="Capabilities"
        title={t("i18n.javascript.featuresTitle")}
        features={features}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.javascript.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.javascript.otherFrameworks")}
        currentFramework="javascript"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.javascript.cta.title")}
        subtitle={t("i18n.javascript.cta.subtitle")}
        primaryCTA={t("i18n.javascript.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.javascript.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/frameworks/quick-start"
      />
    </MarketingLayout>
  );
}
