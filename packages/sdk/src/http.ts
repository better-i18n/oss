import type {
  ContentEntry,
  ContentEntryListItem,
  ContentModel,
  GetEntryOptions,
  ListEntriesOptions,
  PaginatedResponse,
} from "./types.js";

// ─── HTTP Client Interface ──────────────────────────────────────────

/** Low-level HTTP client used by both the legacy API and the query builder. */
export interface HttpClient {
  /** Make a raw GET request and return `{ data, error }` (never throws). */
  request<T>(path: string, params?: URLSearchParams): Promise<HttpResult<T>>;
  /** List content models. */
  getModels(): Promise<ContentModel[]>;
  /** List entries with legacy options. */
  getEntries(
    model: string,
    opts?: ListEntriesOptions,
  ): Promise<PaginatedResponse<ContentEntryListItem>>;
  /** Fetch a single entry by slug. */
  getEntry<CF extends Record<string, string | null> = Record<string, string | null>>(
    model: string,
    slug: string,
    opts?: GetEntryOptions,
  ): Promise<ContentEntry<CF>>;
}

export type HttpResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

// ─── Factory ────────────────────────────────────────────────────────

export function createHttpClient(
  apiBase: string,
  org: string,
  project: string,
  apiKey: string,
  debug = false,
): HttpClient {
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

  /** Internal fetch helper — throws on HTTP errors. */
  async function rawRequest<T>(url: string, label: string): Promise<T> {
    log(`→ ${label}`, url);
    const res = await fetch(url, { headers });
    log(`← ${res.status} ${res.statusText}`);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      log("  Error body:", body);
      throw new Error(`API error ${label}: ${res.status} ${body}`);
    }
    const data = (await res.json()) as T;
    log("  Response:", JSON.stringify(data).slice(0, 500));
    return data;
  }

  return {
    async request<T>(path: string, params?: URLSearchParams): Promise<HttpResult<T>> {
      const qs = params?.toString() ? `?${params}` : "";
      const url = `${base}${path}${qs}`;
      try {
        const data = await rawRequest<T>(url, `request(${path})`);
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },

    async getModels(): Promise<ContentModel[]> {
      return rawRequest<ContentModel[]>(`${base}/models`, "getModels");
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
      if (options?.fields?.length) params.set("fields", options.fields.join(","));
      const qs = params.toString() ? `?${params}` : "";

      const data = await rawRequest<{
        items: ContentEntryListItem[];
        total: number;
        hasMore: boolean;
      }>(`${base}/models/${modelSlug}/entries${qs}`, `getEntries(${modelSlug})`);

      return { items: data.items, total: data.total, hasMore: data.hasMore };
    },

    async getEntry<CF extends Record<string, string | null> = Record<string, string | null>>(
      modelSlug: string,
      entrySlug: string,
      options?: GetEntryOptions,
    ): Promise<ContentEntry<CF>> {
      const params = new URLSearchParams();
      if (options?.language) params.set("language", options.language);
      if (options?.expand?.length) params.set("expand", options.expand.join(","));
      if (options?.fields?.length) params.set("fields", options.fields.join(","));
      const qs = params.toString() ? `?${params}` : "";

      return rawRequest<ContentEntry<CF>>(
        `${base}/models/${modelSlug}/entries/${entrySlug}${qs}`,
        `getEntry(${modelSlug}/${entrySlug})`,
      );
    },
  };
}
