import { describe, expect, it } from "vitest";
import { assertEnoughBlogUrls, countBlogUrls } from "./sitemap-guard";

const url = (p: string) => `<url><loc>https://better-i18n.com${p}</loc></url>`;

describe("sitemap guard", () => {
  it("counts only blog post URLs, not the blog index", () => {
    const xml = [url("/en/blog/a/"), url("/de/blog/b/"), url("/en/blog/"), url("/en/about/")].join("");
    expect(countBlogUrls(xml)).toBe(2);
  });

  it("throws below the minimum", () => {
    expect(() => assertEnoughBlogUrls([url("/en/blog/a/")], 5)).toThrow(/1 blog URLs/);
  });

  it("sums across sitemap files", () => {
    expect(assertEnoughBlogUrls([url("/en/blog/a/"), url("/en/blog/b/")], 2)).toBe(2);
  });
});
