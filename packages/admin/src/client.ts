import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { APIClient } from "@better-i18n/mcp-types";

export interface AdminClientConfig {
  apiKey: string;
  projectId: string;
  apiUrl?: string;
  debug?: boolean;
  fetch?: typeof fetch;
}

export interface ProjectScope {
  orgSlug: string;
  projectSlug: string;
}

const DEFAULT_API_URL = "https://api.better-i18n.com";

export function parseProjectId(projectId: string): ProjectScope {
  const parts = projectId.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `Invalid projectId "${projectId}". Expected "org/project" format (e.g. "nomadvibe/packervibe").`,
    );
  }
  return { orgSlug: parts[0], projectSlug: parts[1] };
}

export function createAPIClient(config: AdminClientConfig): APIClient {
  const baseUrl = (config.apiUrl ?? DEFAULT_API_URL).replace(/\/$/, "");
  const url = baseUrl.endsWith("/api/trpc")
    ? baseUrl
    : `${baseUrl}/api/trpc`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = createTRPCClient<any>({
    links: [
      httpBatchLink({
        url,
        headers: () => {
          const headers: Record<string, string> = {
            "x-api-key": config.apiKey,
          };
          return headers;
        },
        fetch: config.fetch ?? fetch,
      }),
    ],
  });

  return client as unknown as APIClient;
}
