import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCodeBrackets,
  IconGithub,
  IconRobot,
  IconScript,
  IconGlobe,
  IconZap,
  IconArrowRight,
  IconApiConnection,
  IconShieldCheck,
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
  const t = useT("marketing");
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
  const t = useT('common');
  return <h1>{t('welcome')}</h1>;
}`}</pre>
          </div>
        </div>
      </section>

      {/* CDN Performance */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
                {t("i18n.forDevelopers.cdn.title", { defaultValue: "Edge CDN Performance" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.forDevelopers.cdn.description", { defaultValue: "Translations are served from Cloudflare's global edge network with aggressive caching and smart invalidation so your users always get the fastest possible load times." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0 space-y-3">
              {[
                { label: "Manifest Cache", detail: "5-minute TTL with smart invalidation on publish" },
                { label: "Translation Cache", detail: "1-hour TTL for optimal repeat-visit performance" },
                { label: "Global Propagation", detail: "5-10 second cache propagation after publish" },
                { label: "Cache Purging", detail: "Publish triggers global invalidation instantly" },
                { label: "Preload Support", detail: "<link rel=preload> for faster initial loading" },
                { label: "Edge Locations", detail: "North America, Europe, and Asia Pacific" },
                { label: "Immutable Assets", detail: "1-year cache for static assets like flags" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-mist-50 border border-mist-100">
                  <IconZap className="w-4 h-4 text-mist-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-mist-950">{item.label}</span>
                    <span className="text-sm text-mist-600"> — {item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API & Webhooks */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <div className="w-10 h-10 rounded-lg bg-mist-100 flex items-center justify-center mb-4">
                <IconApiConnection className="w-5 h-5 text-mist-600" />
              </div>
              <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
                {t("i18n.forDevelopers.api.title", { defaultValue: "REST API & Webhooks" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.forDevelopers.api.description", { defaultValue: "Programmatic access to every platform function. Manage projects, keys, and languages from your own tooling or CI pipeline." })}
              </p>
              <div className="bg-mist-950 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm text-mist-100 font-mono whitespace-pre">{`// REST API methods
listProjects()
getProject(id)
addLanguage(projectId, locale)
listKeys(projectId)
createKeys(projectId, keys[])
updateKeys(projectId, keys[])
deleteKeys(projectId, keyIds[])`}</pre>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-mist-200">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.webhooks.title", { defaultValue: "Webhook Events" })}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.webhooks.description", { defaultValue: "Receive push events when syncs complete, translations are published, or keys are modified." })}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-mist-200">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.batch.title", { defaultValue: "Batch Operations" })}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.batch.description", { defaultValue: "Create, update, or delete multiple keys in a single request. Each key is tracked by a unique UUID across syncs." })}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-mist-200">
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.sync.title", { defaultValue: "Sync Status Tracking" })}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.sync.description", { defaultValue: "Monitor sync jobs through pending, in-progress, completed, and failed states. Soft-deleted keys are preserved with timestamps for auditing." })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Experience */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
            {t("i18n.forDevelopers.dx.title", { defaultValue: "Developer Experience" })}
          </h2>
          <p className="text-mist-700 mb-8 max-w-2xl">
            {t("i18n.forDevelopers.dx.description", { defaultValue: "Built for developers who care about type safety, debugging, and performance observability." })}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Namespace Scoping", desc: "Automatic namespace binding via lexical scope analysis" },
              { title: "Rich Type System", desc: "Full TypeScript types exported from @better-i18n/core" },
              { title: "i18n.config.ts", desc: "Single workspace configuration file for all settings" },
              { title: "Debug Logging", desc: "Verbose output for troubleshooting integration issues" },
              { title: "Perf Monitoring", desc: "Execution time and cache hit rate reporting" },
              { title: "Custom Fetch", desc: "Bring your own HTTP client for translation loading" },
              { title: "Error Handlers", desc: "Custom callbacks for missing translation keys" },
              { title: "Locale Callbacks", desc: "Event hooks for locale switching and changes" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-mist-200 bg-white p-5">
                <h3 className="text-sm font-medium text-mist-950">{item.title}</h3>
                <p className="mt-1 text-sm text-mist-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="w-10 h-10 rounded-lg bg-mist-100 flex items-center justify-center mb-4">
            <IconShieldCheck className="w-5 h-5 text-mist-600" />
          </div>
          <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-4">
            {t("i18n.forDevelopers.infra.title", { defaultValue: "Infrastructure" })}
          </h2>
          <p className="text-mist-700 mb-8 max-w-2xl">
            {t("i18n.forDevelopers.infra.description", { defaultValue: "Production-grade infrastructure with built-in security, redundancy, and multi-datacenter support." })}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-xl bg-white border border-mist-200">
              <h3 className="text-sm font-medium text-mist-950 mb-1">Cloudflare Workers</h3>
              <p className="text-sm text-mist-600">Edge computing with built-in DDoS protection and global distribution</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-mist-200">
              <h3 className="text-sm font-medium text-mist-950 mb-1">Cloudflare R2 Storage</h3>
              <p className="text-sm text-mist-600">Object storage for translation files with zero egress fees</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-mist-200">
              <h3 className="text-sm font-medium text-mist-950 mb-1">PlanetScale Database</h3>
              <p className="text-sm text-mist-600">Serverless MySQL with automatic backups and branching</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-mist-200">
              <h3 className="text-sm font-medium text-mist-950 mb-1">Multi-Datacenter</h3>
              <p className="text-sm text-mist-600">Redundant deployment across regions for high availability</p>
            </div>
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
