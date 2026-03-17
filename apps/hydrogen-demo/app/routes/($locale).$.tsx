import { useTranslation } from "react-i18next";
import { useRouteLoaderData } from "react-router";
import { LocaleLink } from "~/components/LocaleLink";

export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return null;
}

export function ErrorBoundary() {
  const rootData = useRouteLoaderData("root") as
    | { locale: string }
    | undefined;
  const locale = rootData?.locale ?? "en";
  const { t: tc } = useTranslation("common");

  return (
    <div className="page-frame flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-semibold tracking-tight text-slate-300">
        404
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
        {tc("not_found_title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
        {tc("not_found_desc")}
      </p>
      <LocaleLink to="/" locale={locale} className="button-primary mt-8">
        {tc("back_home")}
      </LocaleLink>
    </div>
  );
}
