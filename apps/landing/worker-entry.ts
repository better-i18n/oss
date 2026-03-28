// Custom Cloudflare Worker entry point that wraps TanStack Start

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";

/** Paths that should never be edge-cached (API routes, etc.) */
const NO_CACHE_PREFIXES = ["/api/"];

/**
 * Static file extensions that should be served directly from ASSETS.
 * If not found in ASSETS, return 404 immediately — never let TanStack's
 * locale-redirect logic catch these paths (e.g. /favicon.png → /tr/favicon.png).
 */
const STATIC_FILE_RE = /\.(?:png|ico|svg|webp|jpg|jpeg|gif|webmanifest|txt|xml|woff2?|ttf|otf|map)$/i;

/**
 * SEO redirect map — consolidated/removed pages → pillar pages.
 * Source of truth: src/seo/redirects.ts (keep in sync).
 * Inline here because worker-entry.ts is bundled separately from the app.
 */
const SEO_REDIRECTS = new Map<string, string>([
  // Audience pages (10)
  ["for-marketers", "for-product-teams"],
  ["for-engineering-leaders", "for-developers"],
  ["for-content-teams", "for-product-teams"],
  ["for-mobile-teams", "for-developers"],
  ["for-designers", "for-product-teams"],
  ["for-freelancers", "for-agencies"],
  ["for-open-source", "for-developers"],
  ["for-gaming", "for-developers"],
  ["for-education", "for-enterprises"],
  ["for-healthcare", "for-enterprises"],
  // Cluster A: International SEO (8 archived pages → 1)
  ["i18n/multilingual-website-seo", "i18n/international-seo"],
  ["i18n/technical-multilingual-seo", "i18n/international-seo"],
  ["i18n/technical-international-seo", "i18n/international-seo"],
  ["i18n/global-market-seo", "i18n/international-seo"],
  ["i18n/seo-international-audiences", "i18n/international-seo"],
  ["i18n/international-seo-consulting", "i18n/international-seo"],
  ["i18n/local-seo-international", "i18n/international-seo"],
  ["i18n/ecommerce-global-seo", "i18n/international-seo"],
  // Cluster B: Localization Software (4 → 1)
  ["i18n/localization-tools", "i18n/localization-software"],
  ["i18n/localization-platforms", "i18n/localization-software"],
  ["i18n/localization-management", "i18n/localization-software"],
  ["i18n/formatting-utilities", "i18n/localization-software"],
  // Cluster C & D
  ["i18n/software-localization-services", "i18n/software-localization"],
  ["i18n/content-localization-services", "i18n/content-localization"],
  // Low-value / off-topic
  ["i18n/react-intl", "i18n"],
  ["i18n/security-compliance", "i18n"],
]);

/**
 * Check if the request path matches a removed page and return a 301 redirect.
 * Handles all locale prefixes: /{locale}/{removed-path}/ → /{locale}/{target-path}/
 */
function getSeoRedirect(pathname: string): string | null {
  // Strip leading slash, trailing slash, then extract locale + page path
  const clean = pathname.replace(/^\/+/, "").replace(/\/+$/, "");
  const parts = clean.split("/");
  if (parts.length < 2) return null;

  const locale = parts[0];
  // Locale codes are 2-7 chars (en, de, zh-hans, etc.)
  if (locale.length < 2 || locale.length > 7) return null;

  const pagePath = parts.slice(1).join("/");
  const target = SEO_REDIRECTS.get(pagePath);
  if (!target) return null;

  return `/${locale}/${target}/`;
}

/**
 * Determine Cache-Control for the response.
 * - Static assets already have cache headers from TanStack/Vite.
 * - HTML pages get short edge cache + stale-while-revalidate so
 *   Cloudflare serves stale while re-fetching in the background.
 * - API routes are not cached at the edge.
 */
function getCacheControl(
  request: Request,
  response: Response,
): string | null {
  const url = new URL(request.url);

  // Don't override existing cache headers (static assets, etc.)
  if (response.headers.has("Cache-Control")) return null;

  // Skip caching for API routes
  if (NO_CACHE_PREFIXES.some((p) => url.pathname.startsWith(p))) return null;

  // Skip caching for non-GET requests
  if (request.method !== "GET") return null;

  // Skip caching for error responses
  if (response.status >= 400) return null;

  // HTML pages: edge-cache 5 min, stale-while-revalidate 1 hour
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("text/html")) {
    return "public, s-maxage=300, stale-while-revalidate=3600";
  }

  return null;
}

