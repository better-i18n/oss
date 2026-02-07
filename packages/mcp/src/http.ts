#!/usr/bin/env node

/**
 * Better i18n MCP Server — HTTP transport
 *
 * Streamable HTTP transport for OpenAI ChatGPT custom apps,
 * Codex CLI, and Agents SDK integration.
 *
 * Authentication: Bearer token in Authorization header (API key).
 * Each request creates a fresh, stateless MCP server instance
 * authenticated with the provided API key.
 *
 * Usage:
 *   PORT=8808 better-i18n-mcp-http
 *
 * For stdio transport (Cursor, Claude Desktop), see index.ts.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  resolveConfig,
  createConfiguredServer,
  createBetterI18nClient,
} from "./server.js";

const config = resolveConfig();
const port = parseInt(process.env.PORT || "8808", 10);
const host = process.env.HOST || "0.0.0.0";

/**
 * Extract Bearer token from Authorization header.
 */
function extractBearerToken(req: IncomingMessage): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/**
 * Set CORS headers for browser-based clients.
 */
function setCorsHeaders(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Mcp-Session-Id",
  );
}

/**
 * Read and parse JSON body from an IncomingMessage.
 */
function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf-8");
        resolve(body ? JSON.parse(body) : undefined);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Handle an MCP request over HTTP.
 * Creates a per-request MCP server authenticated with the caller's API key.
 */
async function handleMcpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string,
) {
  const apiClient = createBetterI18nClient({
    apiUrl: config.apiUrl,
    apiKey,
    debug: config.debug,
  });

  const server = createConfiguredServer(apiClient);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });

  await server.connect(transport);

  // Pre-parse the body so the transport doesn't need to
  const parsedBody = req.method === "POST" ? await readJsonBody(req) : undefined;

  await transport.handleRequest(req, res, parsedBody);

  // Clean up after the request
  await transport.close();
  await server.close();
}

const httpServer = createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // Health check
  if (pathname === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", transport: "streamable-http" }));
    return;
  }

  // MCP endpoint
  if (pathname === "/mcp") {
    // GET requests for SSE stream don't need auth (they use session ID)
    // POST and DELETE need Bearer token
    if (req.method === "POST" || req.method === "DELETE") {
      const apiKey = extractBearerToken(req);
      if (!apiKey) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Missing Authorization header. Use: Authorization: Bearer <API_KEY>",
          }),
        );
        return;
      }

      try {
        await handleMcpRequest(req, res, apiKey);
      } catch (err) {
        console.error("[better-i18n-http] Error handling MCP request:", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal server error" }));
        }
      }
      return;
    }

    // GET for SSE — stateless mode doesn't support standalone SSE
    if (req.method === "GET") {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "SSE not supported in stateless mode. Use POST for requests.",
        }),
      );
      return;
    }
  }

  // 404 for everything else
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

httpServer.listen(port, host, () => {
  console.error(`[better-i18n-http] Mode: ${config.isLocalDev ? "LOCAL DEV" : "PRODUCTION"}`);
  console.error(`[better-i18n-http] API URL: ${config.apiUrl}`);
  console.error(`[better-i18n-http] MCP HTTP server listening on http://${host}:${port}/mcp`);
  console.error(`[better-i18n-http] Health check: http://${host}:${port}/health`);
});
