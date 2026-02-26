import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeveloperHero from "@/components/developers/DeveloperHero";
import DeveloperPainPoints from "@/components/developers/DeveloperPainPoints";
import DeveloperWorkflow from "@/components/developers/DeveloperWorkflow";
import DeveloperRoleIntegration from "@/components/developers/DeveloperRoleIntegration";
import DeveloperResources from "@/components/developers/DeveloperResources";
import DeveloperIDESupport from "@/components/developers/DeveloperIDESupport";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";

export const Route = createFileRoute("/$locale/for-developers")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "forDevelopers",
      pathname: "/for-developers",
      pageType: "educational",
      structuredDataOptions: {
        title: "Better i18n for Developers",
        description: "Developer-first internationalization with type-safe SDKs, Git integration, global CDN delivery, and automated translation workflows.",
      },
    });
  },
  component: ForDevelopersPage,
});

function ForDevelopersPage() {
  const { locale } = Route.useParams();

  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <DeveloperHero />
        <DeveloperPainPoints />
        <DeveloperWorkflow />
        <DeveloperRoleIntegration />
        <DeveloperIDESupport />
        <RelatedPages currentPage="for-developers" locale={locale} variant="for" />
        <DeveloperResources />
      </main>
      <Footer />
    </div>
  );
}
