import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranslatorHero from "@/components/translators/TranslatorHero";
import TranslatorPainPoints from "@/components/translators/TranslatorPainPoints";
import TranslatorFeatures from "@/components/translators/TranslatorFeatures";
import TranslatorDeepLSection from "@/components/translators/TranslatorDeepLSection";
import TranslatorWorkflow from "@/components/translators/TranslatorWorkflow";
import TranslatorCTA from "@/components/translators/TranslatorCTA";
import { getLocalizedMeta, formatMetaTags } from "@/lib/meta";

export const Route = createFileRoute("/$locale/for-translators")({
  loader: ({ context }) => {
    return {
      messages: context.messages,
      locale: context.locale,
    };
  },
  head: ({ loaderData }) => {
    const meta = getLocalizedMeta(loaderData?.messages || {}, "forTranslators");

    return {
      meta: formatMetaTags(meta),
    };
  },
  component: ForTranslatorsPage,
});

function ForTranslatorsPage() {
  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <TranslatorHero />
        <TranslatorPainPoints />
        <TranslatorFeatures />
        <TranslatorDeepLSection />
        <TranslatorWorkflow />
        <TranslatorCTA />
      </main>
      <Footer />
    </div>
  );
}
