import { describe, it, expect } from "vitest";
import { ContentQueryBuilder } from "../query-builder.js";
import type { HttpClient, HttpResult } from "../http.js";

/**
 * `bodyFormat` decides which representation of an entry body the API returns.
 * Markdown and HTML are projections and lose blocks that plain Markdown has no
 * syntax for; `plate` returns the stored document intact.
 *
 * These tests exist because the parameter is invisible from the call site — if
 * the builder silently dropped it, callers would keep receiving lossy Markdown
 * while believing they asked for the document. Documenting an option that does
 * not reach the wire is exactly the failure we are correcting here.
 */

function recordingHttp(): { http: HttpClient; calls: Array<{ path: string; params?: URLSearchParams }> } {
  const calls: Array<{ path: string; params?: URLSearchParams }> = [];
  const http: HttpClient = {
    async request<T>(path: string, params?: URLSearchParams): Promise<HttpResult<T>> {
      calls.push({ path, params });
      return { data: { items: [], total: 0, hasMore: false } as T, error: null };
    },
    getModels: async () => [],
    getEntries: async () => ({ items: [], total: 0, hasMore: false }),
    getEntry: async () => ({}) as never,
  };
  return { http, calls };
}

describe("bodyFormat query param", () => {
  it("is absent by default, so the response stays Markdown", async () => {
    const { http, calls } = recordingHttp();
    await ContentQueryBuilder.create(http, "blog-posts").execute();

    expect(calls[0].params?.get("bodyFormat")).toBeNull();
  });

  it("reaches the wire on list queries", async () => {
    const { http, calls } = recordingHttp();
    await ContentQueryBuilder.create(http, "blog-posts").bodyFormat("plate").execute();

    expect(calls[0].params?.get("bodyFormat")).toBe("plate");
  });

  it("reaches the wire on single-entry queries", async () => {
    const { http, calls } = recordingHttp();
    await ContentQueryBuilder.create(http, "blog-posts")
      .bodyFormat("plate")
      .single("hello-world")
      .execute();

    expect(calls[0].path).toBe("/models/blog-posts/entries/hello-world");
    expect(calls[0].params?.get("bodyFormat")).toBe("plate");
  });

  it("survives further chaining, since the builder is immutable", async () => {
    const { http, calls } = recordingHttp();
    await ContentQueryBuilder.create(http, "blog-posts")
      .bodyFormat("html")
      .language("fr")
      .limit(5)
      .execute();

    expect(calls[0].params?.get("bodyFormat")).toBe("html");
    expect(calls[0].params?.get("language")).toBe("fr");
  });

  it("does not leak between sibling builders", async () => {
    const { http, calls } = recordingHttp();
    const base = ContentQueryBuilder.create(http, "blog-posts");
    await base.bodyFormat("plate").execute();
    await base.execute();

    expect(calls[0].params?.get("bodyFormat")).toBe("plate");
    expect(calls[1].params?.get("bodyFormat")).toBeNull();
  });
});
