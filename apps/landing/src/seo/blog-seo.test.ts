import { describe, expect, it } from "vitest";
import { blogCanonicalLocale } from "./blog-seo";

describe("blogCanonicalLocale (F3)", () => {
  it("keeps a real translation self-canonical", () => {
    expect(blogCanonicalLocale("de", ["en", "de"])).toBe("de");
    expect(blogCanonicalLocale("en", ["en", "de"])).toBe("en");
  });

  it("points an English copy under a locale path at the English post", () => {
    // /nl/blog/en-vs-en-us-locale-file-naming/ — the API serves English there.
    expect(blogCanonicalLocale("nl", ["en"])).toBe("en");
  });

  it("keeps its own URL when the language list is unknown", () => {
    expect(blogCanonicalLocale("nl", [])).toBe("nl");
    expect(blogCanonicalLocale("nl", null)).toBe("nl");
    expect(blogCanonicalLocale("nl", undefined)).toBe("nl");
  });
});
