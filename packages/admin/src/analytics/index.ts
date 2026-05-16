import type { ViewsResponse, SingleViewResponse, StatsResponse, ViewsOptions } from "../types.js";
import type { ProjectScope } from "../client.js";

export interface AnalyticsClientConfig {
  apiKey: string;
  contentApiUrl?: string;
}

const DEFAULT_CONTENT_API = "https://content.better-i18n.com";

export function createAnalyticsNamespace(config: AnalyticsClientConfig, scope: ProjectScope) {
  const baseUrl = (config.contentApiUrl ?? DEFAULT_CONTENT_API).replace(/\/$/, "");
  const { orgSlug, projectSlug } = scope;
  const base = `/v1/analytics`;

  function buildPath(type: string, modelSlug?: string, entrySlug?: string): string {
    let path = `${base}/${type}/${orgSlug}/${projectSlug}`;
    if (modelSlug) path += `/${modelSlug}`;
    if (entrySlug) path += `/${entrySlug}`;
    return path;
  }

  async function request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v) url.searchParams.set(k, v);
      }
    }

    const res = await fetch(url.toString(), {
      headers: { "x-api-key": config.apiKey },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Invalid API key");
      if (res.status === 403) throw new Error("Public keys cannot read analytics. Use your project API key.");
      if (res.status === 404) throw new Error("Project or model not found");
      const body = await res.text().catch(() => "");
      throw new Error(`Analytics API error ${res.status}: ${body}`);
    }

    return res.json() as Promise<T>;
  }

  return {
    async views(modelSlugOrOpts?: string | ViewsOptions, entryOrOpts?: string | ViewsOptions, opts?: ViewsOptions): Promise<ViewsResponse | SingleViewResponse> {
      const modelSlug = typeof modelSlugOrOpts === "string" ? modelSlugOrOpts : undefined;
      const entrySlug = typeof entryOrOpts === "string" ? entryOrOpts : undefined;
      const options = typeof modelSlugOrOpts === "object" ? modelSlugOrOpts
        : typeof entryOrOpts === "object" ? entryOrOpts : opts;
      const path = buildPath("views", modelSlug, entrySlug);
      return request(path, options?.period ? { period: options.period } : undefined);
    },

    async stats(modelSlugOrOpts?: string | (ViewsOptions & { entrySlug?: string }), opts?: ViewsOptions & { entrySlug?: string }): Promise<StatsResponse> {
      const modelSlug = typeof modelSlugOrOpts === "string" ? modelSlugOrOpts : undefined;
      const options = typeof modelSlugOrOpts === "object" ? modelSlugOrOpts : opts;
      const path = buildPath("stats", modelSlug, options?.entrySlug);
      return request<StatsResponse>(path, options?.period ? { period: options.period } : undefined);
    },
  };
}

export type AnalyticsNamespace = ReturnType<typeof createAnalyticsNamespace>;
