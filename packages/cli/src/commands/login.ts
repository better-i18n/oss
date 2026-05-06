import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { URL } from "node:url";
import ora from "ora";
import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import {
  saveCredentials,
  loadCredentials,
  clearCredentials,
  getAuthFilePath,
  resolveAuth,
  type StoredCredentials,
} from "../utils/auth.js";
import { getSession } from "../utils/api-client.js";

const DEFAULT_API_URL = "https://dash.better-i18n.com";
const CALLBACK_PORT = 9876;

// ── Login ────────────────────────────────────────────────────────────

export interface LoginOptions {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
}

export async function loginCommand(options: LoginOptions): Promise<void> {
  const apiUrl = options.apiUrl || DEFAULT_API_URL;

  if (options.apiKey) {
    await loginWithApiKey(options.apiKey, apiUrl, options.json);
    return;
  }

  await loginWithBrowser(apiUrl, options.json);
}

async function loginWithApiKey(
  apiKey: string,
  apiUrl: string,
  json?: boolean,
): Promise<void> {
  const spinner = json ? null : ora("Verifying API key...").start();

  const result = await getSession(apiKey, apiUrl);

  if (!result.ok || !result.data) {
    spinner?.fail("Invalid API key");
    if (json) {
      console.log(JSON.stringify({ ok: false, error: "Invalid API key", code: "AUTH_FAILED" }));
    } else {
      console.error(red("  Could not authenticate with the provided API key."));
      console.error(dim("  Get your key from: https://dash.better-i18n.com/settings/api-keys"));
    }
    process.exit(1);
  }

  const { user } = result.data;
  const creds: StoredCredentials = {
    apiKey,
    email: user.email,
    userId: user.id,
    apiUrl,
    createdAt: new Date().toISOString(),
  };

  saveCredentials(creds);

  if (json) {
    console.log(JSON.stringify({ ok: true, data: { email: user.email, name: user.name } }));
  } else {
    spinner?.succeed(`Logged in as ${bold(user.email)}`);
    console.log(dim(`  Credentials saved to ${getAuthFilePath()}`));
  }
}

async function loginWithBrowser(apiUrl: string, json?: boolean): Promise<void> {
  const existing = loadCredentials();
  if (existing) {
    const check = await getSession(existing.apiKey, existing.apiUrl);
    if (check.ok && check.data) {
      if (json) {
        console.log(JSON.stringify({
          ok: true,
          data: { email: check.data.user.email, name: check.data.user.name, alreadyLoggedIn: true },
        }));
      } else {
        console.log();
        console.log(yellow(`  Already logged in as ${bold(check.data.user.email)}`));
        console.log(dim(`  Run ${cyan("better-i18n logout")} first to switch accounts.`));
      }
      return;
    }
  }

  if (json) {
    console.log(JSON.stringify({ ok: false, error: "Browser login not available in JSON mode. Use --api-key.", code: "BROWSER_REQUIRED" }));
    process.exit(1);
  }

  console.log();
  console.log(bold("  Better i18n CLI Login"));
  console.log();

  const callbackUrl = `http://localhost:${CALLBACK_PORT}/callback`;
  const loginUrl = `${apiUrl}/cli-auth?callback=${encodeURIComponent(callbackUrl)}`;

  const apiKeyPromise = startCallbackServer();

  console.log(`  Opening browser to log in...`);
  console.log();
  console.log(dim(`  If the browser doesn't open, visit:`));
  console.log(cyan(`  ${loginUrl}`));
  console.log();

  const openCmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "cmd"
        : "xdg-open";

  const openArgs =
    process.platform === "win32" ? ["/c", "start", loginUrl] : [loginUrl];

  execFile(openCmd, openArgs, () => {});

  const spinner = ora("Waiting for authentication...").start();

  try {
    const apiKey = await apiKeyPromise;
    spinner.text = "Verifying...";

    const result = await getSession(apiKey, apiUrl);
    if (!result.ok || !result.data) {
      spinner.fail("Authentication failed");
      console.error(red("  Received API key could not be verified."));
      process.exit(1);
    }

    const { user } = result.data;
    const creds: StoredCredentials = {
      apiKey,
      email: user.email,
      userId: user.id,
      apiUrl,
      createdAt: new Date().toISOString(),
    };

    saveCredentials(creds);
    spinner.succeed(`Logged in as ${bold(user.email)}`);
    console.log(dim(`  Credentials saved to ${getAuthFilePath()}`));
  } catch (err) {
    spinner.fail("Authentication timed out or failed");
    console.error(red(`  ${err instanceof Error ? err.message : String(err)}`));
    process.exit(1);
  }
}

function startCallbackServer(): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error("Login timed out after 5 minutes. Please try again."));
    }, 5 * 60 * 1000);

    const server = createServer((req, res) => {
      const url = new URL(req.url || "/", `http://localhost:${CALLBACK_PORT}`);

      if (url.pathname === "/callback") {
        const apiKey = url.searchParams.get("api_key") || url.searchParams.get("token");

        if (apiKey) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(renderCallbackPage("success"));
          clearTimeout(timeout);
          server.close();
          resolve(apiKey);
        } else {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(renderCallbackPage("error"));
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(CALLBACK_PORT, "127.0.0.1");

    server.on("error", (err: NodeJS.ErrnoException) => {
      clearTimeout(timeout);
      if (err.code === "EADDRINUSE") {
        reject(new Error(`Port ${CALLBACK_PORT} is in use. Close the other process and try again.`));
      } else {
        reject(err);
      }
    });
  });
}

// ── Logout ───────────────────────────────────────────────────────────

export interface LogoutOptions {
  json?: boolean;
}

