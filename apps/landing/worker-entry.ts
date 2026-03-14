// Custom Cloudflare Worker entry point that wraps TanStack Start

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";

/** Paths that should never be edge-cached (API routes, etc.) */
const NO_CACHE_PREFIXES = ["/api/"];

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
  // Cluster A: International SEO (9 → 1)
  ["i18n/multilingual-seo", "i18n/international-seo"],
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
  // Locale codes are 2-3 chars (en, de, zh, etc.)
  if (locale.length < 2 || locale.length > 3) return null;

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

export default {
  async fetch(
    request: Request,
    env: Record<string, unknown>,
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

    const response = await tanstack.fetch(request, env, ctx);

    // Clone the response to add security + cache headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    newHeaders.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; img-src 'self' https://og.better-i18n.com https://cdn.better-i18n.com data: https:; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://cdn.better-i18n.com https://www.google-analytics.com https://*.better-i18n.com; frame-src https://www.googletagmanager.com;"
    );

    const cacheControl = getCacheControl(request, response);
    if (cacheControl) {
      newHeaders.set("Cache-Control", cacheControl);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
