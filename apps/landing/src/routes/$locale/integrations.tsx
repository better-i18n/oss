import { useDeferredValue, useState } from "react";
import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { getIntegrations } from "@/lib/content";
import {
  type IntegrationCategory,
  type IntegrationItem,
  toIntegrationItem,
} from "@/lib/integrations-catalog";
import { useTranslations } from "@better-i18n/use-intl";
import {
  IconMagnifyingGlass,
  IconArrowRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const baseLoader = createPageLoader();

export const Route = createFileRoute("/$locale/integrations")({
  loader: async (args: Parameters<typeof baseLoader>[0]) => {
    const [base, cmsIntegrations] = await Promise.all([
      baseLoader(args),
      getIntegrations(args.context.locale),
    ]);
    return { ...base, cmsIntegrations };
  },
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "integrations",
      pathname: "/integrations",
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n Integrations Directory",
        description: "Explore Better i18n integrations for GitHub, CLI, API, MCP, CDN delivery, Next.js, React, Expo, Vue, and more. Discover integration surfaces for modern localization workflows.",
      },
    });
  },
  component: IntegrationsPage,
});

const BRANDFETCH_CLIENT_ID = import.meta.env.VITE_BRANDFETCH_CLIENT_ID;

function IntegrationsPage() {
  const { locale } = Route.useParams();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  if (pathname !== `/${locale}/integrations` && pathname !== `/${locale}/integrations/`) {
    return <Outlet />;
  }

  return <IntegrationsIndex locale={locale} />;
}