export async function logoutCommand(options: LogoutOptions): Promise<void> {
  const removed = clearCredentials();

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: { removed } }));
    return;
  }

  if (removed) {
    console.log();
    console.log(green("  Logged out successfully."));
    console.log(dim(`  Credentials removed from ${getAuthFilePath()}`));
  } else {
    console.log();
    console.log(yellow("  Not logged in."));
  }
}

// ── Whoami ───────────────────────────────────────────────────────────

export interface WhoamiOptions {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
}

export async function whoamiCommand(options: WhoamiOptions): Promise<void> {
  const auth = resolveAuth(options);

  if (!auth) {
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: "Not logged in", code: "NOT_AUTHENTICATED" }));
    } else {
      console.log();
      console.log(yellow("  Not logged in."));
      console.log(dim(`  Run ${cyan("better-i18n login")} to authenticate.`));
    }
    process.exit(1);
  }

  const spinner = options.json ? null : ora("Checking session...").start();
  const result = await getSession(auth.apiKey, auth.apiUrl);

  if (!result.ok || !result.data) {
    spinner?.fail("Session expired or invalid");
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: "Session expired", code: "SESSION_EXPIRED" }));
    } else {
      console.error(dim(`  Run ${cyan("better-i18n login")} to re-authenticate.`));
    }
    process.exit(1);
  }

  const { user, session } = result.data;
  const creds = loadCredentials();

  if (options.json) {
    console.log(JSON.stringify({
      ok: true,
      data: {
        email: user.email,
        name: user.name,
        userId: user.id,
        source: auth.source,
        expiresAt: session.expiresAt,
      },
    }));
    return;
  }

  spinner?.stop();
  console.log();
  console.log(bold("  Better i18n CLI"));
  console.log();
  console.log(`  ${dim("Email:")}    ${user.email}`);
  console.log(`  ${dim("Name:")}     ${user.name}`);
  if (creds?.organizationName) {
    console.log(`  ${dim("Org:")}      ${creds.organizationName}`);
  }
  console.log(`  ${dim("Auth:")}     ${auth.source === "credentials" ? "~/.better-i18n/auth.json" : auth.source === "env" ? "BETTER_I18N_API_KEY env" : auth.source}`);
  console.log(`  ${dim("API:")}      ${auth.apiUrl}`);
  console.log();
}

// ── Callback HTML ────────────────────────────────────────────────────

function renderCallbackPage(status: "success" | "error"): string {
  const isSuccess = status === "success";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Better i18n CLI</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fafafa; color: #111; }
  @media (prefers-color-scheme: dark) { body { background: #0a0a0a; color: #fafafa; } }
  .page { width: 480px; max-width: 100%; padding: 0 16px; text-align: center; }
  .logos { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
  .logo-circle { width: 64px; height: 64px; border-radius: 50%; border: 1px solid #e5e5e5; background: #fff; display: flex; align-items: center; justify-content: center; }
  @media (prefers-color-scheme: dark) { .logo-circle { border-color: #262626; background: #171717; } }
  .arrow { color: #d1d5db; }
  @media (prefers-color-scheme: dark) { .arrow { color: #404040; } }
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
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:#525252"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
    </div>
    <svg width="55" height="11" viewBox="0 0 55 11" fill="none" class="arrow"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.94 5.96H.005V4.96H3.94v1zm5.91 0H5.91V4.96h3.94v1zm5.91 0h-3.94V4.96h3.94v1zm5.9 0h-3.93V4.96h3.94v1zm5.91 0H23.63V4.96h3.94v1zm5.91 0h-3.94V4.96h3.94v1zm5.9 0h-3.93V4.96h3.94v1zm5.91 0h-3.94V4.96h3.94v1zm7.91 0h-5.94V4.96h5.94v1z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M52.9 5.46l-3.88-3.88.71-.71 4.59 4.59-4.59 4.59-.71-.71 3.88-3.88z" fill="currentColor"/></svg>
    <div class="logo-circle">
      <svg width="28" height="28" viewBox="0 0 260 286" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M108 5.88c13.6-7.84 30.4-7.84 44 0l86 49.54c13.6 7.85 22 22.36 22 38.06v99.04c0 15.7-8.4 30.21-22 38.06l-86 49.54c-13.6 7.84-30.4 7.84-44 0l-86-49.55C8.39 222.73 0 208.22 0 192.52V93.48c0-15.7 8.39-30.21 22-38.06l86-49.54zm28.6 17.74c-4.95-2.86-11.05-2.86-16 0L54 62.07c-5.33 3.08-5.33 10.78 0 13.86l88.34 51c4.95 2.86 8 8.14 8 13.86v102c0 6.16 6.67 10.01 12 6.93l66.6-38.45c4.95-2.86 8-8.14 8-13.86V90.79c0-5.72-3.05-11-8-13.86l-92.34-53.31z" fill="currentColor"/></svg>
    </div>
  </div>

  <h1>${isSuccess ? "CLI authenticated" : "Authentication failed"}</h1>

  <div class="card">
    <div class="card-body">
      <div class="icon-wrap ${isSuccess ? "icon-success" : "icon-error"}">
        ${isSuccess
          ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
          : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        }
      </div>
      <p class="title">${isSuccess ? "You're all set" : "Something went wrong"}</p>
      <p class="desc">${isSuccess ? "You can close this tab and return to the terminal." : "No API key was received. Please try running <code>better-i18n login</code> again."}</p>
    </div>
    <p class="footer">${isSuccess ? "A new API key was created for CLI access." : "If the problem persists, use <code>better-i18n login --api-key</code> instead."}</p>
  </div>
</div>
</body>
</html>`;
}
