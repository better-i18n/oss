// ─── Client Configuration ────────────────────────────────────────────

/** Configuration for creating a Better i18n content client. */
export interface ClientConfig {
  /** Project identifier in `org/project` format (e.g., "acme-corp/web-app"). Same as the dashboard URL path. */
  project: string;
  /** API key for authenticating content requests. Required. */
  apiKey: string;
  /** REST API base URL. Defaults to `https://content.better-i18n.com`. */
  apiBase?: string;
  /** Enable debug logging to see request URLs, headers, and responses. */
  debug?: boolean;
}

// ─── Relation Types ─────────────────────────────────────────────────

/** Expanded relation value returned when a relation field is expanded. Custom fields are spread directly on the object. */
export type RelationValue = {
  /** Referenced entry UUID */
  id: string;
  /** Referenced entry slug */
  slug: string;
  /** Referenced entry title (source language or requested language) */
  title: string;
  /** Target model slug */
  modelSlug: string;
} & Record<string, string | null>;

// ─── Content Types ───────────────────────────────────────────────────

/**
 * A full content entry with all localized fields.
 * Custom fields are spread directly on the entry object (flat access).
 *
 * @typeParam CF - Custom fields shape. Defaults to `Record<string, string | null>`.
 *
 * @example
 * ```typescript
 * // Typed custom fields
 * interface BlogFields { readingTime: string | null; category: string | null }
 * const { data: post } = await client.from("blog").single<BlogFields>("hello-world");
 * post.readingTime; // string | null (typed!)
 * post.category;    // string | null (typed!)
 * ```
 */
export type ContentEntry<CF extends Record<string, string | null> = Record<string, string | null>> = {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  sourceLanguage: string;
  availableLanguages: string[];
  /** Expanded relation fields (only present when expand is used) */
  relations?: Record<string, RelationValue | null>;
  // Localized content
  title: string;
  /** Rich text body as Markdown string. */
  body: string | null;
} & CF;

/** Entry status filter values. */
export type ContentEntryStatus = "draft" | "published" | "archived";

/** A summary item for content entry lists. Custom fields are spread directly on the object. */
export type ContentEntryListItem<CF extends Record<string, string | null> = Record<string, string | null>> = {
  slug: string;
  title: string;
  publishedAt: string | null;
  /** Markdown body — only present when `fields` includes `"body"`. */
  body?: string | null;
  /** Expanded relation fields (only present when expand is used) */
  relations?: Record<string, RelationValue | null>;
} & CF;

/** Paginated response wrapper. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

/** A content model definition. */
export interface ContentModel {
  slug: string;
  displayName: string;
  description: string | null;
  kind: string;
  entryCount: number;
}

// ─── Query Result Types ─────────────────────────────────────────────

/** Result of a list query — Supabase-style `{ data, error }` pattern. */
export interface QueryResult<T> {
  data: T | null;
  error: Error | null;
  total: number;
  hasMore: boolean;
}

/** Result of a single-entry query — Supabase-style `{ data, error }` pattern. */
export interface SingleQueryResult<T> {
  data: T | null;
  error: Error | null;
}

// ─── Client Interface ───────────────────────────────────────────────

/** Sortable fields for content entries. */
export type ContentEntrySortField = "publishedAt" | "createdAt" | "updatedAt" | "title";

/** Options for listing content entries. */
export interface ListEntriesOptions {
  /** Language code for localized content. Defaults to source language. */
  language?: string;
  /** Filter by entry status. */
  status?: ContentEntryStatus;
  /** Field to sort by. Defaults to `"updatedAt"`. */
  sort?: ContentEntrySortField;
  /** Sort direction. Defaults to `"desc"`. */
  order?: "asc" | "desc";
  /** Page number (1-based). */
  page?: number;
  /** Max entries per page (1-100). Defaults to 50. */
  limit?: number;
  /** Fields to include in the response (e.g., ["title", "body", "category"]). Returns all fields when omitted. */
  fields?: string[];
  /** Relation field names to expand (e.g., ["category", "author"]) */
  expand?: string[];
}

/** Options for fetching a single content entry. */
export interface GetEntryOptions {
  /** Language code for localized content. Defaults to source language. */
  language?: string;
  /** Fields to include in the response (e.g., ["title", "body"]). Returns all fields when omitted. */
  fields?: string[];
  /** Relation field names to expand (e.g., ["category", "author"]) */
  expand?: string[];
}

// Forward-declare for ContentClient (avoids circular imports)
import type { ContentQueryBuilder } from "./query-builder.js";

/** Client for fetching content entries and models. */
export interface ContentClient {
  /**
   * Start a chainable query for a content model — Supabase-style API.
   *
   * @example
   * ```typescript
   * const { data, error } = await client
   *   .from("blog-posts")
   *   .eq("status", "published")
   *   .order("publishedAt", { ascending: false })
   *   .limit(10);
   * ```
   */
  from(modelSlug: string): ContentQueryBuilder;

  /** List all content models in the project. */
  getModels(): Promise<ContentModel[]>;
  /**
   * List entries for a content model with pagination.
   * @deprecated Use `client.from(modelSlug)` for a chainable, composable API.
   */
  getEntries(
    modelSlug: string,
    options?: ListEntriesOptions,
  ): Promise<PaginatedResponse<ContentEntryListItem>>;
  /**
   * Fetch a single content entry by slug.
   * @deprecated Use `client.from(modelSlug).single(slug)` for error-safe API.
   */
  getEntry<CF extends Record<string, string | null> = Record<string, string | null>>(
    modelSlug: string,
    entrySlug: string,
    options?: GetEntryOptions,
  ): Promise<ContentEntry<CF>>;
}