function IntegrationsIndex({ locale }: { locale: string }) {
  const t = useTranslations("integrationsPage");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | IntegrationCategory>("all");
  const deferredQuery = useDeferredValue(query);

  const { cmsIntegrations } = Route.useLoaderData();
  const integrations: IntegrationItem[] = cmsIntegrations.map(toIntegrationItem);

  const categories: Array<{ id: "all" | IntegrationCategory; label: string }> = [
    { id: "all", label: t("filters.categories.all", { defaultValue: "All" }) },
    {
      id: "featured",
      label: t("filters.categories.featured", { defaultValue: "Featured" }),
    },
    {
      id: "frameworks",
      label: t("filters.categories.frameworks", { defaultValue: "Frameworks" }),
    },
    {
      id: "developerTools",
      label: t("filters.categories.developerTools", { defaultValue: "Developer Tools" }),
    },
    {
      id: "delivery",
      label: t("filters.categories.delivery", { defaultValue: "Delivery" }),
    },
    {
      id: "aiAutomation",
      label: t("filters.categories.aiAutomation", { defaultValue: "AI & Automation" }),
    },
  ];

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredIntegrations = integrations.filter((item) => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    const textMatch =
      normalizedQuery.length === 0 ||
      `${item.name} ${item.summary} ${item.detail ?? ""} ${item.badgeLabel ?? ""} ${t(`categories.${item.category}`)}`.toLowerCase().includes(normalizedQuery);
    return categoryMatch && textMatch;
  });

  const counts = categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.id] =
      category.id === "all"
        ? integrations.length
        : integrations.filter((item) => item.category === category.id).length;
    return acc;
  }, {});

  const workflowCards = [
    {
      key: "githubCliCdn",
      href: `/${locale}/compare/crowdin`,
    },
    {
      key: "nextjsAiReview",
      href: `/${locale}/i18n/nextjs`,
    },
    {
      key: "expoOtaCdn",
      href: `/${locale}/i18n/expo`,
    },
  ];

  const groupedIntegrations = [
    { id: "featured" as const, items: integrations.filter((item) => item.category === "featured") },
    { id: "frameworks" as const, items: integrations.filter((item) => item.category === "frameworks") },
    { id: "developerTools" as const, items: integrations.filter((item) => item.category === "developerTools") },
    { id: "delivery" as const, items: integrations.filter((item) => item.category === "delivery") },
    { id: "aiAutomation" as const, items: integrations.filter((item) => item.category === "aiAutomation") },
  ];

  return (
    <MarketingLayout showCTA={true}>
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-mist-100 px-3 py-1.5 text-sm text-mist-700">
              {t("hero.eyebrow", { defaultValue: "Integration directory" })}
            </div>
            <h1 className="mt-6 max-w-2xl font-display text-2xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-3xl/[1.06] lg:text-[2.9rem]/[1.02]">
              {t("hero.title", {
                defaultValue: "Integrations that fit how modern product teams ship.",
              })}
            </h1>
            <p className="mt-4 max-w-2xl text-lg/8 text-mist-600">
              {t("hero.titleHighlight", {
                defaultValue:
                  "Browse frameworks, developer tools, AI workflows, and delivery surfaces.",
              })}
            </p>
            <p className="mt-5 max-w-xl text-sm/7 text-mist-700">
              {t("hero.subtitle", {
                defaultValue:
                  "Better i18n is not a giant marketplace. It is a focused integration surface for teams that want AI-native localization, Git-native review, and CDN-first delivery without heavy TMS overhead.",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("directory.title", { defaultValue: "Explore integrations" })}
            </h2>
            <p className="mt-3 text-sm/7 text-mist-700">
              {t("directory.subtitle", {
                defaultValue:
                  "Browse Better's current integration surface across frameworks, developer tooling, delivery, and AI workflows.",
              })}
            </p>
          </div>

          <div className="mt-8 space-y-10">
            <div className="flex flex-col gap-4">
              <div className="relative max-w-xl">
                <IconMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("filters.searchPlaceholder", {
                    defaultValue: "Search GitHub, Next.js, CDN, AI, CLI...",
                  })}
                  className="w-full rounded-full border border-mist-200 bg-mist-100 py-3 pl-11 pr-4 text-sm text-mist-950 outline-none transition-colors placeholder:text-mist-400 focus:border-mist-400 focus:bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = category.id === activeCategory;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-mist-950 text-white"
                          : "bg-mist-100 text-mist-700 hover:bg-mist-200 hover:text-mist-950"
                      }`}
                    >
                      {category.label}
                      <span className={`ml-1 ${active ? "text-white/70" : "text-mist-400"}`}>
                        {counts[category.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {groupedIntegrations
              .filter((group) => activeCategory === "all" || group.id === activeCategory)
              .map((group) => {
                const items = group.items.filter((item) => filteredIntegrations.some((entry) => entry.slug === item.slug));
                if (items.length === 0) {
                  return null;
                }

                return (
                  <section key={group.id}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3 className="font-display text-2xl/[1.08] font-medium tracking-[-0.02em] text-mist-950">
                        {t(`categories.${group.id}`)}
                      </h3>
                      <span className="text-sm text-mist-500">{items.length}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => (
                        <IntegrationCard key={item.slug} item={item} locale={locale} compact />
                      ))}
                    </div>
                  </section>
                );
              })}

            {filteredIntegrations.length === 0 && (
              <div className="rounded-lg border border-dashed border-mist-300 px-6 py-12 text-center">
                <p className="text-lg font-medium text-mist-950">
                  {t("empty.title", { defaultValue: "No integrations matched that search." })}
                </p>
                <p className="mt-2 text-sm text-mist-600">
                  {t("empty.subtitle", {
                    defaultValue: "Try searching for GitHub, Next.js, CLI, MCP, or CDN.",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-mist-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 max-w-3xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("workflows.title", { defaultValue: "Popular workflow combinations" })}
            </h2>
            <p className="mt-3 text-sm/7 text-mist-700">
              {t("workflows.subtitle", {
                defaultValue:
                  "Buyers rarely search for a single integration in isolation. They search for working stacks. These combinations help Better win discovery traffic and conversion-heavy intent together.",
              })}
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {workflowCards.map((workflow) => (
              <a
                key={workflow.key}
                href={workflow.href}
                className="group rounded-lg border border-mist-200 bg-white p-6 transition-colors hover:border-mist-300"
              >
                <h3 className="text-lg font-medium text-mist-950">
                  {t(`workflows.items.${workflow.key}.title`)}
                </h3>
                <p className="mt-3 text-sm/6 text-mist-600">
                  {t(`workflows.items.${workflow.key}.body`)}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mist-900">
                  {t(`workflows.items.${workflow.key}.cta`)}
                  <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="rounded-lg bg-white p-8">
              <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
                {t("seo.eyebrow", { defaultValue: "SEO angle" })}
              </div>
              <h2 className="mt-5 font-display text-2xl/[1.08] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.04]">
                {t("seo.title", {
                  defaultValue: "Why this page matters beyond product marketing",
                })}
              </h2>
              <p className="mt-4 text-sm/7 text-mist-700">
                {t("seo.body1", {
                  defaultValue:
                    "Integration directories do two jobs at once. They help buyers understand product fit, and they create a strong surface for search terms like GitHub localization, Next.js localization integration, translation CDN, MCP localization, and Expo OTA translations.",
                })}
              </p>
              <p className="mt-4 text-sm/7 text-mist-700">
                {t("seo.body2", {
                  defaultValue:
                    "Crowdin and Lokalise use integrations as both discovery surfaces and trust signals. Better should do the same, but with a narrower and more honest product story: fewer integrations, tighter workflow fit, and better alignment with modern engineering teams.",
                })}
              </p>
            </div>

            <div className="wallpaper overflow-x-auto rounded-lg p-6 code-block">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-400">
                    {t("quickStart.eyebrow", { defaultValue: "Quick start" })}
                  </p>
                  <h3 className="mt-1 text-lg font-medium text-white">
                    {t("quickStart.title", {
                      defaultValue: "Ship through code, not spreadsheets",
                    })}
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-mist-300">
                  Next.js
                </div>
              </div>
              <pre className="text-sm text-mist-100 font-mono">
                <code>{`# Install the SDK
npm install @better-i18n/next

# Add Better to your app
import { withBetterI18n } from '@better-i18n/next'

export default withBetterI18n({
  project: 'your-org/your-project',
  locales: ['en', 'tr', 'de', 'fr'],
  defaultLocale: 'en',
})

# Publish translations through the CDN
# Add GitHub review flows only when your team needs them`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
  );
}

