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
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseProjectId(projectId: string): ProjectScope | null {
  if (projectId.includes("/")) {
    const parts = projectId.split("/");
    if (parts.length === 2 && parts[0] && parts[1]) {
      return { orgSlug: parts[0], projectSlug: parts[1] };
    }
  }
  if (UUID_RE.test(projectId)) {
    return null;
  }
  throw new Error(
    `Invalid projectId "${projectId}". Use "org/project" slug (e.g. "nomadvibe/packervibe") or a project UUID.`,
  );
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
        headers: () => ({
          "x-api-key": config.apiKey,
        }),
        fetch: config.fetch ?? fetch,
      }),
    ],
  });

  return client as unknown as APIClient;
}
