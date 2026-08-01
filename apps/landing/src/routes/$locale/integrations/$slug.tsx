import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RelatedPages } from "@/components/RelatedPages";
import { MarketingLayout } from "@/components/MarketingLayout";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CodeBlock } from "@/components/CodeBlock";
import {
  ClosingCta,
  Divider,
  FaqSection,
  PageHero,
  Section,
  SectionHeader,
  type Pillar,
} from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { getIntegration } from "@/lib/content";
import {
  integrationMetaLabels,
  toIntegrationItem,
  type IntegrationItem,
} from "@/lib/integrations-catalog";
import { getIntegrationFacts, type IntegrationFacts } from "@/lib/integration-facts";
import { useT } from "@/lib/i18n";

const BRANDFETCH_CLIENT_ID = import.meta.env.VITE_BRANDFETCH_CLIENT_ID;

const baseLoader = createPageLoader();

/**
 * Category → pillar hue. The badge above the h1 is the one place colour is
 * allowed to appear on this page, and it encodes which part of the product the
 * integration belongs to (rule/neutral-ink-accent-is-identity-only).
 */
const CATEGORY_PILLAR: Record<string, Pillar> = {
  featured: "sync",
  frameworks: "sync",
  developerTools: "mcp",
  delivery: "content",
  aiAutomation: "ai",
};

export const Route = createFileRoute("/$locale/integrations/$slug")({
  loader: async (args: Parameters<typeof baseLoader>[0] & { params: { slug?: string } }) => {
    const slug = (args.params as { slug: string }).slug ?? "";
    const [base, cmsItem] = await Promise.all([
      baseLoader(args),
      getIntegration(args.context.locale, slug),
    ]);
    // Return raw CmsItem (no ComponentType) — icon resolved in component
    return { ...base, cmsItem };
  },
  head: ({ loaderData, params }) => {
    const cmsItem = loaderData?.cmsItem;

    return getPageHead({
      messages: loaderData?.messages || {},
      locale: params?.locale || "en",
      /* Not "integrations": that key holds the directory's own meta, and every
         one of the twenty detail pages was inheriting it, so the whole set
         shipped with one identical <title>. `integrationDetail` has no meta
         entry, which makes getPageHead fall through to `metaFallback` — built
         below from the CMS fields, which are per-integration AND localized. */
      /* …unless the CMS has no copy for this locale at all: /de/ has no German
         entry for most integrations, and an empty description is worse than the
         directory's, which IS translated. Measured: /de/integrations/nextjs/
         shipped description length 0 before this fallback. */
      pageKey: cmsItem?.summary ? "integrationDetail" : "integrations",
      metaFallback: buildDetailMeta(cmsItem),
      pathname: `/integrations/${cmsItem?.slug || ""}`,
      pageType: "educational",
      structuredDataOptions: {
        title: `${cmsItem?.name || "Integration"} integration`,
        description: cmsItem
          ? `Explore how ${cmsItem.name} fits into Better I18N workflows for developer-led localization.`
          : "Explore Better I18N integrations.",
      },
    });
  },
  component: IntegrationDetailPage,
  notFoundComponent: IntegrationNotFound,
});

/**
 * Per-page title and description, built from the CMS fields.
 *
 * Not from new i18n keys on purpose: `name`, `summary` and `detail` are already
 * per-integration AND per-locale in the CMS, so this stays correct on /tr/ and
 * /de/ without twenty more key pairs to translate. The description is whatever
 * the CMS says, clamped at a word boundary — padding it to hit a character
 * target would mean writing English into a Turkish page.
 */
function buildDetailMeta(
  cmsItem: { name: string; summary: string; detail: string | null } | null | undefined,
) {
  const name = cmsItem?.name ?? "Integration";
  const summary = cmsItem?.summary ?? "";
  const detail = cmsItem?.detail ?? "";
  const full = [summary, detail].filter(Boolean).join(" ");
  const description = full.length > 160 ? `${full.slice(0, 157).replace(/\s+\S*$/, "")}…` : full;

  return {
    title: `${name} integration — Better I18N`,
    description,
  };
}

