/**
 * The Content API returns drafts when asked for a slug. getBlogPost must treat
 * anything that is not published as missing, or drafts render as indexable pages.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const getEntry = vi.fn();

vi.mock("@better-i18n/sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@better-i18n/sdk")>();
  return { ...actual, createClient: () => ({ getEntry }) };
});

beforeEach(() => {
  vi.resetModules();
  getEntry.mockReset();
  vi.stubEnv("BETTER_I18N_CONTENT_API_KEY", "bi_pub_test");
  vi.stubEnv("BETTER_I18N_PROJECT", "better-i18n/landing");
});

describe("getBlogPost", () => {
  it("returns null for a draft", async () => {
    getEntry.mockResolvedValue({ id: "1", slug: "d", title: "D", body: "x", status: "draft" });
    const { getBlogPost } = await import("./content");
    expect(await getBlogPost("d", "en")).toBeNull();
  });

  it("returns the post when published", async () => {
    getEntry.mockResolvedValue({ id: "2", slug: "p", title: "P", body: "hello", status: "published", publishedAt: "2026-09-01" });
    const { getBlogPost } = await import("./content");
    const post = await getBlogPost("p", "en");
    expect(post?.slug).toBe("p");
  });
});
