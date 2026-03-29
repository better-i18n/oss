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
      <section className="py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl">
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

              <div className="mt-7 flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-mist-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                  <IntegrationBrandMark item={integration} />
                </div>
                <div className="min-w-0">
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
                  <h1 className="mt-4 font-display text-3xl/[1.04] font-medium tracking-[-0.03em] text-mist-950 sm:text-[2.6rem]/[1.02]">
                    {integration.name}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg/8 text-mist-600">
                    {integration.summary}
                  </p>
                  {integration.detail && (
                    <p className="mt-4 max-w-xl text-sm/7 text-mist-700">
                      {integration.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-500">
                {t("detail.nextStep.eyebrow", { defaultValue: "Next step" })}
              </div>
              <h2 className="mt-3 font-display text-xl/[1.1] font-medium text-mist-950">
                {t("detail.nextStep.title", { defaultValue: "Put {name} into a real workflow" }).replace("{name}", integration.name)}
              </h2>
              <p className="mt-3 text-sm/7 text-mist-700">
                {t("detail.nextStep.body", { defaultValue: "Start in the dashboard, then connect guides and rollout steps when your team is ready." })}
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href={installHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mist-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-mist-900"
                >
                  {t("detail.nextStep.install", { defaultValue: "Install integration" })}
                  <SpriteIcon name="arrow-right" className="h-4 w-4" />
                </a>
                {integration.guideHref && (
                  <a
                    href={integration.guideHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-mist-200 bg-white px-4 py-3 text-sm font-medium text-mist-700 transition-colors hover:text-mist-950"
                  >
                    {t("detail.nextStep.readGuide", { defaultValue: "Read integration guide" })}
                    <SpriteIcon name="arrow-right" className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-4 lg:grid-cols-3">
            {fitPoints.map((point) => (
              <div key={point.title} className="rounded-lg border border-mist-200 bg-white p-6">
                <h2 className="font-display text-lg font-medium text-mist-950">{point.title}</h2>
                <p className="mt-3 text-sm/7 text-mist-700">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-2xl border border-mist-200 bg-white p-8">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-500">
                {t("detail.workflowFit.eyebrow", { defaultValue: "Workflow fit" })}
              </div>
              <h2 className="mt-4 font-display text-2xl/[1.08] font-medium tracking-[-0.02em] text-mist-950">
                {t("detail.workflowFit.title", { defaultValue: "How {name} fits into Better" }).replace("{name}", integration.name)}
              </h2>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <WorkflowRow
                title={t("detail.workflowFit.discovery.title", { defaultValue: "Discovery" })}
                body={t("detail.workflowFit.discovery.body", { defaultValue: "Use {name} inside a clearer localization workflow instead of relying on one-off scripts or scattered locale files." }).replace("{name}", integration.name)}
              />
              <WorkflowRow
                title={t("detail.workflowFit.review.title", { defaultValue: "Review" })}
                body={t("detail.workflowFit.review.body", { defaultValue: "Keep approval and rollout steps visible so engineers, product teams, and reviewers are looking at the same system." })}
              />
              <WorkflowRow
                title={t("detail.workflowFit.delivery.title", { defaultValue: "Delivery" })}
                body={t("detail.workflowFit.delivery.body", { defaultValue: "Ship through the CDN or connect guide-based implementation paths when your stack needs a deeper runtime integration." })}
              />
            </div>
          </div>
        </div>
      </section>

      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
  );
}

function WorkflowRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-mist-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 first:border-t-0 first:pt-0 first:lg:border-l-0 first:lg:pl-0">
      <h3 className="text-sm font-medium text-mist-950">{title}</h3>
      <p className="mt-2 text-sm/7 text-mist-700">{body}</p>
    </div>
  );
}

function IntegrationBrandMark({ item }: { item: IntegrationItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const brandUrl = item.logoUrl ?? getLogoUrl(item.logDomain ?? undefined);

  if (brandUrl && !imageFailed) {
    return (
      <img
        src={brandUrl}
        alt={`${item.name} logo`}
        className="size-8 rounded-sm object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        width={32}
        height={32}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (item.markLabel) {
    return (
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-950">
        {item.markLabel}
      </span>
    );
  }

  if (item.icon.type === "sprite" && item.icon.name) {
    return <SpriteIcon name={item.icon.name} className="size-8 text-mist-950" />;
  }

  if (item.icon.type === "component") {
    const Component = item.icon.component;
    return <Component className="size-8 text-mist-950" />;
  }

  return null;
}

function getFitPoints(slug: string, t: (key: string, opts?: { defaultValue?: string }) => string) {
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
