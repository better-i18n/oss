/**
 * tRPC client for Better i18n API with API key authentication
 */

import {
  createTRPCClient,
  httpBatchLink,
} from "@trpc/client";

// Generic router type for untyped tRPC client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UntypedRouter = any;

export interface ClientConfig {
  apiUrl: string;
  apiKey: string;
  debug?: boolean;
}

/**
 * Loosely typed client for MCP server usage.
 * The MCP package runs standalone without API router types,
 * so we allow arbitrary nested property access on the tRPC client.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BetterI18nClient = Record<string, any>;

/**
 * Create a tRPC client authenticated with API key
 *
 * @param config - API URL, API key, and optional organization ID
 * @returns Configured tRPC client
 */
export function createBetterI18nClient(
  config: ClientConfig & { organizationId?: string },
) {
  // Ensure URL ends with /api/trpc for tRPC endpoint
  const url = config.apiUrl.endsWith("/api/trpc")
    ? config.apiUrl
    : `${config.apiUrl.replace(/\/$/, "")}/api/trpc`;

  if (config.debug) {
    console.error(`[better-i18n] tRPC endpoint: ${url}`);
  }

  // Track logged requests to avoid duplicate logs (tRPC batching can call headers multiple times)
  let lastLoggedUrl = "";

  return createTRPCClient<UntypedRouter>({
    links: [
      httpBatchLink({
        url,
        headers: () => {
          const headers: Record<string, string> = {
            "x-api-key": config.apiKey,
          };
          if (config.organizationId) {
            headers["x-organization-id"] = config.organizationId;
          }
          return headers;
        },
        fetch: async (input, init) => {
          const inputUrl = String(input);

          // Only log if this is a different request (avoid duplicate logs from tRPC batching)
          if (config.debug && inputUrl !== lastLoggedUrl) {
            lastLoggedUrl = inputUrl;

            // Parse the URL to show a cleaner log
            try {
              const parsedUrl = new URL(inputUrl);
              const procedure = parsedUrl.pathname.split("/").pop();
              console.error(`[better-i18n] → ${procedure}`);
            } catch {
              console.error(`[better-i18n] → ${inputUrl}`);
            }
          }

          const response = await fetch(input, init);

          if (config.debug && inputUrl === lastLoggedUrl) {
            if (response.ok) {
              console.error(`[better-i18n] ← ${response.status} OK`);
            } else {
              const clonedResponse = response.clone();
              try {
                const text = await clonedResponse.text();
                console.error(
                  `[better-i18n] ← ${response.status} ERROR: ${text.substring(0, 200)}`,
                );
              } catch {
                console.error(`[better-i18n] ← ${response.status} ERROR`);
              }
            }
          }

          return response;
        },
      }),
    ],
  });
}
