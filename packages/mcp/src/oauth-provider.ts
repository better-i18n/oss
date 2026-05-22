/**
 * Node OAuth client provider for the Better i18n MCP stdio bridge.
 *
 * Implements the SDK's OAuthClientProvider so the bridge can authenticate
 * via the browser consent flow instead of a pasted API key. State that
 * must survive across runs (dynamic client registration, tokens, PKCE
 * verifier) is persisted to ~/.better-i18n/, keyed by the MCP host so a
 * user can run against prod and local without clobbering credentials.
 *
 * No npm deps — pure Node built-ins. Browser is opened via the platform
 * opener; the redirect lands on a local loopback server (see index.ts).
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import type {
  OAuthClientInformationFull,
  OAuthClientMetadata,
  OAuthTokens,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import type { OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";

interface PersistedAuth {
  clientInformation?: OAuthClientInformationFull;
  tokens?: OAuthTokens;
  codeVerifier?: string;
}

function openBrowser(url: string) {
  const platform = process.platform;
  const cmd =
    platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args = platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    // Headless / no opener — fall through; the URL is also printed to stderr.
  }
}

export class NodeOAuthProvider implements OAuthClientProvider {
  private readonly file: string;
  private cache: PersistedAuth;
  private readonly _redirectUrl: string;

  constructor(opts: { mcpUrl: string; redirectUrl: string }) {
    const dir = join(homedir(), ".better-i18n");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    // Key the credential file by MCP host so prod/local don't collide.
    const hostKey = createHash("sha256")
      .update(opts.mcpUrl)
      .digest("hex")
      .slice(0, 12);
    this.file = join(dir, `mcp-auth-${hostKey}.json`);
    this.cache = this.read();
    this._redirectUrl = opts.redirectUrl;
  }

  private read(): PersistedAuth {
    try {
      if (!existsSync(this.file)) return {};
      return JSON.parse(readFileSync(this.file, "utf8")) as PersistedAuth;
    } catch {
      return {};
    }
  }

  private write() {
    try {
      writeFileSync(this.file, JSON.stringify(this.cache, null, 2), {
        mode: 0o600,
      });
    } catch (e) {
      console.error("[better-i18n-mcp] failed to persist auth:", e);
    }
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      client_name: "Better i18n MCP (CLI)",
      redirect_uris: [this._redirectUrl],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: "openid profile email offline_access",
    };
  }

  state(): string {
    return createHash("sha256")
      .update(`${Date.now()}-${Math.random()}`)
      .digest("hex")
      .slice(0, 24);
  }

  clientInformation(): OAuthClientInformationFull | undefined {
    return this.cache.clientInformation;
  }

  saveClientInformation(info: OAuthClientInformationFull): void {
    this.cache.clientInformation = info;
    this.write();
  }

  tokens(): OAuthTokens | undefined {
    return this.cache.tokens;
  }

  saveTokens(tokens: OAuthTokens): void {
    this.cache.tokens = tokens;
    this.write();
  }

  saveCodeVerifier(codeVerifier: string): void {
    this.cache.codeVerifier = codeVerifier;
    this.write();
  }

  codeVerifier(): string {
    if (!this.cache.codeVerifier) throw new Error("No PKCE code verifier saved");
    return this.cache.codeVerifier;
  }

  redirectToAuthorization(authorizationUrl: URL): void {
    const url = authorizationUrl.toString();
    console.error(
      "\n[better-i18n-mcp] Opening your browser to sign in to Better i18n…\n" +
        "If it doesn't open automatically, visit:\n" +
        `  ${url}\n`,
    );
    openBrowser(url);
  }

  /** Wipe persisted tokens — used when the server rejects them as expired
   * beyond refresh, so the next connect re-runs the consent flow. */
  clearTokens(): void {
    this.cache.tokens = undefined;
    this.cache.codeVerifier = undefined;
    this.write();
  }
}
