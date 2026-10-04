/**
 * #142: the blog post page computes "related posts" on every view. It must
 * read one Content API page of card fields, never every post with its body.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const getEntries = vi.fn();

vi.mock("@better-i18n/sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@better-i18n/sdk")>();
  return { ...actual, createClient: () => ({ getEntries }) };
});

function entry(slug: string, category: string | null) {
  return { slug, title: slug.toUpperCase(), publishedAt: "2026-09-01", relations: category ? { category: { name: category } } : {} };
}

beforeEach(() => {
  vi.resetModules();
  getEntries.mockReset();
  vi.stubEnv("BETTER_I18N_CONTENT_API_KEY", "bi_pub_test");
  vi.stubEnv("BETTER_I18N_PROJECT", "better-i18n/landing");
});

describe("getRelatedPosts", () => {
  it("reads one page of card fields, no body, and prefers the same category", async () => {
    getEntries.mockResolvedValue({
      items: [entry("a", "guide"), entry("current", "guide"), entry("b", "news"), entry("c", "guide")],
      total: 254,
      hasMore: true,
    });
    const { getRelatedPosts } = await import("./content");

    const posts = await getRelatedPosts("current", "guide", "en", 3);

    expect(getEntries).toHaveBeenCalledTimes(1);
    const [, opts] = getEntries.mock.calls[0];
    expect(opts).toMatchObject({ limit: 30, sort: "publishedAt", order: "desc" });
    expect(opts.page).toBeUndefined();
    expect(opts.fields).toBeDefined();
    expect(opts.fields).not.toContain("body");
    expect(posts.map((p) => p.slug)).toEqual(["a", "c", "b"]);
    expect(posts.every((p) => p.excerpt === "")).toBe(true);
  });
});

describe("getPostsByKeywords", () => {
  it("keeps the body (it matches on the excerpt) but still reads one page only", async () => {
    getEntries.mockResolvedValue({
      items: [{ ...entry("x", null), body: "All about **locale** files" }],
      total: 254,
      hasMore: true,
    });
    const { getPostsByKeywords } = await import("./content");

    const posts = await getPostsByKeywords("en", ["locale"], 3);

    expect(getEntries).toHaveBeenCalledTimes(1);
    expect(getEntries.mock.calls[0][1].fields).toBeUndefined();
    expect(posts.map((p) => p.slug)).toEqual(["x"]);
  });
});
