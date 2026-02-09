import type {
  ContentClient,
  ContentEntry,
  ContentEntryListItem,
  ContentModel,
  ListEntriesOptions,
  GetEntryOptions,
  PaginatedResponse,
} from "./types";

/**
 * Creates a content client that fetches from the REST API.
 *
 * This mode supports filtering, pagination, and real-time data (no caching lag).
 * Requires an API key for authentication via the `x-api-key` header.
 *
 * URL patterns:
 * - Models: `{apiBase}/api/v1/content/{org}/{project}/models`
 * - Entries: `{apiBase}/api/v1/content/{org}/{project}/models/{model}/entries`
 * - Entry: `{apiBase}/api/v1/content/{org}/{project}/models/{model}/entries/{slug}`
 */
export function createContentAPIClient(
  apiBase: string,
  org: string,
  project: string,
  apiKey: string,
): ContentClient {
  const base = `${apiBase}/api/v1/content/${org}/${project}`;
  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    "content-type": "application/json",
  };

  return {
    async getModels(): Promise<ContentModel[]> {
      const res = await fetch(`${base}/models`, { headers });
      if (!res.ok) {
        throw new Error(`API error fetching models: ${res.status}`);
      }
      return res.json();
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
      const qs = params.toString() ? `?${params}` : "";

      const res = await fetch(
        `${base}/models/${modelSlug}/entries${qs}`,
        { headers },
      );
      if (!res.ok) {
        throw new Error(
          `API error fetching entries for ${modelSlug}: ${res.status}`,
        );
      }
      const data = await res.json() as { items: ContentEntryListItem[]; total: number; hasMore: boolean };
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
      const qs = params.toString() ? `?${params}` : "";

      const res = await fetch(
        `${base}/models/${modelSlug}/entries/${entrySlug}${qs}`,
        { headers },
      );
      if (!res.ok) {
        throw new Error(
          `API error fetching entry ${modelSlug}/${entrySlug}: ${res.status}`,
        );
      }
      return res.json();
    },
  };
}
