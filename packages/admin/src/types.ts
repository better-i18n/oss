export type { AdminClientConfig } from "./client.js";

export interface ViewsResponse {
  views: Record<string, number>;
  period: string;
  cachedAt: string;
}

export interface SingleViewResponse {
  views: number;
  period: string;
  cachedAt: string;
}

export interface EventsQueryOptions {
  period?: "24h" | "7d" | "30d" | "90d";
  event?: string;
  entrySlug?: string;
}

export interface EventsResponse {
  events: Array<{
    event: string;
    count: number;
    slug?: string;
  }>;
  period: string;
  total: number;
}
