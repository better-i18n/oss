/**
 * Better i18n MCP Content Server — Cloudflare Worker
 *
 * Streamable HTTP transport using Web Standard APIs.
 * Deploy to Cloudflare Workers for a hosted MCP endpoint
 * compatible with OpenAI ChatGPT, Codex CLI, and Agents SDK.
 *
 * Authentication:
 *   - OAuth 2.1 (ChatGPT): Full OAuth flow via Better Auth MCP plugin.
 *     OAuth tokens are validated via Service Binding, then the Worker
 *     calls the API using service auth (X-MCP-Service-Key + X-MCP-User-Id).
 *   - Bearer token (Codex/Agents SDK): Direct API key in Authorization header
 *
 * Deploy:
 *   npm run deploy
 *
 * Usage:
 *   MCP Server URL: https://mcp-content.better-i18n.com/mcp
 */

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createConfiguredServer, createBetterI18nClient } from "./server.js";

/** CF Workers Service Binding — provides direct Worker-to-Worker fetch */
interface Fetcher {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

export interface Env {
  BETTER_I18N_API_URL?: string;
  /** Public auth URL used in OAuth metadata (e.g. https://dash.better-i18n.com) */
  BETTER_I18N_AUTH_URL?: string;
  /**
   * Service Binding to the API worker (betteri18n-api).
   * Used for direct Worker-to-Worker calls, bypassing CF same-zone
   * subrequest limitation that returns SPA HTML instead of API responses.
   */
  AUTH_API?: Fetcher;
  /**
   * Shared secret for service-to-service authentication.
   * Must match MCP_SERVICE_SECRET in the API worker.
   */
  MCP_SERVICE_SECRET?: string;
}

/** API key prefix used by Better Auth apiKey plugin */
const API_KEY_PREFIX = "bi-";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

function corsResponse(
  status: number,
  body?: object,
  extraHeaders?: Record<string, string>,
): Response {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

function extractBearerToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/**
 * Resolved authentication — either a direct API key or service auth (userId).
 */
type ResolvedAuth =
  | { type: "apiKey"; apiKey: string }
  | { type: "serviceAuth"; userId: string };

/**
 * Validate an OAuth access token and extract the user ID.
 *
 * Uses the MCP plugin's get-session endpoint via Service Binding
 * (direct Worker-to-Worker call, bypassing CF same-zone issue).
 */
async function resolveOAuthUserId(
  token: string,
  authApi: Fetcher,
): Promise<{ userId: string } | { error: string; status: number }> {
  try {
    const res = await authApi.fetch(
      new Request("https://auth/api/auth/mcp/get-session", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );

    const rawBody = await res.text();
    console.log(
      `[mcp-content] get-session response: status=${res.status} body=${rawBody.slice(0, 500)}`,
    );

    if (!res.ok) {
      return { error: "Invalid or expired OAuth token", status: 401 };
    }

    let data: { userId?: string; user?: { id?: string } } | null;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return { error: "Invalid session response", status: 502 };
    }

    // get-session returns the token record with userId at top level
    const userId = data?.userId ?? data?.user?.id;
    if (!userId) {
      return { error: "Invalid session", status: 401 };
    }

    return { userId };
  } catch {
    return { error: "Failed to validate OAuth token", status: 502 };
  }
}

/**
 * Handle an MCP request over Streamable HTTP.
 */
async function handleMcpRequest(
  request: Request,
  auth: ResolvedAuth,
  env: Env,
): Promise<Response> {
  const apiUrl = env.BETTER_I18N_API_URL || "https://dash.better-i18n.com";

  const apiClient =
    auth.type === "apiKey"
      ? createBetterI18nClient({
          apiUrl,
          apiKey: auth.apiKey,
          debug: false,
        })
      : createBetterI18nClient({
          apiUrl: "https://internal", // domain doesn't matter for Service Binding
          apiKey: "service-auth", // unused, but required by type
          debug: false,
          serviceAuth: {
            serviceKey: env.MCP_SERVICE_SECRET || "",
            userId: auth.userId,
          },
          customFetch: (input, init) =>
            env.AUTH_API!.fetch(
              new Request(input as string | URL, init),
            ),
        });

  const server = createConfiguredServer(apiClient);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });

  await server.connect(transport);

  const response = await transport.handleRequest(request);

