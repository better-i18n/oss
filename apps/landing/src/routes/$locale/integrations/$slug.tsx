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
          ? `Explore how ${cmsItem.name} fits into Better i18n workflows for developer-led localization.`
          : "Explore Better i18n integrations.",
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
      <section className="py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
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
                {t("detail.backToIntegrations", { defaultValue: "Back to integrations" })}
              </Link>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-mist-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                  <IntegrationBrandMark item={integration} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-mist-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-600">
                    {t(`categories.${integration.category}`)}
                  </span>
                  {integration.badgeLabel && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-mist-500 ring-1 ring-mist-200">
                      {integration.badgeLabel}
                    </span>
                  )}
                  <span className="rounded-full bg-mist-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    {t(`status.${integration.status}`)}
                  </span>
                </div>
              </div>

              <h1 className="mt-4 font-display text-3xl/[1.04] font-medium tracking-[-0.03em] text-mist-950 sm:text-[2.4rem]/[1.06]">
                {integration.name}
              </h1>
              <p className="mt-4 text-lg/8 text-mist-600">
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
              <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-400">
                  {t("detail.nextStep.eyebrow", { defaultValue: "Get started" })}
                </div>
                <h2 className="mt-2.5 font-display text-lg/[1.2] font-medium text-mist-950">
                  {t("detail.nextStep.title", { name: integration.name, defaultValue: "Connect {name} to your workflow" })}
                </h2>
                <p className="mt-2.5 text-sm/6 text-mist-600">
                  {t("detail.nextStep.body", { defaultValue: "Install from the dashboard in seconds. Follow the guide for environment setup, SDK configuration, and a first publish." })}
                </p>
                <div className="mt-5 space-y-2.5">
                  <a
                    href={installHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mist-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mist-800"
                  >
                    {t("detail.nextStep.install", { defaultValue: "Install integration" })}
                    <SpriteIcon name="arrow-right" className="h-3.5 w-3.5" />
                  </a>
                  {integration.guideHref && (
                    <a
                      href={integration.guideHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-2.5 text-sm font-medium text-mist-700 transition-colors hover:text-mist-950"
                    >
                      {t("detail.nextStep.readGuide", { defaultValue: "Read the guide" })}
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
      <section className="pb-16">
        <div className="mx-auto max-w-7xl space-y-6 px-6 lg:px-10">
          {/* Fit points */}
          <div className="grid gap-4 lg:grid-cols-3">
            {fitPoints.map((point) => (
              <div key={point.title} className="rounded-xl border border-mist-200 bg-white p-5">
                <h2 className="font-display text-base font-semibold text-mist-950">{point.title}</h2>
                <p className="mt-2 text-sm/6 text-mist-600">{point.body}</p>
              </div>
            ))}
          </div>

          {/* Workflow */}
          <div className="rounded-xl border border-mist-200 bg-white p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mist-400">
                  {t("detail.workflowFit.eyebrow", { defaultValue: "Where it fits" })}
                </div>
                <h2 className="mt-2 font-display text-xl/[1.1] font-medium tracking-[-0.02em] text-mist-950">
                  {t("detail.workflowFit.title", { name: integration.name, defaultValue: "How {name} works inside Better" })}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <WorkflowRow
                step="1"
                title={t("detail.workflowFit.discovery.title", { defaultValue: "Detect" })}
                body={t("detail.workflowFit.discovery.body", { name: integration.name, defaultValue: "Pull source strings from your codebase or connect your {name} repository. Keys arrive in Better with structure and context intact." })}
              />
              <WorkflowRow
                step="2"
                title={t("detail.workflowFit.review.title", { defaultValue: "Review" })}
                body={t("detail.workflowFit.review.body", { defaultValue: "Run AI translation, assign human reviewers, and gate approval before any change reaches production. Everything auditable in one place." })}
              />
              <WorkflowRow
                step="3"
                title={t("detail.workflowFit.delivery.title", { defaultValue: "Ship" })}
                body={t("detail.workflowFit.delivery.body", { name: integration.name, defaultValue: "Publish to the CDN edge or push translations back to {name}. Copy changes go live without triggering a new app deploy." })}
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
    <div className="border-t border-mist-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 first:border-t-0 first:pt-0 first:lg:border-l-0 first:lg:pl-0">
      <div className="flex size-6 items-center justify-center rounded-full bg-mist-100 text-[11px] font-semibold text-mist-500">
        {step}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-mist-950">{title}</h3>
      <p className="mt-1.5 text-sm/6 text-mist-600">{body}</p>
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
        className="size-7 rounded-sm object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        width={28}
        height={28}
        onError={() => setImageFailed(true)}
      />
    );
  }

  // 2. Sprite icon
  if (item.icon.type === "sprite" && item.icon.name) {
    return <SpriteIcon name={item.icon.name} className="size-6 text-mist-800" />;
  }

  // 3. React component icon (NextjsIcon, ReactIcon, etc.)
  if (item.icon.type === "component") {
    const Component = item.icon.component;
    return <Component className="size-6 text-mist-800" />;
  }

  // 4. Short text label — last resort
  if (item.markLabel) {
    return (
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mist-600">
        {item.markLabel}
      </span>
    );
  }

  return null;
}

function getFitPoints(slug: string, t: (key: string, opts?: Record<string, unknown>) => string) {
  const shared = [
    {
      title: t("detail.fitPoints.shared.operationalDrift.title", { defaultValue: "Less operational drift" }),
      body: t("detail.fitPoints.shared.operationalDrift.body", { defaultValue: "Keep translation updates, review, and delivery inside one clear system instead of splitting work across tools and ad hoc scripts." }),
    },
    {
      title: t("detail.fitPoints.shared.rolloutControl.title", { defaultValue: "Better rollout control" }),
      body: t("detail.fitPoints.shared.rolloutControl.body", { defaultValue: "Ship content changes with more confidence by separating translation operations from app releases when your team needs that control." }),
    },
  ];

  if (slug === "github" || slug === "mcp-server" || slug === "cli") {
    return [
      {
        title: t("detail.fitPoints.developerFirst.title", { defaultValue: "Developer-first workflow" }),
        body: t("detail.fitPoints.developerFirst.body", { defaultValue: "This integration is strongest when engineering teams want localization changes to feel close to code, review, and deployment." }),
      },
      ...shared,
    ];
  }

  if (slug === "global-cdn" || slug === "translation-cdn") {
    return [
      {
        title: t("detail.fitPoints.runtimeDelivery.title", { defaultValue: "Runtime delivery" }),
        body: t("detail.fitPoints.runtimeDelivery.body", { defaultValue: "Move translation shipping out of the main deploy path so copy and locale updates can move faster than your release cycle." }),
      },
      ...shared,
    ];
  }

  return [
    {
      title: t("detail.fitPoints.stackFit.title", { defaultValue: "Cleaner stack fit" }),
      body: t("detail.fitPoints.stackFit.body", { defaultValue: "Use this integration as part of a tighter localization system designed for modern product teams and repeated shipping, not one-time setup." }),
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
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <h1 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950">
          {t("detail.notFound.title", { defaultValue: "Integration not found" })}
        </h1>
        <p className="mt-4 text-sm/7 text-mist-700">
          {t("detail.notFound.body", { defaultValue: "The integration page you are looking for does not exist yet." })}
        </p>
        <a
          href={`/${locale}/integrations`}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-3 text-sm font-medium text-mist-700 transition-colors hover:text-mist-950"
        >
          {t("detail.backToIntegrations", { defaultValue: "Back to integrations" })}
          <SpriteIcon name="arrow-right" className="h-4 w-4" />
        </a>
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
