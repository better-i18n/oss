import { createFileRoute } from "@tanstack/react-router";
import { personaLoader, personaHead } from "@/lib/cms-persona-helpers";
import { CmsPersonaPage, CmsPersonaNotFound } from "@/components/CmsPersonaPage";

export const Route = createFileRoute("/_archived/audience/for-freelancers")({
  loader: ({ params, context }) => personaLoader("for-freelancers", params.locale, context.locales),
  head: ({ loaderData }) => personaHead(loaderData),
  component: () => {
    const data = Route.useLoaderData();
    return <CmsPersonaPage {...data} />;
  },
  notFoundComponent: () => {
    const { locale } = Route.useParams();
    return <CmsPersonaNotFound locale={locale} slug="for-freelancers" />;
  },
});
