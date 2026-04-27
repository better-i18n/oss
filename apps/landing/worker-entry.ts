// Custom Cloudflare Worker entry point that wraps TanStack Start.
//
// Responsibilities (keep this list short — static headers are the _headers
// file's job, not this worker's):
//   1. Edge-level 301 SEO redirects for consolidated/removed pages.
//   2. Markdown content negotiation — serve llms.txt when an agent asks for
//      text/markdown on any page.
//   3. Extension-less /.well-known/* aliases that would otherwise be caught
//      by TanStack's locale-redirect logic.
//   4. STATIC_FILE_RE short-circuit so hashed assets never hit SSR.
//   4b. Prerender passthrough — serve the build-time SSG HTML for marketing
//       pages directly from ASSETS when it exists, skipping SSR entirely.
//   5. Geo header injection + TanStack Start delegation for real HTML.
//
// Everything header-related (CSP, HSTS, Link, cache TTLs, CORS for the
// agent-discovery surface) lives in public/_headers and is applied by
// Cloudflare at the edge. Keeping those as a reviewable static artifact
// mirrors how we ship CMS content and avoids touching this file every
// time a third-party script origin changes.

import tanstack from "./server/server.js";

/**
 * Static file extensions that should be served directly from ASSETS.
 * If not found in ASSETS, return 404 immediately — never let TanStack's
 * locale-redirect logic catch these paths (e.g. /favicon.png → /tr/favicon.png).
 */
const STATIC_FILE_RE =
  /\.(?:png|ico|svg|webp|jpg|jpeg|gif|webmanifest|txt|xml|woff2?|ttf|otf|map|json|md|js|mjs|css|avif)$/i;

/**
 * Well-known paths that live on a different issuer host (e.g. the OAuth
 * authorization server is `dash.better-i18n.com`, not this marketing origin).
 * RFC 8414 requires the discovery document to sit on the issuer's origin,
 * so publishing a static copy here would fail strict validators — instead
 * issue a permanent redirect so agents follow the pointer to the real doc.
 */
