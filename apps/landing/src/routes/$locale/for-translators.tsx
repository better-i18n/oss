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
import { getPageHead, createPageLoader } from "@/lib/page-seo";

export const Route = createFileRoute("/$locale/for-translators")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const headData = getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "forTranslators",
      pathname: "/for-translators",
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n for Translators",
        description: "AI-powered translation with brand glossary support, human-in-the-loop review, and instant CDN publishing for professional translators.",
      },
    });

    return {
      ...headData,
      meta: [
        ...headData.meta,
        { property: "article:section", content: "Translators" },
      ],
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
