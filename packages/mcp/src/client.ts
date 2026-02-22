/**
 * tRPC client for Better i18n API with API key authentication
 */

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { APIClient } from "@better-i18n/mcp-types";

export interface ClientConfig {
  apiUrl: string;
  apiKey: string;
  debug?: boolean;
  /**
   * Custom fetch function (e.g. Service Binding's fetch for Worker-to-Worker calls).
   * When provided, bypasses the global fetch.
   */
  customFetch?: (
    input: Request | string | URL,
    init?: RequestInit,
  ) => Promise<Response>;
  /**
   * Service auth for MCP Worker → API Worker calls via Service Binding.
   * When provided, sends X-MCP-Service-Key + X-MCP-User-Id headers
   * instead of x-api-key.
   */
  serviceAuth?: {
    serviceKey: string;
    userId: string;
  };
}

/**
 * Type-safe tRPC client for MCP server usage.
 * Uses the APIClient type from @better-i18n/mcp-types for full type safety.
 */
export type BetterI18nClient = APIClient;

/**
 * Create a tRPC client authenticated with API key
 *
 * @param config - API URL, API key, and optional organization ID
 * @returns Configured tRPC client with full type safety
 */
export function createBetterI18nClient(
  config: ClientConfig & { organizationId?: string },
): BetterI18nClient {
  // Ensure URL ends with /api/trpc for tRPC endpoint
  const url = config.apiUrl.endsWith("/api/trpc")
    ? config.apiUrl
    : `${config.apiUrl.replace(/\/$/, "")}/api/trpc`;

  if (config.debug) {
    console.error(`[better-i18n] tRPC endpoint: ${url}`);
  }

  // Track logged requests to avoid duplicate logs (tRPC batching can call headers multiple times)
  let lastLoggedUrl = "";

  // tRPC requires the actual Router type for createTRPCClient<T>.
  // Since the router is in the private platform repo, we can't import it here.
  // Instead, we use 'any' for tRPC's generic and cast the result to our
  // APIClient interface which provides equivalent type safety for consumers.
  // This is a standard pattern for external/standalone tRPC clients.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = createTRPCClient<any>({
    links: [
      httpBatchLink({
        url,
        headers: () => {
          const headers: Record<string, string> = config.serviceAuth
            ? {
                "x-mcp-service-key": config.serviceAuth.serviceKey,
                "x-mcp-user-id": config.serviceAuth.userId,
              }
            : {
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

          const fetchFn = config.customFetch ?? fetch;
          const response = await fetchFn(input as Request | string | URL, init);

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

  return client as unknown as APIClient;
}
