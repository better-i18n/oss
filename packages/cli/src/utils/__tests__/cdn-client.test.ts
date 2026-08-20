import { describe, it, expect, afterEach } from "bun:test";
import { fetchRemoteKeys } from "../cdn-client.js";
import type { CdnManifest } from "../../analyzer/types.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Records the URL asked for and answers with an empty published file. */
function captureUrl(): { urls: string[] } {
  const seen: string[] = [];
  globalThis.fetch = ((input: RequestInfo | URL) => {
    seen.push(String(input));
    return Promise.resolve(new Response("{}", { status: 200 }));
  }) as typeof fetch;
  return { urls: seen };
}

const manifestWithoutFileUrls = {
  projectSlug: "utmgen",
  sourceLanguage: "en",
  languages: [],
  files: {},
  updatedAt: "2026-08-20T00:00:00.000Z",
} as unknown as CdnManifest;

describe("fetchRemoteKeys", () => {
  it("prefers the file URL carried by the manifest", async () => {
    const cap = captureUrl();
    const manifest = {
      ...manifestWithoutFileUrls,
      files: {
        en: {
          url: "https://cdn.better-i18n.com/org/proj/en/translations.json",
          size: 10,
          lastModified: "2026-08-20T00:00:00.000Z",
        },
      },
    } as unknown as CdnManifest;

    await fetchRemoteKeys("https://cdn.better-i18n.com", "org", "proj", "en", manifest);

    expect(cap.urls).toEqual([
      "https://cdn.better-i18n.com/org/proj/en/translations.json",
    ]);
  });

  /* Regression: the old fallback asked for /{org}/{proj}/translations/{locale}.json,
     a path the CDN answers with 200 + `{}` instead of 404 — so pull wrote empty
     files and still reported success. */
  it("falls back to the published /{locale}/translations.json layout", async () => {
    const cap = captureUrl();

    await fetchRemoteKeys(
      "https://cdn.better-i18n.com",
      "org",
      "proj",
      "en",
      manifestWithoutFileUrls,
    );

    expect(cap.urls).toEqual([
      "https://cdn.better-i18n.com/org/proj/en/translations.json",
    ]);
    expect(cap.urls[0]).not.toContain("/translations/en.json");
  });

  it("throws on a non-ok CDN response", async () => {
    globalThis.fetch = (() =>
      Promise.resolve(new Response("", { status: 404 }))) as typeof fetch;

    await expect(
      fetchRemoteKeys("https://cdn.better-i18n.com", "org", "proj", "en", null),
    ).rejects.toThrow("CDN fetch failed (404)");
  });
});