/** ASSETS binding type from wrangler.jsonc */
interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
  [key: string]: unknown;
}

/**
 * Try to serve a pre-compressed Brotli version of the HTML response.
 *
 * Pre-compressed .html.br files are generated at build time with Brotli
 * quality 11 (~20-30% smaller than Cloudflare's default edge compression).
 * This function checks if:
 *   1. The response is HTML
 *   2. The client accepts Brotli encoding
 *   3. A .br asset exists for the resolved path
 *
 * Returns the compressed response if all conditions are met, or null to
 * signal the caller should use the original response.
 */
async function tryServeBrotli(
  request: Request,
  response: Response,
  env: Env,
): Promise<Response | null> {
  // Only compress HTML responses
  const contentType = response.headers.get("Content-Type") || "";
  if (!contentType.includes("text/html")) return null;

  // Only if client accepts Brotli
  const acceptEncoding = request.headers.get("Accept-Encoding") || "";
  if (!acceptEncoding.includes("br")) return null;

  // Only for successful GET responses
  if (request.method !== "GET" || response.status !== 200) return null;

  // Build the .br asset URL: /en/page/ → /en/page/index.html.br
  const url = new URL(request.url);
  const brPaths = url.pathname.endsWith("/")
    ? [`${url.pathname}index.html.br`]
    : [`${url.pathname}/index.html.br`, `${url.pathname}.br`];

  try {
    for (const brPath of brPaths) {
      const brResponse = await env.ASSETS.fetch(
        new Request(`${url.origin}${brPath}`, { method: "GET" }),
      );
      if (brResponse.ok) return brResponse;
    }
    return null;
  } catch {
    // ASSETS.fetch failure — fall back silently
    return null;
  }
}

/** Security headers applied to every response. */
const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "SAMEORIGIN"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  [
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' https://og.better-i18n.com https://cdn.better-i18n.com data: https:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://cdn.better-i18n.com https://www.google-analytics.com https://*.better-i18n.com; frame-src https://www.googletagmanager.com;",
  ],
] as const;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Handle SEO redirects before hitting TanStack — instant 301 at edge
    const url = new URL(request.url);
    const redirectTarget = getSeoRedirect(url.pathname);
    if (redirectTarget) {
      return new Response(null, {
        status: 301,
        headers: { Location: `${url.origin}${redirectTarget}` },
      });
    }

    // Static files: serve directly from ASSETS, never fall through to SSR.
    // This prevents locale-redirect logic from catching paths like /favicon.png.
    if (STATIC_FILE_RE.test(url.pathname)) {
      try {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.ok) return assetResponse;
      } catch {
        // ASSETS.fetch failure — fall through to 404
      }
      return new Response("Not found", { status: 404 });
    }

    // Inject CF country code as a header so SSR can detect locale from geo
    const cfCountry = (request as unknown as { cf?: { country?: string } }).cf?.country;
    let ssrRequest = request;
    if (cfCountry) {
      const headers = new Headers(request.headers);
      headers.set("X-Country", cfCountry);
      ssrRequest = new Request(request.url, {
        method: request.method,
        headers,
        body: request.body,
      });
    }

    const response = await tanstack.fetch(ssrRequest, env, ctx);

    // Try serving pre-compressed Brotli for HTML pages
    const brResponse = await tryServeBrotli(request, response, env);

    const finalBody = brResponse ? brResponse.body : response.body;
    const newHeaders = new Headers(response.headers);

    if (brResponse) {
      newHeaders.set("Content-Encoding", "br");
      newHeaders.set("Content-Type", "text/html; charset=utf-8");
      newHeaders.delete("Content-Length");
      // Vary on Accept-Encoding so caches store both versions
      newHeaders.set("Vary", "Accept-Encoding");
    }

    // Apply security headers
    for (const [key, value] of SECURITY_HEADERS) {
      newHeaders.set(key, value);
    }

    const cacheControl = getCacheControl(request, response);
    if (cacheControl) {
      newHeaders.set("Cache-Control", cacheControl);
    }

    return new Response(finalBody, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
