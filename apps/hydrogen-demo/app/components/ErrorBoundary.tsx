import { isRouteErrorResponse, useRouteError } from "react-router";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "./LocaleLink";

interface RouteErrorBoundaryProps {
  locale?: string;
}

export function RouteErrorBoundary({ locale = "en" }: RouteErrorBoundaryProps) {
  const error = useRouteError();
  const { t: tc } = useTranslation("common");

  if (isRouteErrorResponse(error)) {
    return (
      <div className="page-frame flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-7xl font-semibold tracking-tight text-slate-300">
          {error.status}
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          {error.status === 404
            ? tc("not_found_title")
            : error.statusText || "Error"}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
          {error.status === 404
            ? tc("not_found_desc")
            : error.data || "Something went wrong."}
        </p>
        <LocaleLink to="/" locale={locale} className="button-primary mt-8">
          {tc("back_home")}
        </LocaleLink>
      </div>
    );
  }

  return (
    <div className="page-frame flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-semibold tracking-tight text-slate-300">
        500
      </p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
        {tc("error_title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
        {error instanceof Error ? error.message : tc("error_desc")}
      </p>
      <LocaleLink to="/" locale={locale} className="button-primary mt-8">
        {tc("back_home")}
      </LocaleLink>
    </div>
  );
}
