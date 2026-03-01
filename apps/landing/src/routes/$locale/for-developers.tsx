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
import { getPageHead, createPageLoader, getEducationalPageStructuredData, formatStructuredData } from "@/lib/page-seo";
import { getHowToSchema } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/for-developers")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const messages = loaderData?.messages || {};
    const locale = loaderData?.locale || "en";

    const developersNs = (messages as Record<string, unknown>)?.developers as
      | Record<string, unknown>
      | undefined;
    const workflowNs = developersNs?.workflow as Record<string, unknown> | undefined;
    const stepsNs = workflowNs?.steps as Record<string, Record<string, string>> | undefined;

    const stepKeys = ["connect", "discover", "translate", "publish"];
    const howToSteps = stepsNs
      ? stepKeys
          .filter((key) => stepsNs[key]?.title && stepsNs[key]?.description)
          .map((key) => ({
            name: stepsNs[key].title,
            text: stepsNs[key].description,
          }))
      : [];

    const educationalScripts = getEducationalPageStructuredData({
      title: "Better i18n for Developers",
      description: "Developer-first internationalization with type-safe SDKs, Git integration, global CDN delivery, and automated translation workflows.",
      url: `https://better-i18n.com/${locale}/for-developers`,
    });

    const howToScript = howToSteps.length > 0
      ? formatStructuredData(getHowToSchema({
          name: "How to Set Up i18n as a Developer with Better i18n",
          description: "Developer workflow for connecting your repo, discovering keys, translating, and publishing.",
          steps: howToSteps,
          totalTime: "PT10M",
        }))
      : [];

    const headData = getPageHead({
      messages,
      locale,
      pageKey: "forDevelopers",
      pathname: "/for-developers",
      customStructuredData: [...educationalScripts, ...howToScript],
    });

    return {
      ...headData,
      meta: [
        ...headData.meta,
        { property: "article:section", content: "Developers" },
      ],
    };
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
