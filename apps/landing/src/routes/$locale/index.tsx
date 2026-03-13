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

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }) => {
    const locale = params.locale as string;
    // Use metadata-only fetch (single API call) instead of full content (N+1 calls)
    // to keep homepage load time within crawler timeout limits.
    // Wrap with 3s timeout so the page renders even if the API is slow.
    const [messages, releases] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      withTimeout(getChangelogsMeta(locale), 3000, []),
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

    // Extract testimonial quotes for Review structured data
    const testimonialsNs = (messages as Record<string, unknown>)?.testimonials as
      | Record<string, Record<string, string>>
      | undefined;
    const testimonialAuthors = [
      "Samet Selcuk",
      "Tevfik Can Karanfil",
      "Mehmet Hanifi Şentürk",
      "Eray Gündoğmuş",
    ];
    const reviewItems = testimonialAuthors
      .map((author, i) => {
        const quote = testimonialsNs?.[String(i + 1)]?.quote;
        return quote ? { author, reviewBody: quote } : null;
      })
      .filter((item): item is { author: string; reviewBody: string } => item !== null);

    return {
      meta: formatMetaTags(meta, { locale, locales: loaderData?.locales }),
      links: [
        ...getAlternateLinks(pathname, loaderData?.locales),
        getCanonicalLink(locale, pathname),
      ],
      scripts: [
        ...getHomePageStructuredData({
          reviews: reviewItems.length > 0 ? reviewItems : undefined,
          locale,
        }),
        ...formatStructuredData(
          getFAQSchema(
            [
              { question: "How is Better i18n different from Crowdin?", answer: "Better i18n is built for modern developer workflows with AI-powered translations, Git-native sync, and instant CDN delivery. Unlike Crowdin, there are no manual file imports or complex setup — just push code and translations sync automatically." },
              { question: "Why switch from Lokalise to Better i18n?", answer: "Better i18n offers transparent pricing with a generous free tier for open source, AI chat for fixing translation errors in natural language, and automated i18n health checks that catch issues before your users do." },
              { question: "How does Better i18n compare on pricing?", answer: "Better i18n is free for open source projects. Paid plans start lower than Crowdin, Lokalise, or Phrase, with no per-seat pricing and unlimited collaborators on all plans." },
              { question: "What makes Better i18n unique for developers?", answer: "Better i18n integrates directly into your IDE via MCP, offers a CLI for CI/CD pipelines, provides Git-native workflows, and delivers translations via a global CDN with sub-50ms latency — no build step required." },
            ],
            locale,
          )
        ),
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
        <MetricsBadges />
        <Features />
        <FrameworkSupport />
        <UseCases />
        <UserSegments />
        <IndustryStats />
        <Alternatives />
        <ComparisonFAQ />
        <Testimonials />
        <Changelog releases={recentChangelogs} />
        <Pricing />
        <RelatedPages currentPage="home" locale={locale} variant="content" />
      </main>
      <Footer />
    </>
  );
}
