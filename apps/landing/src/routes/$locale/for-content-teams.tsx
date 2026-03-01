import { createFileRoute } from "@tanstack/react-router";
import { personaLoader, personaHead } from "@/lib/cms-persona-helpers";
import { CmsPersonaPage, CmsPersonaNotFound } from "@/components/CmsPersonaPage";

export const Route = createFileRoute("/$locale/for-content-teams")({
  loader: ({ params }) => personaLoader("for-content-teams", params.locale),
  head: ({ loaderData }) => personaHead(loaderData),
  component: () => {
    const data = Route.useLoaderData();
    return <CmsPersonaPage {...data} />;
  },
  notFoundComponent: () => {
    const { locale } = Route.useParams();
    return <CmsPersonaNotFound locale={locale} slug="for-content-teams" />;
  },
});
