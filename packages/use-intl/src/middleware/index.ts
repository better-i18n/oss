// @ts-expect-error - internal workspace dependency
import { createMiddleware } from "@tanstack/react-router";
// @ts-expect-error - internal workspace dependency
import { detectLocale, getLocales } from "@better-i18n/core";
import type { I18nMiddlewareConfig } from "@better-i18n/core";

export function createBetterI18nMiddleware(config: I18nMiddlewareConfig) {
  const { project, defaultLocale, localePrefix = "as-needed", detection = {} } = config;

  const {
    cookie = true,
    browserLanguage = true,
    cookieName = "locale",
    cookieMaxAge = 31536000,
  } = detection;

  return createMiddleware().server(
    async ({
      next,
      request,
    }: {
      next: (ctx: { context: { locale: string } }) => Promise<unknown>;
      request: Request;
    }) => {
      // 1. Fetch available locales from CDN (cached)
      const availableLocales = await getLocales({ project });

      // 2. Extract locale indicators
      const url = new URL(request.url);
      const pathSegment = url.pathname.split("/")[1];
      const hasLocaleInPath =
        !!pathSegment && availableLocales.includes(pathSegment);

      // Dynamic imports for TanStack Start server functions to avoid bundling them in client
      const {
        getCookie,
        setCookie,
        getRequestHeader,
      }: {
        getCookie: (name: string) => string | null;
        setCookie: (
          name: string,
          value: string,
          options: { path: string; maxAge: number; sameSite: string },
        ) => void;
        getRequestHeader: (name: string) => string | undefined;
        // @ts-expect-error - optional runtime dependency
      } = await import("@tanstack/react-start/server");

      const cookieLocale = cookie ? getCookie(cookieName) : null;
      const headerLocale = browserLanguage
        ? getRequestHeader("accept-language")?.split(",")[0]?.split("-")[0]
        : null;

      // 3. Detect locale using core logic
      const result = detectLocale({
        project,
        defaultLocale,
        pathLocale: pathSegment,
        cookieLocale,
        headerLocale,
        availableLocales,
      });

      // 4. Redirect if locale prefix is needed but missing
      //    Skip API routes and paths that already have a locale prefix
      const isApiRoute = url.pathname.startsWith("/api/");
      if (
        localePrefix !== "never" &&
        !hasLocaleInPath &&
        !isApiRoute &&
        result.detectedFrom !== "path"
      ) {
        const shouldRedirect =
          localePrefix === "always" ||
          (localePrefix === "as-needed" && result.locale !== defaultLocale);

        if (shouldRedirect) {
          const redirectUrl = new URL(
            `/${result.locale}${url.pathname}`,
            url.origin,
          );
          redirectUrl.search = url.search;

          // Build redirect response with locale cookie
          const headers = new Headers({
            Location: redirectUrl.toString(),
          });

          if (cookie && result.shouldSetCookie) {
            headers.set(
              "Set-Cookie",
              `${cookieName}=${result.locale}; Path=/; Max-Age=${cookieMaxAge}; SameSite=Lax`,
            );
          }

          return new Response(null, { status: 302, headers });
        }
      }

      // 5. Set cookie if needed (non-redirect path)
      if (cookie && result.shouldSetCookie) {
        setCookie(cookieName, result.locale, {
          path: "/",
          maxAge: cookieMaxAge,
          sameSite: "lax",
        });
      }

      // 6. Pass locale to route context
      return next({ context: { locale: result.locale } });
    },
  );
}
