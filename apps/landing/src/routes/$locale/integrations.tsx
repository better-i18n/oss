import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconGithub,
  IconApiConnection,
  IconConsole,
  IconSparklesSoft,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  NextjsIcon,
  TanStackIcon,
  ViteIcon,
  RemixIcon,
  ExpoIcon,
  ReactIcon,
  VueIcon,
  AngularIcon,
  SvelteIcon,
  NuxtIcon,
  AstroIcon,
} from "@/components/icons/FrameworkIcons";

export const Route = createFileRoute("/$locale/integrations")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      locales: loaderData?.locales,
      pageKey: "integrations",
      pathname: "/integrations",
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n Integrations",
        description: "Integrate Better i18n with React, Next.js, Vue, Angular, Svelte, Nuxt, and more. GitHub, CLI, API, and MCP server support.",
      },
    });
  },
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const t = useTranslations("integrationsPage");
  const { locale } = Route.useParams();

  const frameworks = [
    { name: "React",          icon: ReactIcon,    descKey: "frameworks.react.description" },
    { name: "Next.js",        icon: NextjsIcon,   descKey: "frameworks.nextjs.description" },
    { name: "Vue",            icon: VueIcon,      descKey: "frameworks.vue.description" },
    { name: "Angular",        icon: AngularIcon,  descKey: "frameworks.angular.description" },
    { name: "Svelte",         icon: SvelteIcon,   descKey: "frameworks.svelte.description" },
    { name: "Nuxt",           icon: NuxtIcon,     descKey: "frameworks.nuxt.description" },
    { name: "Remix",          icon: RemixIcon,    descKey: "frameworks.remix.description" },
    { name: "Astro",          icon: AstroIcon,    descKey: "frameworks.astro.description" },
    { name: "TanStack Start", icon: TanStackIcon, descKey: "frameworks.tanstack.description" },
    { name: "Vite",           icon: ViteIcon,     descKey: "frameworks.vite.description" },
    { name: "Expo",           icon: ExpoIcon,     descKey: "frameworks.expo.description" },
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
                <div className="flex size-9 items-center justify-center rounded-xl border border-mist-100 bg-white text-mist-700 mb-3">
                  <fw.icon className="size-[18px]" />
                </div>
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
            <div className="rounded-xl bg-mist-950 p-6 overflow-x-auto code-block">
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

      {/* Related Pages */}
      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
  );
}
