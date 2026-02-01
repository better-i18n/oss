import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeveloperHero from "@/components/developers/DeveloperHero";
import DeveloperPainPoints from "@/components/developers/DeveloperPainPoints";
import DeveloperWorkflow from "@/components/developers/DeveloperWorkflow";
import DeveloperRoleIntegration from "@/components/developers/DeveloperRoleIntegration";
import DeveloperResources from "@/components/developers/DeveloperResources";
import DeveloperIDESupport from "@/components/developers/DeveloperIDESupport";
import { getLocalizedMeta, formatMetaTags } from "@/lib/meta";

export const Route = createFileRoute("/$locale/for-developers")({
  // Expose parent context as loaderData for head() function
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const meta = getLocalizedMeta(loaderData?.messages || {}, "forDevelopers");
    return {
      meta: formatMetaTags(meta),
    };
  },
  component: ForDevelopersPage,
});

function ForDevelopersPage() {
  return (
    <div className="bg-mist-100">
      <Header />
      <main>
        <DeveloperHero />
        <DeveloperPainPoints />
        <DeveloperWorkflow />
        <DeveloperRoleIntegration />
        <DeveloperIDESupport />
        <DeveloperResources />
      </main>
      <Footer />
    </div>
  );
}
