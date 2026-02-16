import type {
  ContentClient,
  ContentEntry,
  ContentEntryListItem,
  ContentModel,
  ListEntriesOptions,
  GetEntryOptions,
  PaginatedResponse,
} from "./types.js";

/**
 * Creates a content client that fetches from the REST API.
 *
 * This mode supports filtering, pagination, and real-time data (no caching lag).
 * Requires an API key for authentication via the `x-api-key` header.
 *
 * URL patterns:
 * - Models: `{apiBase}/v1/content/{org}/{project}/models`
 * - Entries: `{apiBase}/v1/content/{org}/{project}/models/{model}/entries`
 * - Entry: `{apiBase}/v1/content/{org}/{project}/models/{model}/entries/{slug}`
 */
export function createContentAPIClient(
  apiBase: string,
  org: string,
  project: string,
  apiKey: string,
  debug = false,
): ContentClient {
  const base = `${apiBase}/v1/content/${org}/${project}`;
  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    "content-type": "application/json",
  };

  const log = debug
    ? (...args: unknown[]) => console.log("[better-i18n]", ...args)
    : () => {};

  if (debug) {
    log("Client initialized", { apiBase, org, project, base });
  }

  async function request<T>(url: string, label: string): Promise<{ res: Response; data: T }> {
    log(`→ ${label}`, url);
    const res = await fetch(url, { headers });
    log(`← ${res.status} ${res.statusText}`);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      log("  Error body:", body);
      throw new Error(`API error ${label}: ${res.status} ${body}`);
    }
    const data = await res.json() as T;
    log("  Response:", JSON.stringify(data).slice(0, 500));
    return { res, data };
  }

  return {
    async getModels(): Promise<ContentModel[]> {
      const { data } = await request<ContentModel[]>(`${base}/models`, "getModels");
      return data;
    },

    async getEntries(
      modelSlug: string,
      options?: ListEntriesOptions,
    ): Promise<PaginatedResponse<ContentEntryListItem>> {
      const params = new URLSearchParams();
      if (options?.language) params.set("language", options.language);
      if (options?.status) params.set("status", options.status);
      if (options?.sort) params.set("sort", options.sort);
      if (options?.order) params.set("order", options.order);
      if (options?.page) params.set("page", String(options.page));
      if (options?.limit) params.set("limit", String(options.limit));
      if (options?.expand?.length) params.set("expand", options.expand.join(","));
      const qs = params.toString() ? `?${params}` : "";

      const { data } = await request<{ items: ContentEntryListItem[]; total: number; hasMore: boolean }>(
        `${base}/models/${modelSlug}/entries${qs}`,
        `getEntries(${modelSlug})`,
      );
      return {
        items: data.items,
        total: data.total,
        hasMore: data.hasMore,
      };
    },

    async getEntry<CF extends Record<string, string | null> = Record<string, string | null>>(
      modelSlug: string,
      entrySlug: string,
      options?: GetEntryOptions,
    ): Promise<ContentEntry<CF>> {
      const params = new URLSearchParams();
      if (options?.language) params.set("language", options.language);
      if (options?.expand?.length) params.set("expand", options.expand.join(","));
      const qs = params.toString() ? `?${params}` : "";

      const { data } = await request<ContentEntry<CF>>(
        `${base}/models/${modelSlug}/entries/${entrySlug}${qs}`,
        `getEntry(${modelSlug}/${entrySlug})`,
      );
      return data;
    },
  };
}
