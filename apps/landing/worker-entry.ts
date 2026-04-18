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
const STATIC_FILE_RE =
  /\.(?:png|ico|svg|webp|jpg|jpeg|gif|webmanifest|txt|xml|woff2?|ttf|otf|map|json|md|js|mjs|css|avif)$/i;

/**
 * Agent-discovery endpoints under /.well-known/ that have NO file extension.
 * These would otherwise fall through to TanStack Start and get caught by
 * locale-redirect (→ 307 /tr/.well-known/...). Map each extension-less public
 * path to the static asset alias in ASSETS and serve it with the correct
 * Content-Type for agent consumption.
 */
const WELL_KNOWN_ALIASES = new Map<
  string,
  { path: string; contentType: string }
>([
  [
    "/.well-known/api-catalog",
    {
      path: "/.well-known/api-catalog.json",
      contentType: "application/linkset+json",
    },
  ],
]);

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

/** Security headers applied to every response. */
const SECURITY_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "SAMEORIGIN"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  [
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // script-src: GA/GTM for analytics, CF beacon for RUM, helpway widget
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai",
      // script-src-elem mirrors script-src because some browsers fall back
      // to script-src when elem isn't set — modern browsers like Chrome 125+
      // require elem to be explicit or they block every <script> element.
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai",
      "img-src 'self' https://og.better-i18n.com https://cdn.better-i18n.com https://api.helpway.ai data: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.better-i18n.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai https://*.better-i18n.com",
      "frame-src https://www.googletagmanager.com https://api.helpway.ai",
    ].join("; "),
  ],
] as const;

/**
 * RFC 8288 Link headers advertising agent-discovery endpoints.
 * Applied to every HTML response so crawling agents can find our
 * API catalog, MCP server card, agent skills index, and llms.txt
 * without probing well-known paths.
 */
const DISCOVERY_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
  '<https://docs.better-i18n.com>; rel="service-doc"',
  '<https://platform.better-i18n.com/v1>; rel="service"',
].join(", ");

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

    // Markdown content negotiation for agents (Cloudflare "Markdown for
    // Agents" pattern). When an agent sends `Accept: text/markdown` without
    // also accepting HTML, serve our llms.txt (a curated markdown digest of
    // the whole site) as the markdown representation of any page. Browsers
    // never hit this path because they always send `text/html` in Accept.
    //
    // Phase 2 (separate ticket) will add per-route build-time `.md` files
    // so each URL returns a page-specific markdown body. For now this
    // unblocks the scanner — which was hitting a 500 when TanStack's SSR
    // tried to render with a markdown-only Accept header.
    const acceptHeader = request.headers.get("Accept") || "";
    const wantsMarkdown =
      acceptHeader.includes("text/markdown") &&
      !acceptHeader.includes("text/html");
    if (wantsMarkdown && request.method === "GET") {
      try {
        const mdResponse = await env.ASSETS.fetch(
          new Request(`${url.origin}/llms.txt`, { method: "GET" })
        );
        if (mdResponse.ok) {
          const h = new Headers();
          h.set("Content-Type", "text/markdown; charset=utf-8");
          h.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
          h.set("Access-Control-Allow-Origin", "*");
          h.set("X-Markdown-Source", "llms.txt");
          return new Response(mdResponse.body, { status: 200, headers: h });
        }
      } catch {
        // Fall through to normal handling if ASSETS is unavailable
      }
    }

    // Agent-discovery endpoints without extensions — serve as aliased static
    // asset with the correct Content-Type (must run BEFORE STATIC_FILE_RE
    // since the public URL has no extension to match).
    const alias = WELL_KNOWN_ALIASES.get(url.pathname);
    if (alias) {
      try {
        const assetResponse = await env.ASSETS.fetch(
          new Request(`${url.origin}${alias.path}`, { method: "GET" })
        );
        if (assetResponse.ok) {
          const h = new Headers(assetResponse.headers);
          h.set("Content-Type", alias.contentType);
          h.set("Access-Control-Allow-Origin", "*");
          h.set("Cache-Control", "public, max-age=300");
          return new Response(assetResponse.body, { status: 200, headers: h });
        }
      } catch {
        // ASSETS.fetch failure — fall through to 404
      }
      return new Response("Not found", { status: 404 });
    }

    // Static files: serve directly from ASSETS, never fall through to SSR.
    // This prevents locale-redirect logic from catching paths like /favicon.png.
    if (STATIC_FILE_RE.test(url.pathname)) {
      // Return ASSETS response verbatim (including 304/404/etc). The previous
      // `if (assetResponse.ok)` guard was too strict: browsers send conditional
      // requests that legitimately come back as 304 Not Modified, and treating
      // those as failures and returning our own 404 broke all cached CSS/JS/
      // image/font loads — the site layout disintegrated because stylesheet
      // revalidation hits produced HTML 404 bodies instead of the real
      // "not modified" signal. Trust the asset server's own status.
      return env.ASSETS.fetch(request);
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

    // NOTE: the legacy `tryServeBrotli` pre-compressed shortcut was removed
    // after enabling `run_worker_first: true`. With worker-first routing CF
    // Assets already negotiates compression on the response coming back from
    // `tanstack.fetch`, and manually swapping in `.html.br` bodies on top of
    // that produced Content-Encoding mismatches that rendered pages as raw
    // binary. We now let CF's built-in brotli/zstd handle compression.
    const finalBody = response.body;
    const newHeaders = new Headers(response.headers);

    // Apply security headers
    for (const [key, value] of SECURITY_HEADERS) {
      newHeaders.set(key, value);
    }

    // Advertise agent-discovery endpoints via RFC 8288 Link header
    // (scoped to HTML responses — agents crawling pages will see it,
    // but we avoid polluting asset responses like /favicon.png).
    const responseContentType = newHeaders.get("Content-Type") || "";
    if (responseContentType.includes("text/html")) {
      newHeaders.set("Link", DISCOVERY_LINK_HEADER);
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
