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
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getDefaultStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/for-developers")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/for-developers";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "forDevelopers", {
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
