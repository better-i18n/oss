export type { AdminClientConfig } from "./client.js";

export type Period = "24h" | "7d" | "30d" | "90d";

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

export interface StatsResponse {
  overview: { totalViews: number; uniqueEntries: number };
  viewsByEntry: Array<{ slug: string; views: number }>;
  viewsByLanguage: Array<{ language: string; views: number }>;
  viewsByCountry: Array<{ country: string; views: number }>;
  viewsOverTime: Array<{ timestamp: string; views: number }>;
  period: string;
  cachedAt: string;
}

export interface ViewsOptions {
  period?: Period;
}

export interface EventsQueryOptions {
  period?: Period;
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
