import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import FrameworkSupport from "../../components/FrameworkSupport";
import Integrations from "../../components/Integrations";
import UseCases from "../../components/UseCases";
import UserSegments from "../../components/UserSegments";
import Alternatives from "../../components/Alternatives";
import Testimonials from "../../components/Testimonials";
import Changelog from "../../components/Changelog";
import Pricing from "../../components/Pricing";
import CTA from "../../components/CTA";
import Footer from "../../components/Footer";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
  buildOgImageUrl,
} from "@/lib/meta";
import { getHomePageStructuredData } from "@/lib/structured-data";
import { getChangelogsMeta } from "@/lib/changelog";
import { withTimeout } from "@/lib/fetch-utils";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }) => {
    const locale = params.locale as string;
    // Use metadata-only fetch (single API call) instead of full content (N+1 calls)
    // to keep homepage load time within crawler timeout limits.
    // Wrap with 3s timeout so the page renders even if the API is slow.
    const releases = await withTimeout(getChangelogsMeta(locale), 3000, []);
    return {
      messages: context.messages,
      locale: context.locale,
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
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getHomePageStructuredData(reviewItems.length > 0 ? reviewItems : undefined),
    };
  },
  component: LandingPage,
});

function LandingPage() {
  const { recentChangelogs } = Route.useLoaderData();
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
        <Integrations />
        <UseCases />
        <UserSegments />
        <Alternatives />
        <Testimonials />
        <Changelog releases={recentChangelogs} />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
