/**
 * worker.test.ts
 *
 * Tests for the Cloudflare Worker fetch handler exported from worker.ts.
 *
 * Strategy:
 *  - CORS, health, OAuth discovery, and auth-gate paths are pure HTTP
 *    logic and can be tested without any external services.
 *  - POST /mcp requests that pass auth will attempt to create a real
 *    tRPC client and MCP transport. Those calls will fail at the network
 *    layer (no live API), so we assert they do NOT return 401 (auth passed)
 *    and accept either a 4xx/5xx from the transport error path or a
 *    structured error response.
 */

import { describe, it, expect } from "vitest";
import worker from "./worker.js";
import type { Env } from "./worker.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = "https://mcp.test";

function makeRequest(
  path: string,
  method = "GET",
  headers: Record<string, string> = {},
  body?: string,
): Request {
  return new Request(`${BASE_URL}${path}`, {
    method,
    headers,
    body,
  });
}

/** Minimal Env with no service bindings */
const emptyEnv: Env = {};

/** Env with a fake AUTH_API service binding (for OAuth error path tests) */
const envWithFakeAuthApi: Env = {
  AUTH_API: {
    fetch: async () =>
      new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 }),
  },
  MCP_SERVICE_SECRET: "test-secret",
};

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

describe("Worker — CORS preflight", () => {
  it("OPTIONS returns 204 with CORS headers", async () => {
    const req = makeRequest("/mcp", "OPTIONS");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(res.headers.get("Access-Control-Allow-Headers")).toContain(
      "Authorization",
    );
  });

  it("OPTIONS on any path returns 204", async () => {
    const req = makeRequest("/health", "OPTIONS");
    const res = await worker.fetch(req, emptyEnv);
    expect(res.status).toBe(204);
  });
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

describe("Worker — health endpoint", () => {
  it("GET /health returns 200 with status ok", async () => {
    const req = makeRequest("/health");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.status).toBe("ok");
    expect(body.runtime).toBe("cloudflare-workers");
  });

  it("GET /health response has Content-Type application/json", async () => {
    const req = makeRequest("/health");
    const res = await worker.fetch(req, emptyEnv);
    expect(res.headers.get("Content-Type")).toContain("application/json");
  });
});

// ---------------------------------------------------------------------------
// OAuth discovery — Protected Resource Metadata (RFC 9728)
// ---------------------------------------------------------------------------

describe("Worker — OAuth discovery", () => {
  it("GET /.well-known/oauth-protected-resource returns 200 with required fields", async () => {
    const req = makeRequest("/.well-known/oauth-protected-resource");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toHaveProperty("resource");
    expect(body).toHaveProperty("authorization_servers");
    expect(body).toHaveProperty("bearer_methods_supported");
    expect(body.bearer_methods_supported).toContain("header");
  });

  it("GET /.well-known/oauth-protected-resource resource points to request host", async () => {
    const req = makeRequest("/.well-known/oauth-protected-resource");
    const res = await worker.fetch(req, emptyEnv);
    const body = (await res.json()) as Record<string, unknown>;

    expect(body.resource).toBe("https://mcp.test");
  });

  it("GET /.well-known/oauth-authorization-server returns 200 with required fields", async () => {
    const req = makeRequest("/.well-known/oauth-authorization-server");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(200);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toHaveProperty("issuer");
    expect(body).toHaveProperty("authorization_endpoint");
    expect(body).toHaveProperty("token_endpoint");
    expect(body).toHaveProperty("code_challenge_methods_supported");
  });

  it("GET /.well-known/oauth-authorization-server supports S256 PKCE", async () => {
    const req = makeRequest("/.well-known/oauth-authorization-server");
    const res = await worker.fetch(req, emptyEnv);
    const body = (await res.json()) as Record<string, unknown>;

    expect(body.code_challenge_methods_supported).toContain("S256");
  });
});

// ---------------------------------------------------------------------------
// MCP endpoint — authentication gate
// ---------------------------------------------------------------------------

describe("Worker — /mcp auth gate", () => {
  it("POST /mcp without Authorization header returns 401", async () => {
    const req = makeRequest("/mcp", "POST", {}, "{}");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(401);
  });

  it("POST /mcp without Authorization header has WWW-Authenticate header", async () => {
    const req = makeRequest("/mcp", "POST", {}, "{}");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.headers.get("WWW-Authenticate")).toBeTruthy();
    expect(res.headers.get("WWW-Authenticate")).toContain("Bearer");
  });

  it("POST /mcp with empty Authorization header returns 401", async () => {
    const req = makeRequest("/mcp", "POST", { Authorization: "" }, "{}");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(401);
  });

  it("POST /mcp with malformed Authorization (no Bearer prefix) returns 401", async () => {
    const req = makeRequest(
      "/mcp",
      "POST",
      { Authorization: "Basic abc123" },
      "{}",
    );
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(401);
  });

  it("GET /mcp without token returns 401", async () => {
    const req = makeRequest("/mcp", "GET");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// MCP endpoint — API key auth path (bi- prefix)
// ---------------------------------------------------------------------------

describe("Worker — /mcp API key auth (bi- prefix)", () => {
  it("GET /mcp with bi- prefix token returns 200 SSE stream", async () => {
    const req = makeRequest("/mcp", "GET", {
      Authorization: "Bearer bi-test-api-key",
    });
    const res = await worker.fetch(req, emptyEnv);

    // Auth passed — worker returns an SSE stream
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/event-stream");
  });

  it("GET /mcp SSE response has CORS headers when authenticated", async () => {
    const req = makeRequest("/mcp", "GET", {
      Authorization: "Bearer bi-abc",
    });
    const res = await worker.fetch(req, emptyEnv);

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("POST /mcp with bi- prefix token does not return 401 (auth passed)", async () => {
    const req = makeRequest(
      "/mcp",
      "POST",
      {
        Authorization: "Bearer bi-test-api-key",
        "Content-Type": "application/json",
      },
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
        params: {},
      }),
    );

    // The handler will attempt a real tRPC call and likely error at the
    // network layer, but it MUST NOT return 401 — the auth gate was passed.
    const res = await worker.fetch(req, emptyEnv);
    expect(res.status).not.toBe(401);
  });
});

// ---------------------------------------------------------------------------
// MCP endpoint — OAuth token path (no AUTH_API binding)
// ---------------------------------------------------------------------------

describe("Worker — /mcp OAuth token path", () => {
  it("POST /mcp with OAuth token but no AUTH_API returns 500", async () => {
    const req = makeRequest(
      "/mcp",
      "POST",
      {
        Authorization: "Bearer oauth-token-without-bi-prefix",
        "Content-Type": "application/json",
      },
      "{}",
    );

    // No AUTH_API service binding → explicit 500 error
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(500);
    const body = (await res.json()) as Record<string, unknown>;
    expect(typeof body.error).toBe("string");
    expect((body.error as string).toLowerCase()).toContain("oauth");
  });

  it("POST /mcp with OAuth token but only AUTH_API (no MCP_SERVICE_SECRET) returns 500", async () => {
    const envWithOnlyAuthApi: Env = {
      AUTH_API: {
        fetch: async () => new Response(JSON.stringify({}), { status: 200 }),
      },
      // MCP_SERVICE_SECRET intentionally omitted
    };
    const req = makeRequest(
      "/mcp",
      "POST",
      {
        Authorization: "Bearer some-oauth-token",
        "Content-Type": "application/json",
      },
      "{}",
    );

    const res = await worker.fetch(req, envWithOnlyAuthApi);
    expect(res.status).toBe(500);
  });

  it("POST /mcp with invalid OAuth token (AUTH_API returns 401) returns 401", async () => {
    const req = makeRequest(
      "/mcp",
      "POST",
      {
        Authorization: "Bearer expired-oauth-token",
        "Content-Type": "application/json",
      },
      "{}",
    );

    const res = await worker.fetch(req, envWithFakeAuthApi);
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Unknown paths
// ---------------------------------------------------------------------------

describe("Worker — unknown routes", () => {
  it("GET /unknown returns 404", async () => {
    const req = makeRequest("/unknown-path");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(404);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.error).toBeTruthy();
  });

  it("GET / returns 404", async () => {
    const req = makeRequest("/");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(404);
  });

  it("POST /webhook returns 404", async () => {
    const req = makeRequest("/webhook", "POST", {}, "{}");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(404);
  });

  it("404 response has CORS headers", async () => {
    const req = makeRequest("/not-a-real-endpoint");
    const res = await worker.fetch(req, emptyEnv);

    expect(res.status).toBe(404);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
