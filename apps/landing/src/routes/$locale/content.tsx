import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { HighlightedCode } from "@/components/CodeBlock";
import {
  ClosingCta,
  Divider,
  FeatureColumn,
  FeatureRow,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

export const Route = createFileRoute("/$locale/content")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "content",
      pathname: "/content",
      pageType: "default",
      structuredDataOptions: {
        title: "Better Content — headless CMS with localization built in",
        description:
          "Model content once, query it with a chainable SDK, and serve every locale from the edge. Better Content is the headless CMS for teams that ship multilingual products.",
      },
    }),
  component: ContentPage,
});

/* ─── Page ───────────────────────────────────────────────────────── */

function ContentPage() {
  const t = useT("contentPage");
  const { locale } = Route.useParams();

  const frameworks = [
    { key: "nextjs", name: "Next.js", adapter: "@better-i18n/content/adapters/nextjs" },
    { key: "react", name: "React", adapter: "@better-i18n/content/adapters/react" },
    { key: "expo", name: "Expo", adapter: "@better-i18n/content/adapters/expo" },
    { key: "vue", name: "Vue", adapter: "@better-i18n/content/adapters/vue" },
    { key: "svelte", name: "Svelte", adapter: "@better-i18n/content/adapters/svelte" },
    { key: "vanilla", name: "Vanilla JS", adapter: "@better-i18n/content" },
  ];

  const capabilities = [
    {
      title: t("capabilities.models.title"),
      description: t("capabilities.models.description"),
    },
    {
      title: t("capabilities.localized.title"),
      description: t("capabilities.localized.description"),
    },
    {
      title: t("capabilities.relations.title"),
      description: t("capabilities.relations.description"),
    },
    {
      title: t("capabilities.publish.title"),
      description: t("capabilities.publish.description"),
    },
    {
      title: t("capabilities.mcp.title"),
      description: t("capabilities.mcp.description"),
    },
    {
      title: t("capabilities.edge.title"),
      description: t("capabilities.edge.description"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="sync"
        pillarLabel={t("hero.badge")}
        titleId="content-hero-title"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primary={{
          label: t("hero.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("hero.ctaSecondary"),
          href: "https://docs.better-i18n.com/content",
        }}
        visual={<ModelVisual t={t} />}
      />

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("query.eyebrow")}
          title={t("query.title")}
          subtitle={t("query.subtitle")}
        />
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ul className="flex flex-col">
            {[
              t("query.point.one"),
              t("query.point.two"),
              t("query.point.three"),
            ].map((point) => (
              <li
                key={point}
                className="border-t border-black/[0.05] py-3 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
              >
                {point}
              </li>
            ))}
          </ul>
          <QueryVisual />
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("capabilities.eyebrow")}
          title={t("capabilities.title")}
          subtitle={t("capabilities.subtitle")}
        />
        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("frameworks.eyebrow")}
          title={t("frameworks.title")}
          subtitle={t("frameworks.subtitle")}
        />
        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {frameworks.map((f) => (
              <div
                key={f.key}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <p className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {f.name}
                </p>
                <p className="mt-1.5 truncate font-mono text-[11px] text-mist-400">
                  {f.adapter}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("pair.eyebrow")}
          title={t("pair.title")}
          subtitle={t("pair.subtitle")}
        />
        <div className="mt-8">
          <FeatureRow>
            <FeatureColumn
              label={t("pair.i18n.label")}
              title={t("pair.i18n.title")}
              description={t("pair.i18n.description")}
            />
            <FeatureColumn
              label={t("pair.content.label")}
              title={t("pair.content.title")}
              description={t("pair.content.description")}
            />
            <FeatureColumn
              label={t("pair.analytics.label")}
              title={t("pair.analytics.title")}
              description={t("pair.analytics.description")}
            />
          </FeatureRow>
        </div>
      </Section>

      <Divider />

      <RelatedPages currentPage="features" locale={locale} variant="content" />

      <Divider />

      <ClosingCta
        eyebrow={t("closing.eyebrow")}
        title={t("closing.title")}
        subtitle={t("closing.subtitle")}
        primary={{
          label: t("closing.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("closing.ctaSecondary"),
          href: "https://docs.better-i18n.com/content",
        }}
      />
    </MarketingLayout>
  );
}

/* ─── Bespoke visuals ────────────────────────────────────────────── */

/** Hero: a model's schema on the left, the same entry in three languages on the right. */
function ModelVisual({ t }: { t: (key: string) => string }) {
  const FIELDS = [
    { name: "title", type: "text", localized: true },
    { name: "body", type: "richtext", localized: true },
    { name: "localized_slug", type: "text", localized: true },
    { name: "author", type: "relation → authors", localized: false },
    { name: "publishedAt", type: "datetime", localized: false },
  ];
  const ENTRIES = [
    { lang: "English", value: "Shipping i18n without a TMS", status: "published" },
    { lang: "Türkçe", value: "TMS olmadan i18n yayınlamak", status: "published" },
    { lang: "Deutsch", value: "i18n ausliefern ohne TMS", status: "draft" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-black/[0.05] p-5 max-lg:border-b lg:border-r">
          <p className="text-[11px] font-medium text-mist-400">
            {t("visual.model")}
          </p>
          <div className="mt-3 flex flex-col">
            {FIELDS.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 border-t border-black/[0.05] py-2 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-[12px] text-mist-900">{f.name}</span>
                <span className="truncate font-mono text-[11px] text-mist-400">{f.type}</span>
                {f.localized && (
                  <span className="ml-auto shrink-0 rounded-sm border border-black/[0.06] bg-mist-50 px-1.5 py-0.5 text-[10px] text-mist-500">
                    {t("visual.localized")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-black/[0.05]">
          <p className="px-5 py-2.5 text-[11px] font-medium text-mist-400">
            {t("visual.entry")}
          </p>
          {ENTRIES.map((e) => (
            <div key={e.lang} className="flex items-center gap-3 px-5 py-3">
              <span className="w-16 shrink-0 text-[11px] font-medium text-mist-400">
                {e.lang}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-mist-800">
                {e.value}
              </span>
              <span
                className={`shrink-0 text-[11px] ${ e.status === "published" ? "text-emerald-600" : "text-mist-400" }`}
              >
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 01 — the chainable read, and what comes back. */
function QueryVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">app/blog/page.tsx</span>
      </div>
      <HighlightedCode
        lang="ts"
        code={`const { data } = await client
  .from("blog-posts")
  .language("tr")
  .expand(["author", "category"])
  .eq("status", "published")
  .order("publishedAt", "desc")
  .limit(10)`}
      />
      <div className="border-t border-black/[0.05] bg-black/[0.015] px-4 py-3">
        <p className="text-[11px] font-medium text-mist-400">200 OK · 41ms · edge cache HIT</p>
        <p className="mt-1.5 font-mono text-[12px] text-mist-700">
          10 entries · tr · author + category expanded
        </p>
      </div>
    </div>
  );
}
