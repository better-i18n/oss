import type { HttpClient } from "./http.js";
import type {
  ContentEntry,
  ContentEntryListItem,
  ContentEntrySortField,
  QueryResult,
  SingleQueryResult,
} from "./types.js";

// ─── Internal State ─────────────────────────────────────────────────

interface QueryParams {
  fields: string[];
  expand: string[];
  filters: Record<string, string>;
  search: string | undefined;
  language: string | undefined;
  status: string | undefined;
  sort: ContentEntrySortField | undefined;
  ascending: boolean | undefined;
  limitVal: number | undefined;
  pageVal: number | undefined;
}

function emptyParams(): QueryParams {
  return {
    fields: [],
    expand: [],
    filters: {},
    search: undefined,
    language: undefined,
    status: undefined,
    sort: undefined,
    ascending: undefined,
    limitVal: undefined,
    pageVal: undefined,
  };
}

// ─── SingleQueryBuilder ─────────────────────────────────────────────

/**
 * Terminal builder for fetching a single entry by slug.
 * Thenable — can be awaited directly.
 */
export class SingleQueryBuilder<CF extends Record<string, string | null> = Record<string, string | null>> {
  /** @internal */
  constructor(
    private readonly _http: HttpClient,
    private readonly _model: string,
    private readonly _slug: string,
    private readonly _params: QueryParams,
  ) {}

