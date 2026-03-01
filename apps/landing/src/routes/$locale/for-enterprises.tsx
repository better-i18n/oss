import { createFileRoute } from "@tanstack/react-router";
import { personaLoader, personaHead } from "@/lib/cms-persona-helpers";
import { CmsPersonaPage, CmsPersonaNotFound } from "@/components/CmsPersonaPage";

export const Route = createFileRoute("/$locale/for-enterprises")({
  loader: ({ params }) => personaLoader("for-enterprises", params.locale),
  head: ({ loaderData }) => personaHead(loaderData),
  component: () => {
    const data = Route.useLoaderData();
    return <CmsPersonaPage {...data} />;
  },
  notFoundComponent: () => {
    const { locale } = Route.useParams();
    return <CmsPersonaNotFound locale={locale} slug="for-enterprises" />;
  },
});
