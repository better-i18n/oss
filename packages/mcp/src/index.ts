#!/usr/bin/env node

/**
 * @better-i18n/mcp — stdio MCP server for Claude Code / Cursor / Codex.
 *
 * Bridges an MCP client (stdio) to Better i18n's remote MCP endpoint
 * (Streamable HTTP at https://mcp.better-i18n.com/mcp).
 *
 * Two auth modes:
 *   - OAuth (default): no key needed. First run opens your browser to
 *     sign in to Better i18n; tokens are cached in ~/.better-i18n and
 *     refreshed automatically on later runs.
 *   - API key: set BETTER_I18N_API_KEY=bi-… for headless tools (CI, scripts).
 *
 * The tool catalog is forwarded from the server — never hard-coded here,
 * so new tools ship on an API deploy without an npm release.
 *
 * Config:
 *   {
 *     "mcpServers": {
 *       "better-i18n": { "command": "npx", "args": ["-y", "@better-i18n/mcp@latest"] }
 *     }
 *   }
 *
 * Env / flags:
 *   --local / BETTER_I18N_LOCAL  → http://localhost:8788
 *   BETTER_I18N_MCP_URL          → explicit MCP endpoint host override
 *   BETTER_I18N_API_KEY          → use API-key auth instead of OAuth
 *   --debug / BETTER_I18N_DEBUG  → verbose stderr logging
 *   BETTER_I18N_OAUTH_PORT       → loopback callback port (default 8976)
 */

import { createRequire } from "node:module";
import { createServer, type Server as HttpServer } from "node:http";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { UnauthorizedError } from "@modelcontextprotocol/sdk/client/auth.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { NodeOAuthProvider } from "./oauth-provider.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { name: string; version: string };
const VERSION = pkg.version;

const LOCAL_MCP_URL = "http://localhost:8788";
const PROD_MCP_URL = "https://mcp.better-i18n.com";
// Distinct from @helpway/mcp (8976) so users running both bridges don't
// EADDRINUSE-collide. We additionally probe a small range when the
// preferred port is occupied — see waitForAuthCode below.
const DEFAULT_OAUTH_PORT = 8989;
const OAUTH_PORT_RANGE = 16;

function resolveConfig() {
  const argv = process.argv.slice(2);
  const local =
    argv.includes("--local") ||
    process.env.BETTER_I18N_LOCAL === "true" ||
    process.env.BETTER_I18N_LOCAL === "1";
  const mcpUrl =
    process.env.BETTER_I18N_MCP_URL || (local ? LOCAL_MCP_URL : PROD_MCP_URL);
  const apiKey = process.env.BETTER_I18N_API_KEY;
  const debug =
    process.env.BETTER_I18N_DEBUG === "true" || argv.includes("--debug");
  const oauthPort = Number(process.env.BETTER_I18N_OAUTH_PORT) || DEFAULT_OAUTH_PORT;
  return { mcpUrl, apiKey, debug, local, oauthPort };
}

function log(debug: boolean, ...args: unknown[]) {
  if (debug) console.error("[better-i18n-mcp]", ...args);
}

/**
 * Branded HTML for the OAuth loopback redirect — Better i18n login screen:
 * single logo, status card, light/dark aware.
 */
