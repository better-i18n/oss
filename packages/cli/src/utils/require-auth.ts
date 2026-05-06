import { resolveAuth } from "./auth.js";
import { createTrpcCaller } from "./api-client.js";
import { red, cyan, dim } from "./colors.js";

export interface AuthenticatedContext {
  apiKey: string;
  apiUrl: string;
  trpc: ReturnType<typeof createTrpcCaller>;
}

export function requireAuth(options: {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
}): AuthenticatedContext {
  const auth = resolveAuth(options);

  if (!auth) {
    if (options.json) {
      console.log(JSON.stringify({ ok: false, error: "Not authenticated. Run `better-i18n login` first.", code: "NOT_AUTHENTICATED" }));
    } else {
      console.error(red("  Not authenticated."));
      console.error(dim(`  Run ${cyan("better-i18n login")} or pass ${cyan("--api-key")}.`));
    }
    process.exit(1);
  }

  return {
    apiKey: auth.apiKey,
    apiUrl: auth.apiUrl,
    trpc: createTrpcCaller({ apiKey: auth.apiKey, apiUrl: auth.apiUrl }),
  };
}

export function handleError(result: { ok: boolean; error?: string; code?: string }, json?: boolean): never {
  if (json) {
    console.log(JSON.stringify({ ok: false, error: result.error, code: result.code }));
  } else {
    console.error(red(`  Error: ${result.error}`));
  }
  process.exit(1);
}
