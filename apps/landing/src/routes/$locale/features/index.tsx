import type { ReactElement } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { createServerFn } from "@tanstack/react-start";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead } from "@/lib/page-seo";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import { useT } from "@/lib/i18n";
import { getMarketingPages, type MarketingPageListItem } from "@/lib/content";
import {
  ClosingCta,
  Divider,
  FeatureColumn,
  FeatureRow,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

const loadFeaturePages = createServerFn({ method: "GET" })
  .inputValidator((data: { locale: string }) => data)
  .handler(async ({ data }) => {
    return getMarketingPages(data.locale, "feature");
  });

export const Route = createFileRoute("/$locale/features/")({
  loader: async ({ params, context }) => {
    const [allMessages, featurePages] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      loadFeaturePages({ data: { locale: params.locale } }),
    ]);
    // Only serialize meta + breadcrumbs for head() — components use root loader's provider
    const { filterMessages } = await import("@/lib/page-namespaces");
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs"]);
    return {
      messages,
      locale: context.locale,
      featurePages,
    };
  },
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "features",
      pathname: "/features",
      pageType: "default",
    });
  },
  component: FeaturesPage,
});

function FeaturesPage() {
  const t = useT("featuresPage");
  const { locale } = Route.useParams();
  const { featurePages } = Route.useLoaderData();
  const overviewCards = [
    {
      icon: "zap",
      title: t("overview.ai.title"),
      description: t("overview.ai.description"),
    },
    {
      icon: "settings-gear",
      title: t("overview.workflow.title"),
      description: t("overview.workflow.description"),
    },
    {
      icon: "globe",
      title: t("overview.delivery.title"),
      description: t("overview.delivery.description"),
    },
  ];

  const coreCapabilities = [
    {
      icon: "zap",
      step: "01",
      badge: t("core.ai.badge"),
      title: t("core.ai.title"),
      description: t("core.ai.description"),
      supportingPoints: [
        t("core.ai.support.brand"),
        t("core.ai.support.review"),
        t("core.ai.support.scale"),
      ],
      items: [
        {
          title: t("core.ai.glossary.title"),
          description: t("core.ai.glossary.description"),
        },
        {
          title: t("core.ai.review.title"),
          description: t("core.ai.review.description"),
        },
        {
          title: t("core.ai.context.title"),
          description: t("core.ai.context.description"),
        },
        {
          title: t("core.ai.batch.title"),
          description: t("core.ai.batch.description"),
        },
      ],
    },
    {
      icon: "settings-gear",
      step: "02",
      badge: t("core.workflow.badge"),
      title: t("core.workflow.title"),
      description: t("core.workflow.description"),
      supportingPoints: [
        t("core.workflow.support.git"),
        t("core.workflow.support.release"),
        t("core.workflow.support.team"),
      ],
      items: [
        {
          title: t("core.workflow.git.title"),
          description: t("core.workflow.git.description"),
        },
        {
          title: t("core.workflow.cdn.title"),
          description: t("core.workflow.cdn.description"),
        },
        {
          title: t("core.workflow.cli.title"),
          description: t("core.workflow.cli.description"),
        },
        {
          title: t("core.workflow.ota.title"),
          description: t("core.workflow.ota.description"),
        },
      ],
    },
    {
      icon: "globe",
      step: "03",
      badge: t("core.discovery.badge"),
      title: t("core.discovery.title"),
      description: t("core.discovery.description"),
      supportingPoints: [
        t("core.discovery.support.coverage"),
        t("core.discovery.support.context"),
        t("core.discovery.support.cleanup"),
      ],
      items: [
        {
          title: t("core.discovery.ast.title"),
          description: t("core.discovery.ast.description"),
        },
        {
          title: t("core.discovery.crawler.title"),
          description: t("core.discovery.crawler.description"),
        },
        {
          title: t("core.discovery.unused.title"),
          description: t("core.discovery.unused.description"),
        },
        {
          title: t("core.discovery.coverage.title"),
          description: t("core.discovery.coverage.description"),
        },
      ],
    },
  ];

  // Each core capability gets its own purpose-built visual, keyed by step.
  // This is the pillar-page budget from DESIGN-DECISIONS.md
  // (rule/pillar-pages-get-bespoke-visuals): the page earns bespoke diagrams
  // rather than repeating one generic card archetype three times.
  const CAPABILITY_VISUALS: Record<string, () => ReactElement> = {
    "01": GlossaryVisual,
    "02": GitFlowVisual,
    "03": ScanVisual,
  };

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="ai"
        pillarLabel={t("hero.badge")}
        titleId="features-hero-title"
        title={
          <>
            {t("hero.title")}{" "}
            <span className="text-mist-400">
              {t("hero.titleHighlight")}
            </span>
          </>
        }
        subtitle={t("hero.subtitle")}
        primary={{
          label: t("hero.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("hero.ctaSecondary"),
          href: "https://docs.better-i18n.com/",
        }}
        visual={<PipelineVisual t={t} />}
      />

      <Divider />

      {/* Platform pillars — three hairline columns, not three floating cards. */}
      <Section labelledBy="features-pillars">
        <SectionHeader
          id="features-pillars"
          eyebrow={t("core.badge")}
          title={t("core.title")}
          subtitle={t("core.subtitle")}
        />
        <div className="mt-8">
          <FeatureRow>
            {overviewCards.map((card) => (
              <FeatureColumn
                key={card.title}
                icon={<SpriteIcon name={card.icon as SpriteIconName} className="size-3" />}
                title={card.title}
                description={card.description}
              />
            ))}
          </FeatureRow>
        </div>
      </Section>

      {/* One section per capability: header + bespoke visual + supporting points
          + the capability's own sub-features as a hairline grid. */}
      {coreCapabilities.map((capability) => {
        const Visual = CAPABILITY_VISUALS[capability.step];
        return (
          <div key={capability.title}>
            <Divider />
            <Section>
              <SectionHeader
                eyebrow={`${capability.step} · ${capability.badge}`}
                title={capability.title}
                subtitle={capability.description}
              />

              <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <ul className="flex flex-col">
                  {capability.supportingPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 border-t border-black/[0.05] py-3 text-[13px] leading-relaxed text-mist-700 first:border-t-0 first:pt-0"
                    >
                      <SpriteIcon
                        name="checkmark"
                        className="mt-0.5 size-3.5 shrink-0 text-mist-400"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {Visual ? <Visual /> : null}
              </div>

              <div className="mt-10 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
                <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2">
                  {capability.items.map((item) => (
                    <FeatureItem
                      key={item.title}
                      title={item.title}
                      description={item.description}
                    />
                  ))}
                </div>
              </div>
            </Section>
          </div>
        );
      })}

      <Divider />

      {/* Operational depth — a hairline grid; these are a checklist, not six
          competing cards. */}
      <Section>
        <SectionHeader
          eyebrow={t("additionalFeatures.badge")}
          title={t("additionalFeatures.title")}
          subtitle={t("additionalFeatures.description")}
        />
        <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
          <ul role="list" className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <FeatureItem
                title={t("additionalFeatures.glossary.title")}
                description={t("additionalFeatures.glossary.description")}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.memory.title")}
                description={t("additionalFeatures.memory.description")}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.collaboration.title")}
                description={t("additionalFeatures.collaboration.description")}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.versionControl.title")}
                description={t("additionalFeatures.versionControl.description")}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.qa.title")}
                description={t("additionalFeatures.qa.description")}
              />
            </li>
            <li>
              <FeatureItem
                title={t("additionalFeatures.analytics.title")}
                description={t("additionalFeatures.analytics.description")}
              />
            </li>
          </ul>
        </div>
      </Section>

      {/* CMS Feature Pages */}
      {featurePages.length > 0 && (
        <>
          <Divider />
          <FeaturePagesGrid featurePages={featurePages} locale={locale} />
        </>
      )}

      <Divider />

      {/* The page's single closing ask — replaces the shared CTA band so the
          hero/closing pair belongs to this page (showCTA={false} above).
          The ask comes BEFORE the related links: a menu between the argument
          and the ask interrupts it, and a reader who is not converting is the
          only one who needs wayfinding. */}
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
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />

      <Divider />

      {/* Related Pages */}
      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

function FeaturePagesGrid({
  featurePages,
  locale,
}: {
  featurePages: MarketingPageListItem[];
  locale: string;
}) {
  const t = useT("featuresPage");

  return (
    <Section>
      <div>
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="max-w-2xl">
            <p className="eyebrow">{t("deepDive.badge")}</p>
            <h2 className="section-h2">
              {t("deepDive.title")}
            </h2>
            <p className="section-p mt-3 max-w-xl">
              {t("deepDive.description")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
           <div className="-mt-px -ml-px grid sm:grid-cols-3">
            <div className="border-t border-l border-black/[0.05] p-4">
              <div className="text-[28px] font-medium leading-none tracking-[-0.03em] text-mist-900 tabular-nums">
                {featurePages.length}
              </div>
              <p className="mt-2 text-[11px] text-mist-400">
                {t("deepDive.stats.guides")}
              </p>
            </div>
            <div className="border-t border-l border-black/[0.05] p-4">
              <h3 className="text-[13px] font-medium text-mist-900">
                {t("deepDive.statExamples.title")}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-mist-500">
                {t("deepDive.statExamples.description")}
              </p>
            </div>
            <div className="border-t border-l border-black/[0.05] p-4">
              <h3 className="text-[13px] font-medium text-mist-900">
                {t("deepDive.statDocs.title")}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-mist-500">
                {t("deepDive.statDocs.description")}
              </p>
            </div>
           </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
         <div className="-mt-px -ml-px grid grid-cols-1 lg:grid-cols-2">
          {featurePages.map((feature, index) => (
            <Link
              key={feature.slug}
              to="/$locale/features/$slug/"
              params={{ locale, slug: feature.slug }}
              className="group flex flex-col justify-between gap-6 border-t border-l border-black/[0.05] p-5 transition-colors hover:bg-black/[0.02]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-[11px] font-medium text-mist-400">
                  <span className="tabular-nums">{formatFeatureIndex(index + 1)}</span>
                  <span className="h-px w-4 bg-black/[0.1]" />
                  <span>{t("deepDive.cardLabel")}</span>
                </div>
                <SpriteIcon
                  name="arrow-right"
                  className="size-4 shrink-0 text-mist-300 transition-all group-hover:translate-x-0.5 group-hover:text-mist-600"
                />
              </div>

              <div className="max-w-xl">
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
                  {feature.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-mist-600">
                  {feature.heroSubtitle ||
                    feature.excerpt ||
                    t("deepDive.cardFallback")}
                </p>
              </div>

              <span className="learn-more w-fit">
                {t("deepDive.readCta")}
                <SpriteIcon name="arrow-right" className="size-3.5" />
              </span>
            </Link>
          ))}
         </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * A single sub-feature. Lives as a cell inside a hairline container: it draws
 * its own top + left rule and the parent grid is shifted -1px, so the outer
 * border absorbs the first row/column rules at every breakpoint.
 */
function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-l border-black/[0.05] px-5 py-4">
      <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{description}</p>
    </div>
  );
}

/* ─── Bespoke visuals ──────────────────────────────────────────────
   Purpose-drawn for this page, in DOM + SVG rather than a screenshot: they stay
   crisp at any DPR, they localise through the same t() calls as the prose, and
   they cost a few KB instead of a 2x asset that goes stale. */

/** Hero: one source string fanning out to locales and onto the edge. */
function PipelineVisual({ t }: { t: (key: string) => string }) {
  const LOCALES = [
    { code: "tr", label: "Türkçe", value: "Merhaba dünya" },
    { code: "de", label: "Deutsch", value: "Hallo Welt" },
    { code: "ja", label: "日本語", value: "こんにちは世界" },
    { code: "es", label: "Español", value: "Hola mundo" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Source */}
        <div className="border-black/[0.05] p-5 max-lg:border-b lg:border-r">
          <p className="text-[11px] font-medium text-mist-400">
            {t("visual.source")}
          </p>
          <div className="mt-3 rounded-lg border border-black/[0.06] bg-mist-50 p-3 font-mono text-[12px] leading-relaxed">
            <span className="text-mist-400">hero.</span>
            <span className="text-mist-900">title</span>
            <span className="text-mist-300"> = </span>
            <span className="text-mist-700">&quot;Hello world&quot;</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[
              t("visual.chip.glossary"),
              t("visual.chip.tone"),
              t("visual.chip.screen"),
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-sm border border-black/[0.06] bg-white px-2 py-0.5 text-[11px] text-mist-500"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-mist-400">
            <span className="size-1.5 rounded-full bg-violet-500" />
            {t("visual.engine")}
          </div>
        </div>

        {/* Targets */}
        <div className="divide-y divide-black/[0.05]">
          {LOCALES.map((l) => (
            <div key={l.code} className="flex items-center gap-3 px-5 py-3">
              <span className="w-16 shrink-0 text-[11px] font-medium text-mist-400">
                {l.label}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-mist-800">
                {l.value}
              </span>
              <span className="shrink-0 text-[11px] text-emerald-600">
                {t("visual.published")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 01 — glossary enforcement: literal output vs glossary-aware output. */
function GlossaryVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">billing.seats_left</span>
        <span className="text-[11px] text-mist-400">de-DE</span>
      </div>
      <div className="divide-y divide-black/[0.05]">
        <div className="px-4 py-3">
          <p className="text-[11px] font-medium text-mist-400">Literal</p>
          <p className="mt-1 text-[13px] text-mist-500 line-through decoration-mist-300">
            2 Sitze übrig
          </p>
        </div>
        <div className="bg-black/[0.015] px-4 py-3">
          <p className="text-[11px] font-medium text-mist-400">
            Glossary + context
          </p>
          <p className="mt-1 text-[13px] text-mist-900">2 Lizenzen verfügbar</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["seat → Lizenz", "formal Sie", "plural: other"].map((rule) => (
              <span
                key={rule}
                className="rounded-sm border border-black/[0.06] bg-white px-2 py-0.5 font-mono text-[10px] text-mist-500"
              >
                {rule}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 02 — git-native flow: commit → PR → CI → edge. */
function GitFlowVisual() {
  const STEPS = [
    { label: "feat/checkout", meta: "12 keys changed", tone: "mist" },
    { label: "PR #482 · i18n sync", meta: "review in code", tone: "mist" },
    { label: "CI · quality checks", meta: "placeholders, plurals", tone: "mist" },
    { label: "CDN · 300+ edges", meta: "live in ~60s", tone: "emerald" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white p-5">
      <ol className="relative flex flex-col gap-4 pl-6">
        {/* the branch line */}
        <span
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 left-[5px] w-px bg-black/[0.08]"
        />
        {STEPS.map((s) => (
          <li key={s.label} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-1 -left-6 size-[11px] rounded-full border-2 border-white ${ s.tone === "emerald" ? "bg-emerald-500" : "bg-mist-300" }`}
            />
            <p className="font-mono text-[12px] text-mist-900">{s.label}</p>
            <p className="text-[11px] text-mist-400">{s.meta}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 03 — the crawler's read of a repo: detected, missing, unused. */
function ScanVisual() {
  const ROWS = [
    { path: "src/routes/checkout.tsx", found: 14, state: "ok" },
    { path: "src/components/Cart.tsx", found: 9, state: "missing" },
    { path: "src/lib/errors.ts", found: 6, state: "ok" },
    { path: "locales/en/legacy.json", found: 23, state: "unused" },
  ];
  const STATE = {
    ok: { label: "translated", cls: "text-emerald-600" },
    missing: { label: "3 missing", cls: "text-mist-900" },
    unused: { label: "unused", cls: "text-mist-400" },
  } as const;

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">better-i18n scan</span>
        <span className="ml-auto text-[11px] text-mist-400">52 keys · 4 files</span>
      </div>
      <div className="divide-y divide-black/[0.05]">
        {ROWS.map((r) => {
          const s = STATE[r.state as keyof typeof STATE];
          return (
            <div key={r.path} className="flex items-center gap-3 px-4 py-2.5">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-mist-700">
                {r.path}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-mist-400">
                {r.found}
              </span>
              <span className={`w-20 shrink-0 text-right text-[11px] ${s.cls}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* coverage bar */}
      <div className="flex items-center gap-3 border-t border-black/[0.05] px-4 py-3">
        <span className="text-[11px] text-mist-400">coverage</span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
          <span className="block h-full w-[88%] rounded-full bg-mist-900" />
        </span>
        <span className="text-[11px] tabular-nums text-mist-600">88%</span>
      </div>
    </div>
  );
}

function formatFeatureIndex(index: number) {
  return String(index).padStart(2, "0");
}