  // Inject CORS headers into the transport's response
  const corsified = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      ...CORS_HEADERS,
    },
  });

  // Clean up
  await transport.close();
  await server.close();

  return corsified;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const authUrl =
      env.BETTER_I18N_AUTH_URL ||
      env.BETTER_I18N_API_URL ||
      "https://dash.better-i18n.com";
    const mcpResourceUrl = `https://${url.host}`;

    // Log every request for debugging
    console.log(
      `[mcp-content] ${request.method} ${pathname} from ${request.headers.get("user-agent")?.slice(0, 80)}`,
    );

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ─── OAuth Discovery Endpoints (RFC 9728 / RFC 8414) ───
    // Both well-known endpoints are served from this worker (same origin).
    // OAuth action endpoints (register, token, etc.) point directly to the
    // auth server because CF Workers same-zone subrequests bypass the API
    // handler and return the SPA HTML instead. ChatGPT calls these endpoints
    // server-to-server from OpenAI's infrastructure, so cross-origin is fine.

    // Protected Resource Metadata — points to self as the authorization server
    if (pathname === "/.well-known/oauth-protected-resource") {
      return corsResponse(200, {
        resource: mcpResourceUrl,
        authorization_servers: [mcpResourceUrl],
        bearer_methods_supported: ["header"],
        scopes_supported: ["openid", "profile", "email", "offline_access"],
      });
    }

    // Authorization Server Metadata (RFC 8414)
    // All action endpoints point directly to the auth server.
    if (pathname === "/.well-known/oauth-authorization-server") {
      const authBase = `${authUrl}/api/auth/mcp`;
      return corsResponse(200, {
        issuer: mcpResourceUrl,
        authorization_endpoint: `${authBase}/authorize`,
        token_endpoint: `${authBase}/token`,
        registration_endpoint: `${authBase}/register`,
        revocation_endpoint: `${authBase}/revoke`,
        userinfo_endpoint: `${authBase}/userinfo`,
        jwks_uri: `${authBase}/jwks`,
        scopes_supported: ["openid", "profile", "email", "offline_access"],
        response_types_supported: ["code"],
        response_modes_supported: ["query"],
        grant_types_supported: ["authorization_code", "refresh_token"],
        token_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
          "none",
        ],
        code_challenge_methods_supported: ["S256"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256", "none"],
        claims_supported: [
          "sub",
          "iss",
          "aud",
          "exp",
          "nbf",
          "iat",
          "jti",
          "email",
          "email_verified",
          "name",
        ],
      });
    }

    // Health check
    if (pathname === "/health" && request.method === "GET") {
      return corsResponse(200, {
        status: "ok",
        transport: "streamable-http",
        runtime: "cloudflare-workers",
      });
    }

    // ─── MCP Endpoint ───

    if (pathname === "/mcp") {
      // Auth check for all methods (GET, POST, DELETE)
      const token = extractBearerToken(request);
      if (!token) {
        // 401 with WWW-Authenticate per MCP spec (RFC 9728 §5.1)
        return corsResponse(
          401,
          { error: "Authorization required" },
          {
            "WWW-Authenticate": `Bearer resource_metadata="${mcpResourceUrl}/.well-known/oauth-protected-resource"`,
          },
        );
      }

      // GET — SSE stream for server-initiated messages.
      // ChatGPT sends GET to establish an SSE connection before POST requests.
      // In stateless mode we never push events, but returning 405 causes
      // ChatGPT to fail tool discovery. Return an open SSE stream instead.
      if (request.method === "GET") {
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        // Send an SSE comment as initial heartbeat
        writer.write(new TextEncoder().encode(": ok\n\n"));
        // Keep the stream open — client disconnects when done
        return new Response(readable, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      }

      if (request.method === "POST" || request.method === "DELETE") {
        // Resolve token → auth context
        let auth: ResolvedAuth | { error: string; status: number };

        console.log(
          `[mcp-content] token: prefix=${token.slice(0, 8)}... len=${token.length}`,
        );

        if (token.startsWith(API_KEY_PREFIX)) {
          auth = { type: "apiKey", apiKey: token };
        } else if (env.AUTH_API && env.MCP_SERVICE_SECRET) {
          const result = await resolveOAuthUserId(token, env.AUTH_API);
          if ("error" in result) {
            auth = result;
          } else {
            auth = { type: "serviceAuth", userId: result.userId };
          }
        } else {
          auth = {
            error:
              "OAuth not available: AUTH_API service binding or MCP_SERVICE_SECRET not configured",
            status: 500,
          };
        }

        console.log(
          "[mcp-content] auth result:",
          JSON.stringify(
            "error" in auth
              ? { error: auth.error }
              : auth.type === "apiKey"
                ? { type: "apiKey" }
                : { type: "serviceAuth", userId: auth.userId },
          ),
        );

        if ("error" in auth) {
          return corsResponse(auth.status, { error: auth.error });
        }

        try {
          const body = await request.text();
          console.log("[mcp-content] request body:", body.slice(0, 500));

          // Reconstruct request with the body text
          const newRequest = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body,
          });

          const response = await handleMcpRequest(newRequest, auth, env);
          const responseBody = await response.clone().text();
          console.log("[mcp-content] response:", responseBody.slice(0, 500));
          return response;
        } catch (err) {
          console.error("[mcp-content] Error:", err);
          if (err instanceof Error && err.message.includes("Unauthorized")) {
            return corsResponse(401, { error: "Invalid API key" });
          }
          return corsResponse(500, { error: "Internal server error" });
        }
      }
    }

    return corsResponse(404, { error: "Not found" });
  },
};
