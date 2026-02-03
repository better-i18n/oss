import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranslatorHero from "@/components/translators/TranslatorHero";
import TranslatorPainPoints from "@/components/translators/TranslatorPainPoints";
import TranslatorFeatures from "@/components/translators/TranslatorFeatures";
import TranslatorDeepLSection from "@/components/translators/TranslatorDeepLSection";
import TranslatorWorkflow from "@/components/translators/TranslatorWorkflow";
import TranslatorCTA from "@/components/translators/TranslatorCTA";
import { RelatedPages } from "@/components/RelatedPages";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getDefaultStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/for-translators")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/for-translators";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "forTranslators", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname, ["en", "tr"]),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(),
    };
  },
  component: ForTranslatorsPage,
});

function ForTranslatorsPage() {
  const { locale } = Route.useParams();

  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <TranslatorHero />
        <TranslatorPainPoints />
        <TranslatorFeatures />
        <TranslatorDeepLSection />
        <TranslatorWorkflow />
        <RelatedPages currentPage="for-translators" locale={locale} variant="for" />
        <TranslatorCTA />
      </main>
      <Footer />
    </div>
  );
}