function IntegrationDetailPage() {
  const t = useT("integrationsPage");
  const { locale } = Route.useParams();
  const { cmsItem } = Route.useLoaderData();
  const integration: IntegrationItem | null = cmsItem ? toIntegrationItem(cmsItem) : null;

  if (!integration) {
    return <IntegrationNotFound />;
  }

  const facts = getIntegrationFacts(integration.slug);
  const meta = integrationMetaLabels(integration, t);
  const pillar = CATEGORY_PILLAR[integration.category] ?? "sync";
  const fitPoints = getFitPoints(integration.slug, t);
  const installHref = getDashboardInstallHref({ locale, slug: integration.slug });

  return (
    <MarketingLayout
      showCTA={false}
      breadcrumbs={[
        { label: t("hero.eyebrow"), href: `/${locale}/integrations/` },
        { label: integration.name },
      ]}
    >
      {/* The hero used to be a two-column band whose left side ran out of copy
          320px before the sticky panel ended, leaving a white gap under the
          summary. It is now the shared PageHero with its `visual` slot filled by
          the thing this page is actually about: the snippet you paste. */}
      <PageHero
        pillar={pillar}
        /* Category, then whatever the other two fields still add after the
           duplicate is dropped: "Featured · Built-in" on the built-ins,
           "Frameworks · SDK · Guide" where the badge really differs. The status
           used to live in the hero and would otherwise have been lost when the
           right column became a code panel. */
        pillarLabel={[meta.category, meta.badge, meta.status].filter(Boolean).join(" · ")}
        titleId="integration-hero-title"
        title={integration.name}
        subtitle={integration.summary}
        primary={{ label: t("detail.nextStep.install"), href: installHref }}
        secondary={
          integration.guideHref
            ? { label: t("detail.nextStep.readGuide"), href: integration.guideHref }
            : undefined
        }
        visual={<HeroVisual integration={integration} facts={facts} t={t} />}
      />

      <Divider />

      {/* "How does this work" is the converging diagram everywhere on the site
          (rule/how-it-works-is-a-converging-flow) — the integration is one card
          in it, not a diagram of its own. */}
      <Section>
        <SectionHeader
          eyebrow={t("detail.flow.eyebrow")}
          title={t("detail.workflowFit.title", { name: integration.name })}
        />
        <IntegrationFlow integration={integration} pillar={pillar} t={t} />
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("detail.setup.eyebrow")}
          title={t("detail.setup.title", { name: integration.name })}
          subtitle={t("detail.setup.subtitle")}
        />
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ol className="flex flex-col">
            {(["install", "connect", "ship"] as const).map((step, index) => (
              <li
                key={step}
                className="flex items-baseline gap-3 border-t border-black/[0.05] py-4 first:border-t-0 first:pt-0"
              >
                <span className="w-4 shrink-0 text-[10px] tabular-nums text-mist-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(`detail.setup.steps.${step}.title`)}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-relaxed text-mist-600">
                    {t(`detail.setup.steps.${step}.body`)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          {facts?.usage ? (
            <div>
              <p className="mb-3 text-[11px] font-medium text-mist-400">
                {t("detail.setup.usageLabel")}
              </p>
              <CodeBlock
                lang={facts.usage.lang}
                filename={facts.usage.filename}
                code={facts.usage.code}
              />
            </div>
          ) : null}
        </div>
      </Section>

      {facts?.capabilities ? (
        <>
          <Divider />
          <Section>
            <SectionHeader
              eyebrow={t("detail.capabilities.eyebrow")}
              title={t("detail.capabilities.title", { name: integration.name })}
              subtitle={t("detail.capabilities.subtitle")}
            />
            {/* A table is the one listed thing that keeps its cells
                (rule/listed-items-are-not-cards names it as the exception): the
                left column is what you type, the right is what it does, and the
                pairing is the information. */}
            <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
              {facts.capabilities.map((row) => (
                <div
                  key={row.mono}
                  className="grid gap-2 border-t border-black/[0.05] px-5 py-4 first:border-t-0 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-6"
                >
                  <code className="min-w-0 font-mono text-[12px] leading-relaxed break-words text-mist-900">
                    {row.mono}
                  </code>
                  <p className="text-[13px] leading-relaxed text-mist-600">
                    {t(`detail.capabilities.${row.key}`)}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </>
      ) : null}

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("detail.workflowFit.eyebrow")}
          title={t("detail.workflowFit.title", { name: integration.name })}
        />
        <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          <WorkflowRow
            step="1"
            title={t("detail.workflowFit.discovery.title")}
            body={t("detail.workflowFit.discovery.body", { name: integration.name })}
          />
          <WorkflowRow
            step="2"
            title={t("detail.workflowFit.review.title")}
            body={t("detail.workflowFit.review.body")}
          />
          <WorkflowRow
            step="3"
            title={t("detail.workflowFit.delivery.title")}
            body={t("detail.workflowFit.delivery.body", { name: integration.name })}
          />
        </div>

        {/* Fit points — three mapped items, so no borders and no padding of
            their own (rule/listed-items-are-not-cards). */}
        <div className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-3">
          {fitPoints.map((point) => (
            <div key={point.title} className="flex flex-col">
              <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {point.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-mist-600">{point.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Divider />

      <FaqSection
        eyebrow={t("detail.faq.eyebrow")}
        title={t("detail.faq.title")}
        items={(["auth", "locales", "deploy", "leaving"] as const).map((id) => ({
          id,
          question: t(`detail.faq.${id}.question`),
          answer: t(`detail.faq.${id}.answer`),
        }))}
      />

      <Divider />

      <ClosingCta
        eyebrow={t("detail.closing.eyebrow")}
        title={t("detail.closing.title", { name: integration.name })}
        subtitle={t("detail.closing.subtitle")}
        primary={{ label: t("detail.nextStep.install"), href: installHref }}
        secondary={
          integration.guideHref
            ? { label: t("detail.nextStep.readGuide"), href: integration.guideHref }
            : undefined
        }
      />

      <Divider />

      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
  );
}

/**
 * The hero's right-hand column.
 *
 * A frame belongs to a single object with one job, and there are two candidates
 * here: the snippet you paste, or — when we have no verified snippet for this
 * integration — the summary panel with its mark and labels. Never both, and
 * never an empty band: the previous hero left a 128px gap under the copy
 * because nothing filled the second column.
 */
function HeroVisual({
  integration,
  facts,
  t,
}: {
  integration: IntegrationItem;
  facts: IntegrationFacts | null;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  if (facts?.install) {
    return (
      <CodeBlock
        lang={facts.install.lang}
        filename={facts.install.filename}
        meta={integration.name}
        code={facts.install.code}
      />
    );
  }

  return (
    <div className="rounded-xl border border-black/[0.07] bg-white p-6">
      {/* Mark and name only. Category, badge and status all live in the pillar
          badge above the h1 now — printing the status here as well is how
          "Built-in" ended up on the page twice. */}
      <div className="flex items-center gap-3">
        <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.06] bg-white">
          <IntegrationBrandMark item={integration} />
        </div>
        <span className="text-[11px] font-medium text-mist-900">{integration.name}</span>
      </div>
      {integration.detail ? (
        <p className="mt-4 text-[13px] leading-relaxed text-mist-600">{integration.detail}</p>
      ) : null}
      <p className="mt-4 border-t border-black/[0.05] pt-4 text-[13px] leading-relaxed text-mist-600">
        {t("detail.nextStep.body")}
      </p>
    </div>
  );
}

/**
 * The same converging diagram the rest of the site uses, with this integration
 * named in one of the cards. Slot geometry belongs to FlowHero — the cards are
 * the only thing that varies per page.
 */
function IntegrationFlow({
  integration,
  pillar,
  t,
}: {
  integration: IntegrationItem;
  pillar: Pillar;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  return (
    <FlowHero
      pillar={pillar}
      title={t("detail.workflowFit.title", { name: integration.name })}
      center={{
        mark: (
          <img
            src="/brand/logo.svg"
            alt=""
            width={26}
            height={26}
            style={{ width: 26, height: 26 }}
          />
        ),
        label: "Better I18N",
        sublabel: t("detail.flow.centerSublabel"),
      }}
      cards={[
        <FlowCard key="source" eyebrow={t("detail.flow.cards.source")}>
          <FlowText>{t("detail.workflowFit.discovery.body", { name: integration.name })}</FlowText>
        </FlowCard>,
        // The integration itself, named: one card in the flow, not a diagram
        // of its own.
        <FlowCard key="integration" eyebrow={integration.name}>
          <FlowMono>{integration.slug}</FlowMono>
        </FlowCard>,
        <FlowCard key="glossary" eyebrow={t("detail.flow.cards.glossary")}>
          <FlowText muted>{t("detail.workflowFit.review.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="review" eyebrow={t("detail.flow.cards.review")}>
          <FlowText>{t("detail.workflowFit.delivery.body", { name: integration.name })}</FlowText>
        </FlowCard>,
        <FlowCard
          key="tr"
          eyebrow={t("detail.flow.cards.published")}
          corner={<LocaleFlag locale="tr" size={14} />}
        >
          <FlowMono>tr · published</FlowMono>
        </FlowCard>,
        <FlowCard
          key="de"
          eyebrow={t("detail.flow.cards.published")}
          corner={<LocaleFlag locale="de" size={14} />}
        >
          <FlowMono>de · published</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

function WorkflowRow({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="flex flex-col">
      {/* The step index as a tabular number, not a filled disc: the sequence is
          the information, the tint was not. */}
      <span className="text-[11px] font-medium tabular-nums text-mist-400">
        {step.padStart(2, "0")}
      </span>
      <h3 className="mt-2 text-[15px] font-medium tracking-[-0.015em] text-mist-900">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">{body}</p>
    </div>
  );
}

function IntegrationBrandMark({ item }: { item: IntegrationItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const brandUrl = item.logoUrl ?? getLogoUrl(item.logDomain ?? undefined);

  // 1. External logo (Brandfetch or uploaded)
  if (brandUrl && !imageFailed) {
    return (
      <img
        src={brandUrl}
        alt={`${item.name} logo`}
        className="size-3.5 rounded-[3px] object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        width={16}
        height={16}
        onError={() => setImageFailed(true)}
      />
    );
  }

  // 2. Sprite icon
  if (item.icon.type === "sprite" && item.icon.name) {
    return <SpriteIcon name={item.icon.name} className="size-3.5 text-mist-800" />;
  }

  // 3. React component icon (NextjsIcon, ReactIcon, etc.)
  if (item.icon.type === "component") {
    const Component = item.icon.component;
    return <Component className="size-3.5 text-mist-800" />;
  }

  // 4. Short text label — last resort
  if (item.markLabel) {
    return (
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-mist-600">
        {item.markLabel}
      </span>
    );
  }

  return null;
}

function getFitPoints(slug: string, t: (key: string, opts?: Record<string, unknown>) => string) {
  const shared = [
    {
      title: t("detail.fitPoints.shared.operationalDrift.title"),
      body: t("detail.fitPoints.shared.operationalDrift.body"),
    },
    {
      title: t("detail.fitPoints.shared.rolloutControl.title"),
      body: t("detail.fitPoints.shared.rolloutControl.body"),
    },
  ];

  if (slug === "github" || slug === "mcp-server" || slug === "cli") {
    return [
      {
        title: t("detail.fitPoints.developerFirst.title"),
        body: t("detail.fitPoints.developerFirst.body"),
      },
      ...shared,
    ];
  }

  if (slug === "global-cdn" || slug === "translation-cdn") {
    return [
      {
        title: t("detail.fitPoints.runtimeDelivery.title"),
        body: t("detail.fitPoints.runtimeDelivery.body"),
      },
      ...shared,
    ];
  }

  return [
    {
      title: t("detail.fitPoints.stackFit.title"),
      body: t("detail.fitPoints.stackFit.body"),
    },
    ...shared,
  ];
}

function getDashboardInstallHref({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const params = new URLSearchParams({
    source: "landing",
    intent: "install-integration",
    integration: slug,
    ref: `/${locale}/integrations/${slug}`,
  });

  return `https://dash.better-i18n.com/?${params.toString()}`;
}

function IntegrationNotFound() {
  const { locale } = Route.useParams();
  const t = useT("integrationsPage");

  return (
    <MarketingLayout showCTA={false}>
      {/* Was `mx-auto max-w-3xl px-6 text-center` — a hand-rolled container and
          the only centred body copy on the route (rule/one-container). */}
      <Section>
        <h1 className="section-h2">{t("detail.notFound.title")}</h1>
        <p className="section-p mt-3">{t("detail.notFound.body")}</p>
        <a href={`/${locale}/integrations`} className="learn-more mt-8">
          {t("detail.backToIntegrations")}
          <SpriteIcon name="arrow-right" className="size-4" />
        </a>
      </Section>
    </MarketingLayout>
  );
}

function getLogoUrl(domain?: string, size = 48) {
  if (!domain || !BRANDFETCH_CLIENT_ID) {
    return null;
  }

  const path = [
    encodeURIComponent(domain),
    "w",
    String(size),
    "h",
    String(size),
    "theme",
    "light",
    "fallback",
    "404",
    "icon",
  ].join("/");

  return `https://cdn.brandfetch.io/${path}?c=${encodeURIComponent(BRANDFETCH_CLIENT_ID)}`;
}
