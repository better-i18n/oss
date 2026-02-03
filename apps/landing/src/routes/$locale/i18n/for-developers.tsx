import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCodeBrackets,
  IconGithub,
  IconRobot,
  IconScript,
  IconGlobe,
  IconZap,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/for-developers")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "forDevelopersSeo",
      pathname: "/i18n/for-developers",
    });
  },
  component: ForDevelopersSeoPage,
});

const features = [
  {
    icon: IconCodeBrackets,
    title: "Type-Safe SDKs",
    description: "Full TypeScript support with autocomplete for translation keys",
  },
  {
    icon: IconGithub,
    title: "Git-First Workflow",
    description: "Automatic key discovery from your codebase via AST parsing",
  },
  {
    icon: IconRobot,
    title: "MCP Integration",
    description: "Manage translations directly from Claude or Cursor",
  },
  {
    icon: IconScript,
    title: "CLI Tools",
    description: "Scan codebase, sync translations, and validate keys from terminal",
  },
  {
    icon: IconGlobe,
    title: "Edge CDN",
    description: "Sub-50ms translation delivery from Cloudflare's global network",
  },
  {
    icon: IconZap,
    title: "Hot Reload",
    description: "See translation changes instantly during development",
  },
];

function ForDevelopersSeoPage() {
  const t = useTranslations("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <span>{t("i18n.forDevelopers.badge")}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("i18n.forDevelopers.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.forDevelopers.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-mist-200 bg-white p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-mist-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-mist-600" />
                </div>
                <h3 className="text-base font-medium text-mist-950">{feature.title}</h3>
                <p className="mt-2 text-sm text-mist-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
            {t("i18n.forDevelopers.codeExample.title")}
          </h2>
          <p className="text-mist-600 mb-6">{t("i18n.forDevelopers.codeExample.description")}</p>
          <div className="bg-mist-950 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-mist-100 font-mono whitespace-pre">{`# Install the SDK
npm install @better-i18n/next

# Configure your project
npx better-i18n init

# Scan for translation keys
npx better-i18n scan

# Your code stays clean
import { useTranslations } from '@better-i18n/use-intl';

function Component() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}`}</pre>
          </div>
        </div>
      </section>

      {/* Framework Links */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-8">
            {t("i18n.forDevelopers.frameworks.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "React", slug: "react" },
              { name: "Next.js", slug: "nextjs" },
              { name: "Vue", slug: "vue" },
              { name: "Nuxt", slug: "nuxt" },
              { name: "Angular", slug: "angular" },
              { name: "Svelte", slug: "svelte" },
            ].map((fw) => (
              <Link
                key={fw.slug}
                to={`/$locale/i18n/${fw.slug}`}
                params={{ locale }}
                className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border border-mist-100 hover:border-mist-300 hover:shadow transition-all"
              >
                <span className="text-sm font-medium text-mist-950">{fw.name}</span>
                <IconArrowRight className="w-4 h-4 text-mist-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("i18n.forDevelopers.cta.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-300">{t("i18n.forDevelopers.cta.subtitle")}</p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("i18n.forDevelopers.cta.primary")}
            </a>
            <a
              href="https://docs.better-i18n.com"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("i18n.forDevelopers.cta.secondary")}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
