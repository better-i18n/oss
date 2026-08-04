import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getChangelogs, getLatestVersion } from "@/lib/changelog";
import { SUPPORTED_LOCALES } from "@/seo/locale-tiers";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * This used to be `locale === "en" || locale === "tr"`, coercing anything
 * else — de, fr, es, ja, it, ko, zh-hans, ... all real site locales — to
 * "en" and returning English content for them without saying so. The CMS
 * genuinely has changelog content in all `SUPPORTED_LOCALES`; an unknown
 * locale is a client error, not a reason to fabricate an English response.
 */
function isValidLocale(locale: string): boolean {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
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

        if (!isValidLocale(localeParam)) {
          return Response.json(
            {
              error: `Unsupported locale "${localeParam}"`,
              supportedLocales: SUPPORTED_LOCALES,
            },
            { status: 400, headers: corsHeaders },
          );
        }
        const locale = localeParam;

        const [releases, latestVersion] = await Promise.all([
          getChangelogs(locale),
          getLatestVersion(locale),
        ]);

        // `getChangelogs` returns `null` only when the upstream API call
        // itself failed — a genuine error, not an empty changelog. Answering
        // 200 with `releases: null` would tell every client this was a
        // successful, contentless response; a 502 lets the caller's
        // `queryFn` (`if (!response.ok) throw`) retry instead of caching a
        // false "nothing shipped" result.
        if (releases === null) {
          return Response.json(
            { error: "Failed to fetch changelog entries", locale },
            { status: 502, headers: corsHeaders },
          );
        }

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