  /** Execute the query. Prefer `await builder` over calling this directly. */
  async execute(): Promise<SingleQueryResult<ContentEntry<CF>>> {
    const params = new URLSearchParams();
    if (this._params.language) params.set("language", this._params.language);
    if (this._params.fields.length) params.set("fields", this._params.fields.join(","));
    if (this._params.expand.length) params.set("expand", this._params.expand.join(","));

    const result = await this._http.request<ContentEntry<CF>>(
      `/models/${this._model}/entries/${this._slug}`,
      params,
    );

    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data, error: null };
  }

  /** Makes this object thenable so `await builder.single("slug")` works. */
  then<TResult1 = SingleQueryResult<ContentEntry<CF>>, TResult2 = never>(
    onfulfilled?: ((value: SingleQueryResult<ContentEntry<CF>>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

// ─── ContentQueryBuilder ────────────────────────────────────────────

/**
 * Supabase-style chainable query builder for content entries.
 *
 * Each chainable method returns a **new** builder instance (immutable).
 * The builder is thenable — `await` it to execute the query.
 *
 * @example
 * ```typescript
 * const { data, error, total, hasMore } = await client
 *   .from("blog-posts")
 *   .select("title", "body")
 *   .eq("status", "published")
 *   .order("publishedAt", { ascending: false })
 *   .limit(10)
 *   .language("en");
 * ```
 */
export class ContentQueryBuilder<T = ContentEntryListItem> {
  /** @internal — use `ContentQueryBuilder.create()` */
  private constructor(
    private readonly _http: HttpClient,
    private readonly _model: string,
    private readonly _params: QueryParams,
  ) {}

  /** @internal */
  static create(http: HttpClient, model: string): ContentQueryBuilder {
    return new ContentQueryBuilder(http, model, emptyParams());
  }

  // ─── Private helpers ────────────────────────────────────────────

  private clone(patch: Partial<QueryParams>): ContentQueryBuilder<T> {
    return new ContentQueryBuilder<T>(this._http, this._model, {
      ...this._params,
      ...patch,
    });
  }

  // ─── Chainable methods ──────────────────────────────────────────

  /**
   * Choose which fields to include in the response.
   *
   * @example `.select("title", "body", "category")`
   */
  select(...fields: string[]): ContentQueryBuilder<T> {
    return this.clone({ fields: [...this._params.fields, ...fields] });
  }

  /**
   * Filter by a built-in field value (status, etc.).
   *
   * @example `.eq("status", "published")`
   */
  eq(field: string, value: string): ContentQueryBuilder<T> {
    if (field === "status") {
      return this.clone({ status: value });
    }
    return this.clone({
      filters: { ...this._params.filters, [field]: value },
    });
  }

  /**
   * Filter by a custom field value. Maps to `?filter[field]=value` on the REST API.
   *
   * @example `.filter("category", "engineering")`
   */
  filter(field: string, value: string): ContentQueryBuilder<T> {
    return this.clone({
      filters: { ...this._params.filters, [field]: value },
    });
  }

  /**
   * Full-text search on entry titles.
   *
   * @example `.search("kubernetes")`
   */
  search(term: string): ContentQueryBuilder<T> {
    return this.clone({ search: term });
  }

  /**
   * Set the language for localized content.
   *
   * @example `.language("fr")`
   */
  language(code: string): ContentQueryBuilder<T> {
    return this.clone({ language: code });
  }

  /**
   * Set the sort field and direction.
   *
   * @example `.order("publishedAt", { ascending: false })`
   */
  order(field: ContentEntrySortField, opts?: { ascending?: boolean }): ContentQueryBuilder<T> {
    return this.clone({
      sort: field,
      ascending: opts?.ascending,
    });
  }

  /**
   * Limit the number of results per page (1-100).
   *
   * @example `.limit(10)`
   */
  limit(n: number): ContentQueryBuilder<T> {
    return this.clone({ limitVal: n });
  }

  /**
   * Set the page number (1-based).
   *
   * @example `.page(2)`
   */
  page(n: number): ContentQueryBuilder<T> {
    return this.clone({ pageVal: n });
  }

  /**
   * Expand relation fields by name.
   *
   * @example `.expand("author", "category")`
   */
  expand(...fields: string[]): ContentQueryBuilder<T> {
    return this.clone({ expand: [...this._params.expand, ...fields] });
  }

  // ─── Terminal methods ───────────────────────────────────────────

  /**
   * Switch to single-entry mode. Returns a thenable that resolves a single entry.
   *
   * @example
   * ```typescript
   * const { data: post, error } = await client
   *   .from("blog-posts")
   *   .language("fr")
   *   .single("hello-world");
   * ```
   */
  single<CF extends Record<string, string | null> = Record<string, string | null>>(
    slug: string,
  ): SingleQueryBuilder<CF> {
    return new SingleQueryBuilder<CF>(this._http, this._model, slug, this._params);
  }

  /**
   * Execute the list query. Prefer `await builder` over calling this directly.
   */
  async execute(): Promise<QueryResult<T[]>> {
    const params = this.buildSearchParams();

    const result = await this._http.request<{
      items: T[];
      total: number;
      hasMore: boolean;
    }>(`/models/${this._model}/entries`, params);

    if (result.error) {
      return { data: null, error: result.error, total: 0, hasMore: false };
    }

    return {
      data: result.data.items,
      error: null,
      total: result.data.total,
      hasMore: result.data.hasMore,
    };
  }

  /** Makes this object thenable so `await client.from("posts").limit(5)` works. */
  then<TResult1 = QueryResult<T[]>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  // ─── Internal ───────────────────────────────────────────────────

  private buildSearchParams(): URLSearchParams {
    const params = new URLSearchParams();

    if (this._params.language) params.set("language", this._params.language);
    if (this._params.status) params.set("status", this._params.status);
    if (this._params.sort) params.set("sort", this._params.sort);
    if (this._params.ascending !== undefined) {
      params.set("order", this._params.ascending ? "asc" : "desc");
    }
    if (this._params.pageVal) params.set("page", String(this._params.pageVal));
    if (this._params.limitVal) params.set("limit", String(this._params.limitVal));
    if (this._params.fields.length) params.set("fields", this._params.fields.join(","));
    if (this._params.expand.length) params.set("expand", this._params.expand.join(","));
    if (this._params.search) params.set("search", this._params.search);

    for (const [key, value] of Object.entries(this._params.filters)) {
      params.set(`filter[${key}]`, value);
    }

    return params;
  }
}
