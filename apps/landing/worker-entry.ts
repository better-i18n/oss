// Custom Cloudflare Worker entry point that wraps TanStack Start

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";
import { detectLocale, getLocales } from "@better-i18n/use-intl/server";

const PROJECT = "better-i18n/landing";
const DEFAULT_LOCALE = "en";
const BYPASS_SEGMENTS = new Set(["api"]);

// Cloudflare Worker isolate'ı istek başına değil, isolate başına init'lenir → module cache çalışır
let _locales: string[] | null = null;
let _localesTTL = 0;

async function getCachedLocales(): Promise<string[]> {
  if (_locales && Date.now() < _localesTTL) return _locales;
  try {
    _locales = await getLocales({ project: PROJECT });
    _localesTTL = Date.now() + 5 * 60_000;
  } catch {
    _locales = _locales ?? [DEFAULT_LOCALE];
  }
  return _locales!;
}

export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment && !BYPASS_SEGMENTS.has(firstSegment)) {
      const locales = await getCachedLocales();
      if (!locales.includes(firstSegment)) {
        const locale = detectLocale({
          request,
          availableLocales: locales,
          defaultLocale: DEFAULT_LOCALE,
        });
        return Response.redirect(
          new URL(
            `/${locale}${url.pathname}${url.search}${url.hash}`,
            url.origin
          ).href,
          301
        );
      }
    }

    const response = await tanstack.fetch(request, env, ctx);

    // Clone the response to add security headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
