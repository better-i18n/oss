import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";

const ProductHero = lazy(() => import("@/components/product-teams/ProductHero"));
const ProductPainPoints = lazy(() => import("@/components/product-teams/ProductPainPoints"));
const ProductPainPromiseProof = lazy(() => import("@/components/product-teams/ProductPainPromiseProof"));
const ProductWorkflow = lazy(() => import("@/components/product-teams/ProductWorkflow"));
const ProductFeatures = lazy(() => import("@/components/product-teams/ProductFeatures"));
const ProductCollaboration = lazy(() => import("@/components/product-teams/ProductCollaboration"));
const ProductCTA = lazy(() => import("@/components/product-teams/ProductCTA"));

export const Route = createFileRoute("/$locale/for-product-teams")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const headData = getPageHead({
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

    return {
      ...headData,
      meta: [
        ...headData.meta,
        { property: "article:section", content: "Product Teams" },
      ],
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
        <Suspense fallback={null}>
          <ProductHero />
          <ProductPainPoints />
          <ProductPainPromiseProof />
          <ProductWorkflow />
          <ProductFeatures />
          <ProductCollaboration />
          <RelatedPages currentPage="for-product-teams" locale={locale} variant="for" />
          <ProductCTA />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
