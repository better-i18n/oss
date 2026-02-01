import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHero from "@/components/product-teams/ProductHero";
import ProductPainPoints from "@/components/product-teams/ProductPainPoints";
import ProductWorkflow from "@/components/product-teams/ProductWorkflow";
import ProductFeatures from "@/components/product-teams/ProductFeatures";
import ProductCollaboration from "@/components/product-teams/ProductCollaboration";
import ProductCTA from "@/components/product-teams/ProductCTA";

export const Route = createFileRoute("/$locale/for-product-teams")({
  component: ForProductTeamsPage,
});

function ForProductTeamsPage() {
  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <ProductHero />
        <ProductPainPoints />
        <ProductWorkflow />
        <ProductFeatures />
        <ProductCollaboration />
        <ProductCTA />
      </main>
      <Footer />
    </div>
  );
}
