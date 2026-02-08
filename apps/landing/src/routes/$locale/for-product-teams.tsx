import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/product-teams/ProductHero";
import ProductPainPoints from "@/components/product-teams/ProductPainPoints";
import ProductWorkflow from "@/components/product-teams/ProductWorkflow";
import ProductFeatures from "@/components/product-teams/ProductFeatures";
import ProductCollaboration from "@/components/product-teams/ProductCollaboration";
import ProductCTA from "@/components/product-teams/ProductCTA";
import { RelatedPages } from "@/components/RelatedPages";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getDefaultStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/for-product-teams")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/for-product-teams";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "forProductTeams", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(),
    };
  },
  component: ForProductTeamsPage,
});

function ForProductTeamsPage() {
  const { locale } = Route.useParams();

  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <ProductHero />
        <ProductPainPoints />
        <ProductWorkflow />
        <ProductFeatures />
        <ProductCollaboration />
        <RelatedPages currentPage="for-product-teams" locale={locale} variant="for" />
        <ProductCTA />
      </main>
      <Footer />
    </div>
  );
}