const WELL_KNOWN_REDIRECTS = new Map<string, string>([
  [
    "/.well-known/oauth-authorization-server",
    "https://api.better-i18n.com/.well-known/oauth-authorization-server",
  ],
]);

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
  [
    "/.well-known/oauth-protected-resource",
    {
      path: "/.well-known/oauth-protected-resource.json",
      contentType: "application/json",
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

/** ASSETS binding type from wrangler.jsonc */
interface Env {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
  [key: string]: unknown;
}

/**
 * Headers applied to worker-returned SSR HTML responses.
 *
 * `public/_headers` covers every path served by Cloudflare Assets directly,
 * including env.ASSETS.fetch() pass-throughs. But Cloudflare does NOT merge
 * the _headers file onto responses constructed inside the worker — once
 * tanstack.fetch() returns a new Response, the edge treats it as
 * Worker-generated and sends it unchanged. Mirror the _headers security
 * + discovery payload here so HTML pages (/en/, /tr/blog/..., etc.) get the
 * same policy the static surface already has.
 *
 * Keep this list in sync with public/_headers — both files should describe
 * the same security posture. If they drift, the scanner will start reporting
 * missing headers on HTML URLs.
 */
const HTML_RESPONSE_HEADERS: ReadonlyArray<readonly [string, string]> = [
  ["Strict-Transport-Security", "max-age=31536000; includeSubDomains"],
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "SAMEORIGIN"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  [
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai",
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai",
      "img-src 'self' https://*.better-i18n.com https://api.helpway.ai data: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' https://*.better-i18n.com data:",
      "media-src 'self' https://*.better-i18n.com",
      "connect-src 'self' https://*.better-i18n.com https://www.google-analytics.com https://static.cloudflareinsights.com https://api.helpway.ai wss://api.helpway.ai",
      "frame-src https://www.googletagmanager.com https://api.helpway.ai",
    ].join("; "),
  ],
  [
    "Link",
    [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</.well-known/mcp/server-card.json>; rel="mcp-server-card"',
      '</.well-known/agent-skills/index.json>; rel="agent-skills"',
      '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
      '<https://api.better-i18n.com/.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
      '</llms.txt>; rel="alternate"; type="text/plain"',
      '<https://docs.better-i18n.com>; rel="service-doc"',
    ].join(", "),
  ],
] as const;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle SEO redirects before hitting TanStack — instant 301 at edge.
    const redirectTarget = getSeoRedirect(url.pathname);
    if (redirectTarget) {
      return new Response(null, {
        status: 301,
        headers: { Location: `${url.origin}${redirectTarget}` },
      });
    }

    // 2. Markdown content negotiation for agents (Cloudflare "Markdown for
    // Agents" pattern). When an agent sends Accept: text/markdown without
    // also accepting HTML, serve our llms.txt as the markdown representation
    // of any page. Browsers always send text/html so they never take this
    // branch.
    const acceptHeader = request.headers.get("Accept") || "";
    const wantsMarkdown =
      acceptHeader.includes("text/markdown") &&
      !acceptHeader.includes("text/html");
    if (wantsMarkdown && request.method === "GET") {
      try {
        const mdResponse = await env.ASSETS.fetch(
          new Request(`${url.origin}/llms.txt`, { method: "GET" }),
        );
        if (mdResponse.ok) {
          return new Response(mdResponse.body, {
            status: 200,
            headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              "Cache-Control":
                "public, s-maxage=300, stale-while-revalidate=3600",
              "Access-Control-Allow-Origin": "*",
              "X-Markdown-Source": "llms.txt",
            },
          });
        }
      } catch {
        // Fall through to normal handling if ASSETS is unavailable
      }
    }

    // 3a. Cross-origin /.well-known/* endpoints — 301 to the real issuer.
    // RFC 8414 + RFC 9728 put discovery on the issuer's origin; we only act
    // as a signpost from the marketing domain.
    const redirectUrl = WELL_KNOWN_REDIRECTS.get(url.pathname);
    if (redirectUrl) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: redirectUrl,
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 3b. Extension-less /.well-known/* endpoints — serve as aliased static
    // asset with the correct Content-Type. Must run BEFORE STATIC_FILE_RE
    // because these public URLs have no extension to match.
    const alias = WELL_KNOWN_ALIASES.get(url.pathname);
    if (alias) {
      try {
        const assetResponse = await env.ASSETS.fetch(
          new Request(`${url.origin}${alias.path}`, { method: "GET" }),
        );
        if (assetResponse.ok) {
          const h = new Headers(assetResponse.headers);
          h.set("Content-Type", alias.contentType);
          return new Response(assetResponse.body, { status: 200, headers: h });
        }
      } catch {
        // ASSETS.fetch failure — fall through to 404
      }
      return new Response("Not found", { status: 404 });
    }

    // 4. Static files short-circuit — return ASSETS response verbatim so
    // 304 Not Modified and other non-200 statuses propagate correctly.
    if (STATIC_FILE_RE.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 4b. Prerender passthrough — if the build produced a static index.html
    // for this locale+path, serve it directly from ASSETS with our security
    // headers layered on top. Skips a full TanStack SSR render (can be 1–7s
    // cold) and drops to the asset-handler floor (~50ms). SSR is only paid
    // for paths the build did not prerender (e.g. new blog posts published
    // after the last deploy — see the redeploy webhook in BETTER-xxx).
    //
    // Filters:
    //   - GET only: mutation requests + server-fn POSTs must hit SSR.
    //   - Trailing slash: TanStack routes canonicalise with a trailing slash,
    //     so the SSG output always lives at `${pathname}index.html`. Requests
    //     without a slash flow to SSR where the 307 redirect is issued.
    //   - Accept: text/html: server-fn GET calls and JSON navigations don't
    //     claim to accept HTML — those still reach SSR.
    if (
      request.method === "GET" &&
      url.pathname.endsWith("/") &&
      acceptHeader.includes("text/html")
    ) {
      try {
        const assetResponse = await env.ASSETS.fetch(
          new Request(`${url.origin}${url.pathname}index.html`, {
            method: "GET",
          }),
        );
        if (assetResponse.status === 200) {
          const h = new Headers(assetResponse.headers);
          for (const [k, v] of HTML_RESPONSE_HEADERS) h.set(k, v);
          if (!h.has("Cache-Control")) {
            h.set(
              "Cache-Control",
              "public, s-maxage=300, stale-while-revalidate=3600",
            );
          }
          h.set("X-Served-By", "prerender");
          return new Response(assetResponse.body, {
            status: 200,
            statusText: "OK",
            headers: h,
          });
        }
      } catch {
        // Asset handler unavailable — fall through to SSR
      }
    }

    // 5. Inject CF country code as a header so SSR can detect locale from geo
    // before handing off to TanStack.
    const cfCountry = (request as unknown as { cf?: { country?: string } }).cf
      ?.country;
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

    // Apply HTML_RESPONSE_HEADERS only when the response looks like an HTML
    // page — we don't want to layer CSP/Link onto JSON/image fallbacks that
    // tanstack might occasionally return for edge cases.
    const ct = response.headers.get("Content-Type") || "";
    if (!ct.includes("text/html")) return response;

    const h = new Headers(response.headers);
    for (const [k, v] of HTML_RESPONSE_HEADERS) h.set(k, v);
    // Short edge cache + stale-while-revalidate so published content reflows
    // across locales within a few minutes without blowing up on origin.
    if (!h.has("Cache-Control") && request.method === "GET" && response.status < 400) {
      h.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    }
    h.set("X-Served-By", "ssr");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: h,
    });
  },
};
