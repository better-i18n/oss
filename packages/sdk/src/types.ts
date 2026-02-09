// ─── Client Configuration ────────────────────────────────────────────

/** Configuration for creating a Better i18n content client. */
export interface ClientConfig {
  /** Organization slug (e.g., "acme-corp"). */
  org: string;
  /** Project slug (e.g., "web-app"). */
  project: string;
  /** API key for authenticating content requests. Required. */
  apiKey: string;
  /** REST API base URL. Defaults to `https://api.better-i18n.com`. */
  apiBase?: string;
}

// ─── Content Types ───────────────────────────────────────────────────

/**
 * A full content entry with all localized fields.
 *
 * @typeParam CF - Custom fields shape. Defaults to `Record<string, string | null>`.
 *
 * @example
 * ```typescript
 * // Typed custom fields
 * interface BlogFields { readingTime: string | null; category: string | null }
 * const post = await client.getEntry<BlogFields>("blog", "hello-world");
 * post.customFields.readingTime; // string | null (typed!)
 * ```
 */
export interface ContentEntry<CF extends Record<string, string | null> = Record<string, string | null>> {
  id: string;
  slug: string;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  sourceLanguage: string;
  availableLanguages: string[];
  featuredImage: string | null;
  tags: string[];
  author: { name: string; image: string | null } | null;
  customFields: CF;
  // Localized content
  title: string;
  excerpt: string | null;
  body: unknown;
  bodyHtml: string | null;
  bodyMarkdown: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

/** Entry status filter values. */
export type ContentEntryStatus = "draft" | "published" | "archived";

/** A summary item for content entry lists. */
export interface ContentEntryListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  featuredImage: string | null;
  tags: string[];
  author: { name: string; image: string | null } | null;
}

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
}

/** Options for fetching a single content entry. */
export interface GetEntryOptions {
  /** Language code for localized content. Defaults to source language. */
  language?: string;
}

/** Client for fetching content entries and models. */
export interface ContentClient {
  /** List all content models in the project. */
  getModels(): Promise<ContentModel[]>;
  /** List entries for a content model with pagination. */
  getEntries(
    modelSlug: string,
    options?: ListEntriesOptions,
  ): Promise<PaginatedResponse<ContentEntryListItem>>;
  /** Fetch a single content entry by slug. */
  getEntry<CF extends Record<string, string | null> = Record<string, string | null>>(
    modelSlug: string,
    entrySlug: string,
    options?: GetEntryOptions,
  ): Promise<ContentEntry<CF>>;
}
