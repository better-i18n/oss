import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { GuideMark } from "@/lib/i18n-guide-icons";
import { MarketingLayout } from "@/components/MarketingLayout";
import { CodeBlock } from "@/components/CodeBlock";
import { BackToHub } from "@/components/BackToHub";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";
import { i18nGuideRoute } from "@/lib/i18n-guide-routes";
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
    icon: "code-brackets",
    title: "Type-Safe SDKs",
    description: "Full TypeScript support with autocomplete for translation keys",
  },
  {
    icon: "github",
    title: "Git-First Workflow",
    description: "Automatic key discovery from your codebase via AST parsing",
  },
  {
    icon: "robot",
    title: "MCP Integration",
    description: "Manage translations directly from Claude or Cursor",
  },
  {
    icon: "script",
    title: "CLI Tools",
    description: "Scan codebase, sync translations, and validate keys from terminal",
  },
  {
    icon: "globe",
    title: "Edge CDN",
    description: "Sub-50ms translation delivery from Cloudflare's global network",
  },
  {
    icon: "zap",
    title: "Hot Reload",
    description: "See translation changes instantly during development",
  },
];

function ForDevelopersSeoPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      {/* Hero */}
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow mb-5 flex items-center gap-2">
              <span>{t("i18n.forDevelopers.badge")}</span>
            </div>
            <h1 className="section-h2">
              {t("i18n.forDevelopers.hero.title")}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("i18n.forDevelopers.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="section">
          {/* The grid used to sit directly under the h1 with no heading of its
              own — an h1 → h3 jump, and a section that opened with a card grid
              instead of a SectionHeader. */}
          <p className="eyebrow">{t("i18n.forDevelopers.features.eyebrow")}</p>
          <h2 className="section-h2">{t("i18n.forDevelopers.features.title")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Bare columns + the shared 22px mark tile; the old version was a
                bordered card wrapping a tinted icon tile — a box in a box. */}
            {features.map((feature) => (
              <div key={feature.title}>
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  <SpriteIcon name={feature.icon as SpriteIconName} className="size-3.5" />
                </span>
                <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-mist-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <h2 className="section-h2 mb-4">
            {t("i18n.forDevelopers.codeExample.title")}
          </h2>
          <p className="text-mist-600 mb-6">{t("i18n.forDevelopers.codeExample.description")}</p>
          {/* Was a `bg-mist-950` slab with `text-mist-100` on top: the only
              dark surface in this section, and no syntax colour at all.
              `CodeBlock` tokenises at build time, so the three hues cost no
              runtime JavaScript (rule/code-blocks-are-tokenised-at-build). */}
          <CodeBlock
            lang="bash"
            filename="terminal"
            code={`# Install the SDK
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
}`}
          />
        </div>
      </section>

      {/* CDN Performance */}
      <section>
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="section-h2 mb-4">
                {t("i18n.forDevelopers.cdn.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.forDevelopers.cdn.description")}
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
                <div key={item.label} className="flex items-start gap-3 border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0">
                  <SpriteIcon name="zap" className="w-4 h-4 text-mist-600 mt-0.5 shrink-0" />
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
      <section className="bg-mist-50">
        <div className="section">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                <SpriteIcon name="api-connection" className="w-5 h-5 text-mist-600" />
              </div>
              <h2 className="section-h2 mb-4">
                {t("i18n.forDevelopers.api.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18n.forDevelopers.api.description")}
              </p>
              <CodeBlock
                lang="tsx"
                filename="rest-api"
                code={`// REST API methods
listProjects()
getProject(id)
addLanguage(projectId, locale)
listKeys(projectId)
createKeys(projectId, keys[])
updateKeys(projectId, keys[])
deleteKeys(projectId, keyIds[])`}
              />
            </div>
            <div className="mt-8 lg:mt-0 space-y-4">
              <div >
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.webhooks.title")}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.webhooks.description")}</p>
              </div>
              <div >
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.batch.title")}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.batch.description")}</p>
              </div>
              <div >
                <h3 className="text-sm font-medium text-mist-950 mb-1">{t("i18n.forDevelopers.api.sync.title")}</h3>
                <p className="text-sm text-mist-600">{t("i18n.forDevelopers.api.sync.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Experience */}
      <section>
        <div className="section">
          <h2 className="section-h2 mb-4">
            {t("i18n.forDevelopers.dx.title")}
          </h2>
          <p className="text-mist-700 mb-8 max-w-2xl">
            {t("i18n.forDevelopers.dx.description")}
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
              <div key={item.title}>
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-mist-50">
        <div className="section">
          <div className="mb-3 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
            <SpriteIcon name="shield-check" className="w-5 h-5 text-mist-600" />
          </div>
          <h2 className="section-h2 mb-4">
            {t("i18n.forDevelopers.infra.title")}
          </h2>
          <p className="text-mist-700 mb-8 max-w-2xl">
            {t("i18n.forDevelopers.infra.description")}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div >
              <h3 className="text-sm font-medium text-mist-950 mb-1">Cloudflare Workers</h3>
              <p className="text-sm text-mist-600">Edge computing with built-in DDoS protection and global distribution</p>
            </div>
            <div >
              <h3 className="text-sm font-medium text-mist-950 mb-1">Cloudflare R2 Storage</h3>
              <p className="text-sm text-mist-600">Object storage for translation files with zero egress fees</p>
            </div>
            <div >
              <h3 className="text-sm font-medium text-mist-950 mb-1">PlanetScale Database</h3>
              <p className="text-sm text-mist-600">Serverless MySQL with automatic backups and branching</p>
            </div>
            <div >
              <h3 className="text-sm font-medium text-mist-950 mb-1">Multi-Datacenter</h3>
              <p className="text-sm text-mist-600">Redundant deployment across regions for high availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Links */}
      <section>
        <div className="section">
          <h2 className="section-h2 mb-8">
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
              // A framework named in a list carries its real mark, and the row
              // itself carries no box (motto 2 + 5).
              <Link
                key={fw.slug}
                to={i18nGuideRoute(fw.slug)}
                params={{ locale }}
                className="group flex items-center gap-2.5"
              >
                <GuideMark slug={fw.slug} group="frameworks" />
                <span className="text-[14px] font-medium tracking-[-0.015em] text-mist-900 transition-colors group-hover:text-mist-600">
                  {fw.name}
                </span>
                <SpriteIcon
                  name="arrow-right"
                  className="size-3.5 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Divider />

      {/* The ask closes the page. Was a `bg-mist-950` band with `rounded-xl
          mx-6` — a floating dark card on a white document, with its own
          container and its own button scale. <ClosingCta /> is the one closing
          shape in the grammar. */}
      <ClosingCta
        title={t("i18n.forDevelopers.cta.title")}
        subtitle={t("i18n.forDevelopers.cta.subtitle")}
        primary={{ label: t("i18n.forDevelopers.cta.primary"), href: "https://dash.better-i18n.com" }}
        secondary={{ label: t("i18n.forDevelopers.cta.secondary"), href: "https://docs.better-i18n.com" }}
      />
    </MarketingLayout>
  );
}
