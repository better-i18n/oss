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

/** A language descriptor returned in the `availableLanguageDetails` array on single-entry responses. */
export interface ContentEntryLanguage {
  /** BCP 47 language code (e.g. `"en"`, `"fr"`, `"tr"`). */
  code: string;
  /** Human-readable language name (e.g. `"English"`, `"French"`). */
  name: string;
  /** ISO 3166-1 alpha-2 country code for the locale flag (e.g. `"US"`, `"FR"`). */
  countryCode?: string;
}

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
  /** Source language code of the project (e.g. `"en"`). */
  sourceLanguage: string;
  /** Language codes that have translations for this entry (e.g. `["en", "fr", "tr"]`). */
  availableLanguages: string[];
  /**
   * Rich language descriptors for each available translation.
   * Present on single-entry responses (`single()`) — includes display name and country code.
   * Use this instead of `availableLanguages` when you need to render language pickers or flags.
   *
   * @example
   * ```typescript
   * const { data: post } = await client.from("blog-posts").single("hello-world");
   * post.availableLanguageDetails?.map(lang => `${lang.name} (${lang.countryCode})`);
   * ```
   */
  availableLanguageDetails?: ContentEntryLanguage[];
  /**
   * Per-language translation publish status.
   * Keys are language codes; values are `"draft"` or `"published"`.
   *
   * @example
   * ```typescript
   * const { data: post } = await client.from("blog-posts").single("hello-world");
   * post.translationStatus?.["fr"]; // "published" | "draft" | undefined
   * ```
   */
  translationStatus?: Record<string, "draft" | "published">;
  /**
   * Body content rendered as an HTML string.
   * Only present when the model has `includeBody: true` and the entry has body content.
   * Returned alongside `body` (Markdown) — use whichever suits your renderer.
   */
  bodyHtml?: string;
  /**
   * Body content as a plain Markdown string.
   * Identical to the base `body` field — provided as an explicit alias for clarity
   * when `bodyHtml` is also present.
   */
  bodyMarkdown?: string;
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
  id: string;
  slug: string;
  title: string;
  status: ContentEntryStatus;
  publishedAt: string | null;
  /** Markdown body — only present when `fields` includes `"body"`. */
  body?: string | null;
  /** Source language code of the project (e.g. `"en"`). Only present on list responses when included. */
  sourceLanguage?: string;
  /** Language codes that have translations for this entry. Only present on list responses when included. */
  availableLanguages?: string[];
  /** Expanded relation fields (only present when expand is used) */
  relations?: Record<string, RelationValue | null>;
} & CF;

/** Paginated response wrapper. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

/** An enum option for enum-type fields. */
export interface ContentModelEnumValue {
  label: string;
  value: string;
}

/** A field definition within a content model. */
export interface ContentModelField {
  /** Field identifier (snake_case). */
  name: string;
  /** Human-readable field name. */
  displayName: string;
  /** Field type. */
  type: "text" | "textarea" | "richtext" | "number" | "boolean" | "date" | "datetime" | "enum" | "media" | "relation" | "user_select";
  /** Whether this field is required. */
  required: boolean;
  /** Whether this field is localized per language. */
  localized: boolean;
  /** Enum options — only present when `type` is `"enum"`. */
  enumValues?: ContentModelEnumValue[];
  /** Relation configuration — only present when `type` is `"relation"`. */
  fieldConfig?: {
    /** Slug of the target content model this field points to. */
    targetModel?: string;
  };
}

/** A content model definition. */
export interface ContentModel {
  slug: string;
  displayName: string;
  description: string | null;
  kind: string;
  entryCount: number;
  /** Whether this model has a body/rich-text field. `false` for structured data models with only custom fields. */
  includeBody: boolean;
  /** Field definitions for this model (custom fields, enums, relations, etc.). */
  fields: ContentModelField[];
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
  from<CF extends Record<string, string | null> = Record<string, string | null>>(modelSlug: string): ContentQueryBuilder<ContentEntryListItem<CF>>;

  /** List all content models in the project. */
  getModels(): Promise<ContentModel[]>;
  /**
   * List entries for a content model with pagination.
   * @deprecated Use `client.from(modelSlug)` for a chainable, composable API.
   */
  getEntries<CF extends Record<string, string | null> = Record<string, string | null>>(
    modelSlug: string,
    options?: ListEntriesOptions,
  ): Promise<PaginatedResponse<ContentEntryListItem<CF>>>;
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
