import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCodeBrackets,
  IconGithub,
  IconApiConnection,
  IconConsole,
  IconSparklesSoft,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/integrations")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "integrations",
      pathname: "/integrations",
    });
  },
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const t = useTranslations("integrationsPage");

  const frameworks = [
    { name: "React", icon: "⚛️", descKey: "frameworks.react.description" },
    { name: "Next.js", icon: "▲", descKey: "frameworks.nextjs.description" },
    { name: "Vue", icon: "💚", descKey: "frameworks.vue.description" },
    { name: "Angular", icon: "🅰️", descKey: "frameworks.angular.description" },
    { name: "Svelte", icon: "🔥", descKey: "frameworks.svelte.description" },
    { name: "Nuxt", icon: "💚", descKey: "frameworks.nuxt.description" },
    { name: "Remix", icon: "💿", descKey: "frameworks.remix.description" },
    { name: "Astro", icon: "🚀", descKey: "frameworks.astro.description" },
  ];

  const tools = [
    { nameKey: "tools.github.title", icon: IconGithub, descKey: "tools.github.description" },
    { nameKey: "tools.cli.title", icon: IconConsole, descKey: "tools.cli.description" },
    { nameKey: "tools.api.title", icon: IconApiConnection, descKey: "tools.api.description" },
    { nameKey: "tools.mcp.title", icon: IconSparklesSoft, descKey: "tools.mcp.description" },
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {t("hero.title")}
              <span className="block text-mist-600">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950">
              {t("frameworks.title")}
            </h2>
            <p className="mt-2 text-mist-700">
              {t("frameworks.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {frameworks.map((fw) => (
              <div
                key={fw.name}
                className="p-5 rounded-xl bg-mist-50 border border-mist-100 hover:border-mist-300 transition-colors"
              >
                <div className="text-2xl mb-3">{fw.icon}</div>
                <h3 className="text-base font-medium text-mist-950">{fw.name}</h3>
                <p className="mt-1 text-sm text-mist-600 leading-relaxed">{t(fw.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Tools */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950">
              {t("tools.title")}
            </h2>
            <p className="mt-2 text-mist-700">
              {t("tools.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.nameKey}
                className="p-6 rounded-xl bg-white border border-mist-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 shrink-0">
                    <tool.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-mist-950">{t(tool.nameKey)}</h3>
                    <p className="mt-2 text-sm text-mist-700 leading-relaxed">{t(tool.descKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950">
              {t("getStarted.title")}
            </h2>
            <p className="mt-2 text-mist-700">
              {t("getStarted.subtitle")}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="rounded-xl bg-mist-950 p-6 overflow-x-auto">
              <pre className="text-sm text-mist-100 font-mono">
                <code>{`# Install the SDK
npm install @better-i18n/next

# Add to your next.config.js
import { withBetterI18n } from '@better-i18n/next'

export default withBetterI18n({
  project: 'your-org/your-project',
  locales: ['en', 'tr', 'de', 'fr'],
  defaultLocale: 'en',
})`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
