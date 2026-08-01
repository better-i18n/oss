import { Link, createFileRoute } from "@tanstack/react-router";
import { RelatedPages } from "@/components/RelatedPages";
import { MarketingLayout } from "@/components/MarketingLayout";
import { SpriteIcon } from "@/components/SpriteIcon";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { getIntegration } from "@/lib/content";
import { toIntegrationItem, type IntegrationItem } from "@/lib/integrations-catalog";
import { useT } from "@/lib/i18n";
import { useState } from "react";

const BRANDFETCH_CLIENT_ID = import.meta.env.VITE_BRANDFETCH_CLIENT_ID;

const baseLoader = createPageLoader();

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
      pageKey: "integrations",
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

function IntegrationDetailPage() {
  const t = useT("integrationsPage");
  const { locale } = Route.useParams();
  const { cmsItem } = Route.useLoaderData();
  const integration: IntegrationItem | null = cmsItem ? toIntegrationItem(cmsItem) : null;

  if (!integration) {
    return <IntegrationNotFound />;
  }

  const fitPoints = getFitPoints(integration.slug, t);
  const installHref = getDashboardInstallHref({
    locale,
    slug: integration.slug,
  });

  return (
    <MarketingLayout showCTA={true}>
      {/* ── Hero ────────────────────────────────────── */}
      <section>
        <div className="section">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* Left */}
            <div className="max-w-2xl">
              <Link
                to="/$locale/integrations/"
                params={{ locale }}
                className="inline-flex items-center gap-2 text-sm text-mist-500 transition-colors hover:text-mist-900"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                {t("detail.backToIntegrations")}
              </Link>

              {/* The vendor's own mark in the shared 22px tile, and the three
                  labels as plain ink rather than three differently-tinted
                  pills — the tint was never carrying information. */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.06] bg-white">
                  <IntegrationBrandMark item={integration} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-mist-500">
                  <span>{t(`categories.${integration.category}`)}</span>
                  {integration.badgeLabel && (
                    <span className="text-mist-400">{integration.badgeLabel}</span>
                  )}
                  <span className="font-medium text-mist-900">
                    {t(`status.${integration.status}`)}
                  </span>
                </div>
              </div>

              <h1 className="section-h2 mt-4 sm:text-[2.4rem]/[1.06]">
                {integration.name}
              </h1>
              <p className="section-p mt-3">
                {integration.summary}
              </p>
              {integration.detail && (
                <p className="mt-3 text-sm/7 text-mist-500">
                  {integration.detail}
                </p>
              )}
            </div>

            {/* Right — sticky card */}
            <div className="lg:sticky lg:top-24">
              {/* One action panel keeps a shell, but a hairline one: the
                  1px shadow was the last piece of elevation on the page. */}
              <div className="rounded-xl border border-black/[0.07] bg-white p-6">
                <div className="eyebrow">
                  {t("detail.nextStep.eyebrow")}
                </div>
                <h2 className="mt-2.5 font-display text-lg/[1.2] font-medium text-mist-950">
                  {t("detail.nextStep.title", { name: integration.name })}
                </h2>
                <p className="mt-2.5 text-sm/6 text-mist-600">
                  {t("detail.nextStep.body")}
                </p>
                <div className="mt-5 space-y-2.5">
                  <a
                    href={installHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mist-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mist-800"
                  >
                    {t("detail.nextStep.install")}
                    <SpriteIcon name="arrow-right" className="h-3.5 w-3.5" />
                  </a>
                  {integration.guideHref && (
                    <a
                      href={integration.guideHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-2.5 text-sm font-medium text-mist-700 transition-colors hover:text-mist-950"
                    >
                      {t("detail.nextStep.readGuide")}
                      <SpriteIcon name="arrow-right" className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fit points + Workflow (no gap between) ── */}
      <section>
        <div className="section space-y-6">
          {/* Fit points — three mapped items, so no borders and no padding of
              their own (rule/listed-items-are-not-cards). */}
          <div className="grid gap-x-10 gap-y-8 lg:grid-cols-3">
            {fitPoints.map((point) => (
              <div key={point.title} className="flex flex-col">
                <h2 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {point.title}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">{point.body}</p>
              </div>
            ))}
          </div>

          {/* Workflow */}
          <div className="pt-10">
            <div className="eyebrow">{t("detail.workflowFit.eyebrow")}</div>
            <h2 className="section-h2 mt-2">
              {t("detail.workflowFit.title", { name: integration.name })}
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
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
          </div>
        </div>
      </section>

      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
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
      <section>
        <div className="section">
          <h1 className="section-h2">{t("detail.notFound.title")}</h1>
          <p className="section-p mt-3">{t("detail.notFound.body")}</p>
          <a
            href={`/${locale}/integrations`}
            className="learn-more mt-8"
          >
            {t("detail.backToIntegrations")}
            <SpriteIcon name="arrow-right" className="size-4" />
          </a>
        </div>
      </section>
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
