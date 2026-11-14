import { describe, expect, it } from "vitest";
import { localeTrailingSlashRedirect, withTrailingSlash } from "./trailing-slash";

describe("withTrailingSlash (root locale redirect, F7)", () => {
  it("adds the slash so the 302 lands on the final URL", () => {
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/pricing")).toBe("/pricing/");
    expect(withTrailingSlash("/blog/x/")).toBe("/blog/x/");
  });

  it("leaves file paths alone", () => {
    expect(withTrailingSlash("/llms.txt")).toBe("/llms.txt");
  });
});

describe("localeTrailingSlashRedirect (edge 308, F7)", () => {
  it("redirects slash-less page URLs under a served locale", () => {
    expect(localeTrailingSlashRedirect("/en")).toBe("/en/");
    expect(localeTrailingSlashRedirect("/de/pricing")).toBe("/de/pricing/");
    expect(localeTrailingSlashRedirect("/zh-hans/blog/x")).toBe("/zh-hans/blog/x/");
  });

  it("passes everything else through", () => {
    expect(localeTrailingSlashRedirect("/en/")).toBeNull();
    expect(localeTrailingSlashRedirect("/en/llms.txt")).toBeNull();
    expect(localeTrailingSlashRedirect("/api/changelog")).toBeNull();
    expect(localeTrailingSlashRedirect("/_serverFn/abc")).toBeNull();
    expect(localeTrailingSlashRedirect("/pricing")).toBeNull(); // root locale redirect handles it
    expect(localeTrailingSlashRedirect("/pt/pricing")).toBeNull(); // not a served locale
  });
});
