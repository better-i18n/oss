import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  generateBlogIndexes,
  isRealTranslation,
  languageCodes,
  type BlogTranslations,
} from "./generate-blog-indexes";

describe("isRealTranslation", () => {
  const translations: BlogTranslations = new Map([
    ["translated", new Set(["en", "de"])],
    ["english-only", new Set(["en"])],
  ]);

  it("always counts the source locale", () => {
    expect(isRealTranslation(translations, "unknown", "en")).toBe(true);
  });

  it("counts a locale only when the CMS lists it", () => {
    expect(isRealTranslation(translations, "translated", "de")).toBe(true);
    expect(isRealTranslation(translations, "english-only", "nl")).toBe(false);
  });

  it("fails closed for a post whose languages are unknown", () => {
    expect(isRealTranslation(translations, "lookup-failed", "de")).toBe(false);
  });
});

describe("languageCodes", () => {
  it("reads both the string[] and the {code}[] shapes, and nothing else", () => {
    expect(languageCodes(["en", "tr"])).toEqual(["en", "tr"]);
    expect(languageCodes([{ code: "en", name: "English" }, { code: "de" }])).toEqual(["en", "de"]);
    expect(languageCodes(undefined)).toEqual([]);
    expect(languageCodes([null, 3, {}])).toEqual([]);
  });
});

/* Mirrors the live API on 2026-11-14: the list endpoint has NO `langs`, and
   with `language=nl` it serves the English entry. Only the single-entry
   endpoint carries `availableLanguages`. */
function mockContentApi(availability: Record<string, string[] | "fail">) {
  const slugs = Object.keys(availability);
  return vi.fn(async (input: string | URL | Request) => {
    const url = new URL(String(input));
    const single = url.pathname.match(/\/entries\/([^/]+)$/);
    if (single) {
      const langs = availability[decodeURIComponent(single[1]!)];
      if (!langs || langs === "fail") return new Response("boom", { status: 500 });
      return Response.json({ slug: single[1], availableLanguages: langs.map((code) => ({ code })) });
    }
    return Response.json({
      items: slugs.map((slug) => ({ slug, title: `EN ${slug}`, publishedAt: "2026-03-01" })),
      hasMore: false,
      total: slugs.length,
    });
  });
}

async function readIndex(dir: string, locale: string): Promise<string[]> {
  const raw = JSON.parse(await readFile(join(dir, `blog-index-${locale}.json`), "utf-8"));
  return raw.allPosts.map((p: { slug: string }) => p.slug);
}

describe("generateBlogIndexes", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("lists a post under a locale only when it is really translated there (F3)", async () => {
    vi.stubGlobal(
      "fetch",
      mockContentApi({
        "real-german": ["en", "de"],
        "english-only": ["en"],
        "lookup-fails": "fail",
      }),
    );
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const dir = await mkdtemp(join(tmpdir(), "blog-index-"));

    await generateBlogIndexes(["en", "de", "nl"], dir, { project: "acme/web", apiKey: "k" });

    expect(await readIndex(dir, "en")).toEqual(["real-german", "english-only", "lookup-fails"]);
    expect(await readIndex(dir, "de")).toEqual(["real-german"]);
    expect(await readIndex(dir, "nl")).toEqual([]);
  });
});
