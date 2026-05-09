import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useT } from "@/lib/i18n";
// Above-the-fold (eager): Header + Hero own the LCP candidate (the hero h1)
// and the visible viewport on first paint. Footer is small and shared, also
// eager.
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
// Below-the-fold (code-split): each section ships as its own chunk so the
// initial JS bundle stays small and the browser can fetch + parse them in
// parallel with the main bundle. SSG still resolves these Suspense
// boundaries at prerender time, so the static HTML keeps every section's
// SEO content. React 19's progressive hydration takes care of priority on
// the client. See BETTER-264.
const Features = lazy(() => import("../../components/Features"));
const FrameworkSupport = lazy(() => import("../../components/FrameworkSupport"));
const UseCases = lazy(() => import("../../components/UseCases"));
const UserSegments = lazy(() => import("../../components/UserSegments"));
const MetricsBadges = lazy(() => import("../../components/MetricsBadges"));
const IndustryStats = lazy(() => import("../../components/IndustryStats"));
const Alternatives = lazy(() => import("../../components/Alternatives"));
const ComparisonFAQ = lazy(() => import("../../components/ComparisonFAQ"));
const Testimonials = lazy(() => import("../../components/Testimonials"));
const Changelog = lazy(() => import("../../components/Changelog"));
const Pricing = lazy(() => import("../../components/Pricing"));
const RelatedPages = lazy(() =>
  import("@/components/RelatedPages").then((m) => ({ default: m.RelatedPages })),
);

// Same-size placeholder for each below-fold section while its chunk loads.
// Keeps layout stable (no CLS) and keeps DOM aria-hidden so screen readers
// don't announce empty regions.
const SectionFallback = ({ minHeight = 600 }: { minHeight?: number }) => (
  <div aria-hidden="true" style={{ minHeight }} />
);
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
} from "@/lib/meta";
import { getHomePageStructuredData, getFAQSchema, formatStructuredData } from "@/lib/structured-data";
import { getChangelogsMeta } from "@/lib/changelog";
import { withTimeout } from "@/lib/fetch-utils";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import { getPricingPlans, type PricingPlan } from "@/lib/content";

// Pre-built head() output — keeps the heavy `messages` dictionary OUT of
// loaderData so TanStack Router doesn't dehydrate it into the SSR HTML
// (avoiding a duplicate of __root's <script id="__i18n_messages__"> embed).
// See BETTER-263 for the CWV background.
type HeadData = {
  meta: ReturnType<typeof formatMetaTags>;
  links: Array<ReturnType<typeof getCanonicalLink>>;
  scripts: ReturnType<typeof formatStructuredData>;
};

type HomeLoaderData = {
  locale: string;
  recentChangelogs: ReturnType<typeof Array.prototype.slice>;
  plans: PricingPlan[];
  headData: HeadData;
};

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }): Promise<HomeLoaderData> => {
    const locale = params.locale as string;
    // Use metadata-only fetch (single API call) instead of full content (N+1 calls)
    // to keep homepage load time within crawler timeout limits.
    // Wrap with 3s timeout so the page renders even if the API is slow.
    const [allMessages, releases, plans] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogsMeta(locale), 3000, []),
      getPricingPlans(context.locale),
    ]);

    // Pre-build head() output here so we never dehydrate the full messages
    // dict into loaderData. Only the small set of meta tags / links / scripts
    // we actually emit ends up in the SSR HTML — the messages themselves are
    // embedded ONCE by __root via <script id="__i18n_messages__">.
    const pathname = "/";
    const heroNs = (allMessages as Record<string, unknown>)?.hero as
      | Record<string, string>
      | undefined;
    const ogImage = buildOgImageUrl("og", {
      title: heroNs?.title,
      description: heroNs?.subtitle,
    });
    const metaTags = getLocalizedMeta(
      (allMessages ?? {}) as Record<string, Record<string, string>>,
      "home",
      {
        locale: context.locale,
        pathname,
        ogImage,
      },
    );
    const faqNs = (allMessages as Record<string, unknown>)?.homeFaq as
      | Record<string, Record<string, string>>
      | undefined;
    const faqItems = [1, 2, 3, 4]
      .map((i) => {
        const question = faqNs?.[String(i)]?.question;
        const answer = faqNs?.[String(i)]?.answer;
        return question && answer ? { question, answer } : null;
      })
      .filter((item): item is { question: string; answer: string } => item !== null);

    const headData: HeadData = {
      meta: formatMetaTags(metaTags, { locale: context.locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(context.locale, pathname),
      ],
      scripts: [
        ...getHomePageStructuredData({
          locale: context.locale,
          ogImage,
        }),
        ...(faqItems.length > 0
          ? formatStructuredData(getFAQSchema(faqItems, context.locale))
          : []),
      ],
    };

    return {
      locale: context.locale,
      recentChangelogs: releases.slice(0, 4),
      plans,
      headData,
    };
  },
  head: ({ loaderData }) =>
    loaderData?.headData ?? {
      meta: [
        { title: "Better I18N — Localization Infrastructure for Modern Teams" },
        { name: "description", content: "Ship multilingual apps faster with AI-powered translation, Git sync, CDN delivery, and framework SDKs." },
      ],
      links: [],
      scripts: [],
    },
  component: LandingPage,
});

function LandingPage() {
  const { recentChangelogs: initialChangelogs, plans } = Route.useLoaderData();
  const { locale } = Route.useParams();
  const t = useT("common");

  // Client-side fallback via /api/changelog.
  // Pre-rendered HTML may have empty changelogs if the API timed out during
  // build. When initialChangelogs is empty, useQuery fetches fresh with the
  // correct locale — same pattern as the changelog index page.
  const { data: recentChangelogs = initialChangelogs } = useQuery({
    queryKey: ["changelogs-home", locale],
    queryFn: async () => {
      const response = await fetch(`/api/changelog?locale=${locale}`);
      if (!response.ok) return [];
      const json = (await response.json()) as { releases: typeof initialChangelogs };
      return (json.releases ?? []).slice(0, 4);
    },
    // Only pass initialData when SSR loaded changelogs — if empty, let react-query fetch.
    initialData: initialChangelogs.length > 0 ? initialChangelogs : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
      >
        {t("skipToContent", { defaultValue: "Skip to content" })}
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<SectionFallback minHeight={800} />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FrameworkSupport />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <UseCases />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <UserSegments />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Alternatives />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight={400} />}>
          <IndustryStats />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Changelog releases={recentChangelogs} />
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight={800} />}>
          <Pricing plans={plans} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ComparisonFAQ />
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight={300} />}>
          <MetricsBadges />
        </Suspense>
        <Suspense fallback={<SectionFallback minHeight={400} />}>
          <RelatedPages currentPage="home" locale={locale} variant="content" />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