function renderCallbackPage(
  status: "success" | "error",
  detail?: string,
): string {
  const isSuccess = status === "success";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Better i18n MCP</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #111; }
  @media (prefers-color-scheme: dark) { body { background: #0a0a0a; color: #fafafa; } }
  .page { width: 480px; max-width: 100%; padding: 0 16px; text-align: center; }
  .logos { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .logo-circle { width: 64px; height: 64px; border-radius: 50%; border: 1px solid #e5e5e5; background: #fff; display: flex; align-items: center; justify-content: center; }
  @media (prefers-color-scheme: dark) { .logo-circle { border-color: #262626; background: #171717; } }
  h1 { font-size: 22px; font-weight: 600; margin-bottom: 24px; }
  .card { overflow: hidden; border-radius: 12px; border: 1px solid #e5e5e5; background: #fff; text-align: center; }
  @media (prefers-color-scheme: dark) { .card { border-color: #262626; background: #171717; } }
  .card-body { padding: 28px 24px; }
  .icon-wrap { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .icon-success { background: #ecfdf5; color: #059669; }
  @media (prefers-color-scheme: dark) { .icon-success { background: rgba(16,185,129,0.12); color: #34d399; } }
  .icon-error { background: #fef2f2; color: #dc2626; }
  @media (prefers-color-scheme: dark) { .icon-error { background: rgba(220,38,38,0.12); color: #f87171; } }
  .title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .desc { font-size: 13px; color: #6b7280; line-height: 1.5; }
  @media (prefers-color-scheme: dark) { .desc { color: #9ca3af; } }
  .footer { padding: 0 24px 20px; text-align: center; font-size: 12px; color: #9ca3af; }
  @media (prefers-color-scheme: dark) { .footer { color: #6b7280; } }
</style>
</head>
<body>
<div class="page">
  <div class="logos">
    <div class="logo-circle">
      <svg width="30" height="30" viewBox="0 0 42 42" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M28.7 0H12.8L0 12.8V28.7L12.8 41.5H28.7L41.5 28.7V12.8L28.7 0ZM15 28.9L6.80002 20.7L15 12.5C18.1 9.4 23.2 9.4 26.3 12.5L34.5 20.7L26.3 28.9C23.2 32 18.2 32 15 28.9Z" fill="currentColor"/></svg>
    </div>
  </div>

  <h1>${isSuccess ? "Better i18n connected" : "Connection failed"}</h1>

  <div class="card">
    <div class="card-body">
      <div class="icon-wrap ${isSuccess ? "icon-success" : "icon-error"}">
        ${
          isSuccess
            ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
            : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        }
      </div>
      <p class="title">${isSuccess ? "You're all set" : "Something went wrong"}</p>
      <p class="desc">${isSuccess ? "You can close this tab and return to your editor." : detail || "No authorization code was received. Please try connecting again."}</p>
    </div>
    <p class="footer">${isSuccess ? "Your AI client is now connected to Better i18n." : "If this keeps happening, check that you're signed in to Better i18n."}</p>
  </div>
</div>
</body>
</html>`;
}

/**
 * Try to bind the given HTTP server to `port`. Resolves cleanly when
 * listening; rejects with the underlying error otherwise.
 */
function tryListen(server: HttpServer, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (err: Error) => {
      server.off("listening", onListening);
      reject(err);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port);
  });
}

/**
 * Wait for the OAuth provider's loopback redirect, resolving with the
 * authorization code. The callback HTTP server is bound BEFORE the OAuth
 * dance starts so the actual port can be reflected in the OAuth client's
 * `redirect_uri`. If the preferred port is busy (e.g. another bridge
 * already running, or a stale Node process), we probe `OAUTH_PORT_RANGE`
 * consecutive ports and use the first free one.
 */
async function waitForAuthCode(preferredPort: number): Promise<{
  promise: Promise<string>;
  close: () => void;
  port: number;
}> {
  let resolveCode!: (code: string) => void;
  let rejectCode!: (err: Error) => void;
  const promise = new Promise<string>((res, rej) => {
    resolveCode = res;
    rejectCode = rej;
  });

  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://localhost:${preferredPort}`);
    if (url.pathname !== "/callback") {
      res.writeHead(404).end();
      return;
    }
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (code) {
      res.end(renderCallbackPage("success"));
      resolveCode(code);
    } else {
      res.end(renderCallbackPage("error", error ?? undefined));
      rejectCode(new Error(error ?? "Authorization failed"));
    }
  });

  let boundPort = -1;
  let lastError: Error | null = null;
  for (let p = preferredPort; p < preferredPort + OAUTH_PORT_RANGE; p++) {
    try {
      await tryListen(server, p);
      boundPort = p;
      break;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "EADDRINUSE" || code === "EACCES") continue;
      throw err;
    }
  }
  if (boundPort < 0) {
    const range = `${preferredPort}..${preferredPort + OAUTH_PORT_RANGE - 1}`;
    throw new Error(
      `No free loopback port in range ${range} for OAuth callback` +
        (lastError ? `: ${lastError.message}` : "") +
        ` — set BETTER_I18N_OAUTH_PORT to an open port.`,
    );
  }
  return { promise, close: () => server.close(), port: boundPort };
}

/**
 * Connect an SDK Client to the remote MCP endpoint, performing the OAuth
 * dance interactively if needed. Returns the connected client.
 */
async function connectRemote(
  cfg: ReturnType<typeof resolveConfig>,
): Promise<Client> {
  const url = new URL(`${cfg.mcpUrl}/mcp`);
  const client = new Client(
    { name: "better-i18n-bridge", version: VERSION },
    { capabilities: {} },
  );

  // API-key mode: simple bearer header, no OAuth.
  if (cfg.apiKey) {
    const transport = new StreamableHTTPClientTransport(url, {
      requestInit: { headers: { Authorization: `Bearer ${cfg.apiKey}` } },
    });
    await client.connect(transport);
    log(
      cfg.debug,
      `connected to ${cfg.mcpUrl}${cfg.local ? " (local)" : ""} via API key`,
    );
    return client;
  }

  // OAuth mode. Bind the loopback callback server FIRST so we know the
  // actual port (and can collision-recover via OAUTH_PORT_RANGE). The
  // OAuth client's redirect_uri then reflects the real bound port,
  // matching exactly what the browser will be told to call back to.
  const callback = await waitForAuthCode(cfg.oauthPort);
  if (callback.port !== cfg.oauthPort) {
    log(
      cfg.debug,
      `loopback port ${cfg.oauthPort} unavailable; using ${callback.port}`,
    );
  }
  const redirectUrl = `http://localhost:${callback.port}/callback`;
  const authProvider = new NodeOAuthProvider({ mcpUrl: cfg.mcpUrl, redirectUrl });

  const makeTransport = () =>
    new StreamableHTTPClientTransport(url, { authProvider });

  // Cached-token path: tries to connect; if the server rejects, falls
  // through to the interactive dance below.
  try {
    await client.connect(makeTransport());
    callback.close();
    log(
      cfg.debug,
      `connected to ${cfg.mcpUrl}${cfg.local ? " (local)" : ""} via cached OAuth token`,
    );
    return client;
  } catch (err) {
    if (!(err instanceof UnauthorizedError)) {
      callback.close();
      throw err;
    }
  }

  // Interactive: provider already opened the browser via redirectToAuthorization
  // during the failed connect. Catch the loopback redirect, finish auth, reconnect.
  let code: string;
  try {
    code = await callback.promise;
  } finally {
    callback.close();
  }

  const transport = makeTransport();
  await transport.finishAuth(code);
  await client.connect(transport);
  log(
    cfg.debug,
    `connected to ${cfg.mcpUrl}${cfg.local ? " (local)" : ""} via OAuth (fresh login)`,
  );
  return client;
}

async function main() {
  const cfg = resolveConfig();
  const remote = await connectRemote(cfg);

  const server = new Server(
    { name: "better-i18n", version: VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await remote.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return (await remote.callTool({
      name: request.params.name,
      arguments: request.params.arguments,
    })) as never;
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  log(cfg.debug, `bridge ready (v${VERSION})`);
}

main().catch((err) => {
  console.error(
    "[better-i18n-mcp] fatal:",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
});
