import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import FrameworkSupport from "../../components/FrameworkSupport";
import UseCases from "../../components/UseCases";
import UserSegments from "../../components/UserSegments";
import MetricsBadges from "../../components/MetricsBadges";
import IndustryStats from "../../components/IndustryStats";
import Alternatives from "../../components/Alternatives";
import ComparisonFAQ from "../../components/ComparisonFAQ";
import Testimonials from "../../components/Testimonials";
import Changelog from "../../components/Changelog";
import Pricing from "../../components/Pricing";
import Footer from "../../components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
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
import { filterMessages } from "@/lib/page-namespaces";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }) => {
    const locale = params.locale as string;
    // Use metadata-only fetch (single API call) instead of full content (N+1 calls)
    // to keep homepage load time within crawler timeout limits.
    // Wrap with 3s timeout so the page renders even if the API is slow.
    const [allMessages, releases] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogsMeta(locale), 3000, []),
    ]);
    // head() only accesses meta.home.*, hero.{title,subtitle}, homeFaq.{N}.*
    const messages = filterMessages(allMessages, [
      "meta",
      "breadcrumbs",
      "hero",
      "homeFaq",
    ]);
    return {
      messages,
      locale: context.locale,
      locales: context.locales,
      recentChangelogs: releases.slice(0, 4),
    };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/";
    const messages = loaderData?.messages || {};

    // Extract localized hero text for OG image
    const heroNs = (messages as Record<string, unknown>)?.hero as
      | Record<string, string>
      | undefined;
    const heroTitle = heroNs?.title;
    const heroSubtitle = heroNs?.subtitle;

    const meta = getLocalizedMeta(messages, "home", {
      locale,
      pathname,
      ogImage: buildOgImageUrl("og", {
        title: heroTitle,
        description: heroSubtitle,
      }),
    });

    // Extract localized FAQ items from i18n messages (homeFaq namespace)
    const faqNs = (messages as Record<string, unknown>)?.homeFaq as
      | Record<string, Record<string, string>>
      | undefined;
    const faqItems = [1, 2, 3, 4]
      .map((i) => {
        const question = faqNs?.[String(i)]?.question;
        const answer = faqNs?.[String(i)]?.answer;
        return question && answer ? { question, answer } : null;
      })
      .filter((item): item is { question: string; answer: string } => item !== null);

    return {
      meta: formatMetaTags(meta, { locale, locales: loaderData?.locales }),
      links: [
        ...getAlternateLinks(pathname, loaderData?.locales),
        getCanonicalLink(locale, pathname),
      ],
      scripts: [
        ...getHomePageStructuredData({
          locale,
        }),
        ...(faqItems.length > 0
          ? formatStructuredData(getFAQSchema(faqItems, locale))
          : []),
      ],
    };
  },
  component: LandingPage,
});

function LandingPage() {
  const { recentChangelogs } = Route.useLoaderData();
  const { locale } = Route.useParams();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-mist-950 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <Features />
        <FrameworkSupport />
        <UseCases />
        <UserSegments />
        <Alternatives />
        <Testimonials />
        <IndustryStats />
        <Changelog releases={recentChangelogs} />
        <Pricing />
        <ComparisonFAQ />
        <MetricsBadges />
        <RelatedPages currentPage="home" locale={locale} variant="content" />
      </main>
      <Footer />
    </>
  );
}
