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

/** A full content entry with all localized fields. */
export interface ContentEntry {
  id: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  sourceLanguage: string;
  availableLanguages: string[];
  featuredImage: string | null;
  tags: string[];
  author: { name: string; image: string | null } | null;
  customFields: Record<string, string | null>;
  // Localized content
  title: string;
  excerpt: string | null;
  body: unknown;
  bodyHtml: string | null;
  bodyMarkdown: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

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

/** A content model definition. */
export interface ContentModel {
  slug: string;
  displayName: string;
  description: string | null;
  kind: string;
  entryCount: number;
}

// ─── Client Interface ───────────────────────────────────────────────

/** Options for listing content entries. */
export interface ListEntriesOptions {
  /** Language code for localized content. Defaults to source language. */
  language?: string;
  /** Page number (1-based). */
  page?: number;
  /** Max entries per page. */
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
  /** List entries for a content model. */
  getEntries(
    modelSlug: string,
    options?: ListEntriesOptions,
  ): Promise<ContentEntryListItem[]>;
  /** Fetch a single content entry by slug. */
  getEntry(
    modelSlug: string,
    entrySlug: string,
    options?: GetEntryOptions,
  ): Promise<ContentEntry>;
}
