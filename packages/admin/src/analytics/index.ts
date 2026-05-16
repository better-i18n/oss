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
    async views(modelSlug: string, entryOrOpts?: string | ViewsOptions, opts?: ViewsOptions): Promise<ViewsResponse | SingleViewResponse> {
      const entrySlug = typeof entryOrOpts === "string" ? entryOrOpts : undefined;
      const options = typeof entryOrOpts === "object" ? entryOrOpts : opts;
      const path = entrySlug
        ? `/v1/analytics/views/${orgSlug}/${projectSlug}/${modelSlug}/${entrySlug}`
        : `/v1/analytics/views/${orgSlug}/${projectSlug}/${modelSlug}`;
      return request(path, options?.period ? { period: options.period } : undefined);
    },

    async stats(modelSlug: string, opts?: ViewsOptions & { entrySlug?: string }): Promise<StatsResponse> {
      const path = opts?.entrySlug
        ? `/v1/analytics/stats/${orgSlug}/${projectSlug}/${modelSlug}/${opts.entrySlug}`
        : `/v1/analytics/stats/${orgSlug}/${projectSlug}/${modelSlug}`;
      return request<StatsResponse>(path, opts?.period ? { period: opts.period } : undefined);
    },
  };
}

export type AnalyticsNamespace = ReturnType<typeof createAnalyticsNamespace>;
