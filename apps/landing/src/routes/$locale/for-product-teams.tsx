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
import { getPageHead, createPageLoader } from "@/lib/page-seo";

export const Route = createFileRoute("/$locale/for-product-teams")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "forProductTeams",
      pathname: "/for-product-teams",
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n for Product Teams",
        description: "Centralized localization dashboard with real-time progress tracking, team collaboration, and instant deployment for product managers.",
      },
    });
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
