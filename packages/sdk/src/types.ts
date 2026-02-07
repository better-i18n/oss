// ─── Client Configuration ────────────────────────────────────────────

/** Configuration for creating a Better i18n client. */
export interface ClientConfig {
  /** Organization slug (e.g., "acme-corp"). */
  org: string;
  /** Project slug (e.g., "web-app"). */
  project: string;
  /** API key for authenticating content requests. Required. */
  apiKey: string;
  /** CDN base URL for translations. Defaults to `https://cdn.better-i18n.com`. */
  cdnBase?: string;
  /** REST API base URL for content. Defaults to `https://api.better-i18n.com`. */
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

// ─── Translation Types ───────────────────────────────────────────────

/** Manifest describing project languages and translation coverage. */
export interface TranslationManifest {
  projectSlug: string;
  sourceLanguage: string;
  languages: Array<{
    code: string;
    name: string;
    nativeName: string;
    isSource: boolean;
    keyCount: number;
  }>;
  updatedAt: string;
}

// ─── Client Interfaces ──────────────────────────────────────────────

/** Options for listing content entries. */
export interface ListEntriesOptions {
  /** Language code for localized content. Defaults to `"en"`. */
  language?: string;
  /** Page number (1-based). */
  page?: number;
  /** Max entries per page. */
  limit?: number;
}

/** Options for fetching a single content entry. */
export interface GetEntryOptions {
  /** Language code for localized content. Defaults to `"en"`. */
  language?: string;
}

/** Options for fetching translations. */
export interface GetTranslationsOptions {
  /** Language code. Defaults to `"en"`. */
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

/** Client for fetching translation strings. */
export interface TranslationsClient {
  /** Fetch translations for a namespace. */
  get(
    namespace: string,
    options?: GetTranslationsOptions,
  ): Promise<Record<string, string>>;
  /** Fetch the project translation manifest. */
  getManifest(): Promise<TranslationManifest>;
}

/** The unified Better i18n client. */
export interface BetterI18nClient {
  /** Content sub-client for headless CMS operations. */
  content: ContentClient;
  /** Translations sub-client for i18n string fetching. */
  translations: TranslationsClient;
}
