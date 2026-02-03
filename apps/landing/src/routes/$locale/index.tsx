import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import FrameworkSupport from "../../components/FrameworkSupport";
import Integrations from "../../components/Integrations";
import UseCases from "../../components/UseCases";
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
} from "@/lib/meta";
import { getHomePageStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "home", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname, ["en", "tr"]),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getHomePageStructuredData(),
    };
  },
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <FrameworkSupport />
        <Integrations />
        <UseCases />
        <Alternatives />
        <Testimonials />
        <Changelog />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
