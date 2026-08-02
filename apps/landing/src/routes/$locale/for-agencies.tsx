import { createFileRoute } from "@tanstack/react-router";
import { personaLoader, personaHead } from "@/lib/cms-persona-helpers";
import { CmsPersonaPage, CmsPersonaNotFound } from "@/components/CmsPersonaPage";
import { AgencyFlow } from "@/components/personas/PersonaFlows";

export const Route = createFileRoute("/$locale/for-agencies")({
  loader: ({ params }) => personaLoader("for-agencies", params.locale),
  head: ({ loaderData }) => personaHead(loaderData),
  component: ForAgenciesPage,
  notFoundComponent: ForAgenciesNotFound,
});

/* Named functions rather than inline arrows: `component: () => { … }` is a
   real component — TanStack renders it — but static analysis cannot see that
   through the route-options object, so every `Route.useLoaderData()` inside one
   reads as a hook called outside a component (react-doctor rules-of-hooks). */
function ForAgenciesPage() {
  const data = Route.useLoaderData();
  return <CmsPersonaPage {...data} heroVisual={<AgencyFlow />} />;
}

function ForAgenciesNotFound() {
  const { locale } = Route.useParams();
  return <CmsPersonaNotFound locale={locale} slug="for-agencies" />;
}
