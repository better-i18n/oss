// @ts-expect-error - internal workspace dependency
import { createMiddleware } from "@tanstack/react-router";
// @ts-expect-error - internal workspace dependency
import { detectLocale, getLocales } from "@better-i18n/core";
import type { I18nMiddlewareConfig } from "@better-i18n/core";

export function createBetterI18nMiddleware(config: I18nMiddlewareConfig) {
  const { project, defaultLocale, detection = {} } = config;

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
      const pathLocale = url.pathname.split("/")[1];

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
        pathLocale,
        cookieLocale,
        headerLocale,
        availableLocales,
      });

      // 4. Set cookie if needed (if enabled and changed)
      if (cookie && result.shouldSetCookie) {
        setCookie(cookieName, result.locale, {
          path: "/",
          maxAge: cookieMaxAge,
          sameSite: "lax",
        });
      }

      // 5. Pass locale to route context
      return next({ context: { locale: result.locale } });
    },
  );
}
