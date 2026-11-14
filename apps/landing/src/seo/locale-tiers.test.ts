import { describe, expect, it } from "vitest";
import { getAlternateLinks } from "@/lib/meta";
import { SUPPORTED_LOCALES, getLocaleTier } from "./locale-tiers";

describe("locale tiers", () => {
  it("does not list pt: it is not in the CDN manifest, so /pt/… 404s (F3)", () => {
    expect(SUPPORTED_LOCALES).not.toContain("pt");
    expect(getLocaleTier("pt")).toBe("tier3");
  });

  it("keeps an unserved CMS locale out of the page hreflang", () => {
    // A blog post with a Portuguese CMS translation reports pt as available.
    const links = getAlternateLinks("/blog/some-post", ["en", "de", "pt"]);
    expect(links.map((l) => l.hrefLang)).toEqual(["en", "de", "x-default"]);
  });
});
