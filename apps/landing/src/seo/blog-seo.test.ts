import { describe, expect, it } from "vitest";
import {
  CONSUMER_LISTICLE_SLUGS,
  OFF_TOPIC_SEO_SLUGS,
  blogCanonicalLocale,
  isOffTopicBlogSlug,
} from "./blog-seo";
import { generateBlogPages } from "./generate-pages";
import { generateAllLlmsTxtFiles } from "./llms-txt";

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

describe("off-topic blog posts (F4)", () => {
  it("lists 81 generic SEO + 15 consumer posts, no duplicates", () => {
    expect(OFF_TOPIC_SEO_SLUGS).toHaveLength(81);
    expect(CONSUMER_LISTICLE_SLUGS).toHaveLength(15);
    const all = [...OFF_TOPIC_SEO_SLUGS, ...CONSUMER_LISTICLE_SLUGS];
    expect(new Set(all).size).toBe(all.length);
  });

  it("leaves international / multilingual SEO posts indexable", () => {
    for (const slug of [
      "international-seo",
      "hreflang-tags-guide",
      "multilingual-keyword-research",
      "i18n-seo-hreflang-locale-urls-guide",
    ]) {
      expect(isOffTopicBlogSlug(slug)).toBe(false);
    }
  });

  it("marks every locale of an off-topic post noindex, so it leaves the sitemap", () => {
    const pages = generateBlogPages(
      [
        { slug: "seo-examples", title: "SEO examples", publishedAt: "2026-03-01", availableLanguages: ["en", "tr"] },
        { slug: "react-i18n-guide", title: "React i18n", publishedAt: "2026-03-01", availableLanguages: ["en", "tr"] },
      ],
      ["en", "tr"],
    );
    const detail = (slug: string) => pages.filter((p) => p.path.includes(`/blog/${slug}/`));
    expect(detail("seo-examples").map((p) => p.sitemap.noindex)).toEqual([true, true]);
    expect(detail("react-i18n-guide").every((p) => !p.sitemap.noindex)).toBe(true);
  });

  it("keeps off-topic posts out of llms.txt", () => {
    const files = generateAllLlmsTxtFiles(
      [
        { slug: "google-translate-alternatives", title: "Google Translate alternatives", publishedAt: "2026-03-01" },
        { slug: "react-i18n-guide", title: "React i18n guide", publishedAt: "2026-03-01" },
      ],
      ["en"],
    );
    const llms = files.get("llms.txt")!;
    expect(llms).toContain("react-i18n-guide");
    expect(llms).not.toContain("google-translate-alternatives");
  });
});
