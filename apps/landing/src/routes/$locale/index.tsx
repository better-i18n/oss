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
import { getChangelogs } from "@/lib/changelog";

export const Route = createFileRoute("/$locale/")({
  loader: async ({ context, params }) => {
    const locale = params.locale as string;
    const releases = await getChangelogs(locale);
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
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getHomePageStructuredData(),
    };
  },
  component: LandingPage,
});

function LandingPage() {
  const { recentChangelogs } = Route.useLoaderData();
  return (
    <>
      <Header />
      <main>
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