function IntegrationIcon({ icon }: { icon: IntegrationItem["icon"] }) {
  if (icon.type === "sprite") {
    return <SpriteIcon name={icon.name} className="size-6" />;
  }

  const Component = icon.component;
  return <Component className="size-6" />;
}

function IntegrationBrandMark({ item }: { item: IntegrationItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const brandUrl = item.logoUrl ?? getLogoUrl(item.logDomain ?? undefined);

  if (brandUrl && !imageFailed) {
    return (
      <img
        src={brandUrl}
        alt={`${item.name} logo`}
        className="size-6 rounded-sm object-contain"
        loading="lazy"
        decoding="async"
        referrerPolicy="strict-origin-when-cross-origin"
        width={24}
        height={24}
        onError={() => setImageFailed(true)}
      />
    );
  }

  if (item.markLabel) {
    return (
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-950">
        {item.markLabel}
      </span>
    );
  }

  return <IntegrationIcon icon={item.icon} />;
}

function IntegrationCard({
  item,
  locale,
  compact = false,
}: {
  item: IntegrationItem;
  locale: string;
  compact?: boolean;
}) {
  const t = useTranslations("integrationsPage");
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className={`${compact ? "size-10" : "size-11"} flex shrink-0 items-center justify-center rounded-lg border border-mist-200 bg-white text-mist-950`}>
          <IntegrationBrandMark item={item} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {item.badgeLabel && (
            <span className="rounded-full bg-mist-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-500">
              {item.badgeLabel}
            </span>
          )}
          <span className="rounded-full bg-mist-950 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            {t(`status.${item.status}`)}
          </span>
        </div>
      </div>

      <div className={compact ? "mt-4" : "mt-5"}>
        <div className="flex items-center gap-2">
          <h3 className={`${compact ? "text-base" : "text-lg"} font-medium text-mist-950`}>{item.name}</h3>
          <span className="text-xs text-mist-400">/ {t(`categories.${item.category}`)}</span>
        </div>
        <p className="mt-2 text-sm/6 text-mist-700">{item.summary}</p>
        {!compact && item.detail && <p className="mt-4 text-sm/6 text-mist-500">{item.detail}</p>}
      </div>

      <div className={`${compact ? "mt-5" : "mt-6"} inline-flex items-center gap-2 text-sm font-medium text-mist-900`}>
        {t("directory.cardCta.openGuide", { defaultValue: "Open guide" })}
        <IconArrowRight className="size-4" />
      </div>
    </>
  );

  return (
    <Link
      to="/$locale/integrations/$slug/"
      params={{ locale, slug: item.slug }}
      className={`group flex h-full flex-col rounded-lg border border-mist-200 bg-white ${compact ? "p-5" : "p-6"} transition-colors hover:border-mist-300`}
    >
      {content}
    </Link>
  );
}

function getLogoUrl(domain?: string, size = 40) {
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
