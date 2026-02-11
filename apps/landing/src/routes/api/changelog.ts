import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getChangelogs, getLatestVersion } from "@/lib/changelog";

type SupportedLocale = "en" | "tr";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function isValidLocale(locale: string): locale is SupportedLocale {
  return locale === "en" || locale === "tr";
}

const corsMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();

  if (result?.response?.headers) {
    for (const [key, value] of Object.entries(corsHeaders)) {
      result.response.headers.set(key, value);
    }
  }

  return result;
});

export const Route = createFileRoute("/api/changelog")({
  server: {
    middleware: [corsMiddleware],
    handlers: {
      OPTIONS: async () => {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      },
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const localeParam = url.searchParams.get("locale") || "en";
        const locale: SupportedLocale = isValidLocale(localeParam)
          ? localeParam
          : "en";

        const [releases, latestVersion] = await Promise.all([
          getChangelogs(locale),
          getLatestVersion(locale),
        ]);

        return Response.json(
          {
            releases,
            latestVersion,
            locale,
          },
          {
            headers: {
              ...corsHeaders,
              "Cache-Control": "public, max-age=300",
            },
          },
        );
      },
    },
  },
});
