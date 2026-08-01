import { useDeferredValue, useState } from "react";
import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CodeBlock } from "@/components/CodeBlock";
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
        title: "Better I18N Integrations Directory",
        description: "Explore Better I18N integrations for GitHub, CLI, API, MCP, CDN delivery, Next.js, React, Expo, Vue, and more. Discover integration surfaces for modern localization workflows.",
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
    { id: "all", label: t("filters.categories.all") },
    {
      id: "featured",
      label: t("filters.categories.featured"),
    },
    {
      id: "frameworks",
      label: t("filters.categories.frameworks"),
    },
    {
      id: "developerTools",
      label: t("filters.categories.developerTools"),
    },
    {
      id: "delivery",
      label: t("filters.categories.delivery"),
    },
    {
      id: "aiAutomation",
      label: t("filters.categories.aiAutomation"),
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
      <section>
        <div className="section">
          <div className="max-w-3xl">
            <div className="eyebrow">{t("hero.eyebrow")}</div>
            <h1 className="section-h2 mt-6 max-w-2xl lg:text-[2.9rem]/[1.02]">
              {t("hero.title")}
            </h1>
            <p className="section-p mt-3 max-w-2xl">
              {t("hero.titleHighlight")}
            </p>
            <p className="mt-5 max-w-xl text-sm/7 text-mist-700">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="max-w-3xl">
            <h2 className="section-h2">
              {t("directory.title")}
            </h2>
            <p className="mt-3 text-sm/7 text-mist-700">
              {t("directory.subtitle")}
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
                  placeholder={t("filters.searchPlaceholder")}
                  className="w-full rounded-full border border-black/[0.07] bg-white py-3 pl-11 pr-4 text-sm text-mist-950 outline-none transition-colors placeholder:text-mist-400 focus:border-mist-400"
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
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${ active ? "border-mist-950 bg-mist-950 text-white" : "border-black/[0.07] text-mist-600 hover:text-mist-950" }`}
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
                      <h3 className="section-h2">
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

            {/* No dashed box: an empty state is a sentence, not a card. */}
            {filteredIntegrations.length === 0 && (
              <div className="py-2">
                <p className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t("empty.title")}
                </p>
                <p className="mt-1.5 max-w-[46ch] text-[13px] leading-relaxed text-mist-600">
                  {t("empty.subtitle")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="mb-10 max-w-3xl">
            <h2 className="section-h2">
              {t("workflows.title")}
            </h2>
            <p className="mt-3 text-sm/7 text-mist-700">
              {t("workflows.subtitle")}
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Bare columns: three repeated items in a .map() do not each get a
                box. The gap separates them; the section already frames them. */}
            {workflowCards.map((workflow) => (
              <a key={workflow.key} href={workflow.href} className="group flex flex-col">
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(`workflows.items.${workflow.key}.title`)}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">
                  {t(`workflows.items.${workflow.key}.body`)}
                </p>
                <span className="learn-more mt-4 w-fit">
                  {t(`workflows.items.${workflow.key}.cta`)}
                  <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="section">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="flex flex-col">
              <div className="eyebrow">{t("seo.eyebrow")}</div>
              <h2 className="section-h2 mt-5">
                {t("seo.title")}
              </h2>
              <p className="mt-4 text-sm/7 text-mist-700">
                {t("seo.body1")}
              </p>
              <p className="mt-4 text-sm/7 text-mist-700">
                {t("seo.body2")}
              </p>
            </div>

            <div className="flex flex-col">
              {/* Was a `bg-mist-950` slab with white-on-dark text: the only dark
                  surface on a white page, and unreadable next to the prose it
                  explains. `CodeBlock` tokenises at build time
                  (rule/code-blocks-are-tokenised-at-build). */}
              <div className="mb-4">
                <div className="eyebrow">{t("quickStart.eyebrow")}</div>
                <h3 className="mt-1 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t("quickStart.title")}
                </h3>
              </div>
              <CodeBlock
                lang="bash"
                filename="quick-start"
                meta="Next.js"
                code={`# Install the SDK
npm install @better-i18n/next

# Add Better to your app
import { withBetterI18n } from '@better-i18n/next'

export default withBetterI18n({
  project: 'your-org/your-project',
  locales: ['en', 'tr', 'de', 'fr'],
  defaultLocale: 'en',
})

# Publish translations through the CDN
# Add GitHub review flows only when your team needs them`}
              />
            </div>
          </div>
        </div>
      </section>

      <RelatedPages currentPage="integrations" locale={locale} variant="frameworks" />
    </MarketingLayout>
  );
}

function IntegrationBrandMark({ item }: { item: IntegrationItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const brandUrl = item.logoUrl ?? getLogoUrl(item.logDomain ?? undefined);

  // 1. External logo
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

  // 2. Sprite or component icon
  if (item.icon.type === "sprite" && item.icon.name) {
    return <SpriteIcon name={item.icon.name} className="size-3.5" />;
  }
  if (item.icon.type === "component") {
    const Component = item.icon.component;
    return <Component className="size-3.5" />;
  }

  // 3. Text label — last resort
  if (item.markLabel) {
    return (
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-mist-700">
        {item.markLabel}
      </span>
    );
  }

  return null;
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
        <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.06] bg-white text-mist-950">
          <IntegrationBrandMark item={item} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {item.badgeLabel && (
            <span className="text-[10px] text-mist-400">{item.badgeLabel}</span>
          )}
          <span className="text-[10px] font-medium text-mist-900">{t(`status.${item.status}`)}</span>
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
        {t("directory.cardCta.openGuide")}
        <IconArrowRight className="size-4" />
      </div>
    </>
  );

  return (
    <Link
      to="/$locale/integrations/$slug/"
      params={{ locale, slug: item.slug }}
      className="group flex h-full flex-col"
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
