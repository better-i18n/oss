// Custom Cloudflare Worker entry point that wraps TanStack Start

// Import the TanStack Start server (relative path from dist/worker-entry.js)
import tanstack from "./server/server.js";

/** Paths that should never be edge-cached (API routes, etc.) */
const NO_CACHE_PREFIXES = ["/api/"];

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
