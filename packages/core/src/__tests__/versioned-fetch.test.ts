/**
 * The SDK fetches the immutable snapshot when the manifest advertises a
 * version, and the exact legacy URLs — byte for byte — when it does not
 * (platform #115). The request-URL snapshots below are the contract.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createI18nCore, clearManifestCache, clearMessagesCache } from "../cdn";
import type { ManifestResponse } from "../types";

const CONFIG = {
  project: "acme/dashboard",
  defaultLocale: "en",
  cdnBaseUrl: "https://cdn.test.com",
  manifestCacheTtlMs: 0,
  messagesCacheTtlMs: 0,
};
const BASE = "https://cdn.test.com/acme/dashboard";

const V = "loyw3v28-0f3c2a9e";

const LANGS = [
  { code: "en", name: "English", isSource: true },
  { code: "de", name: "German" },
];

const SINGLE_FILE: ManifestResponse = {
  languages: LANGS,
  updatedAt: "2026-09-01T00:00:00Z",
  files: {
    en: {
      url: `${BASE}/en/translations.json`,
      size: 10,
      lastModified: "2026-09-01T00:00:00Z",
    },
    de: {
      url: `${BASE}/de/translations.json`,
      size: 10,
      lastModified: "2026-09-01T00:00:00Z",
    },
  },
};

const NAMESPACED: ManifestResponse = {
  ...SINGLE_FILE,
  batch: true,
  namespaces: ["common", "nav"],
};

/** Stamp a version on one locale; the manifest is otherwise identical. */
const withVersion = (
  m: ManifestResponse,
  locale: string,
  version = V,
): ManifestResponse => ({
  ...m,
  files: { ...m.files, [locale]: { ...m.files![locale]!, version } },
});

const recordingFetch = (manifest: ManifestResponse) => {
  const urls: string[] = [];
  const fetchFn = vi.fn(async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    urls.push(url);
    if (url.endsWith("/manifest.json")) {
      return new Response(JSON.stringify(manifest), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    if (url.includes("/batch.json")) {
      return new Response(
        JSON.stringify({ common: { hello: "b" }, nav: { home: "b" } }),
        { status: 200 },
      );
    }
    const ns = url.split("/").pop()!.replace(".json", "");
    const body =
      ns === "translations" ? { common: { hello: "single" } } : { hello: ns };
    return new Response(JSON.stringify(body), { status: 200 });
  }) as unknown as typeof fetch;
  return {
    fetchFn,
    urls,
    translationUrls: () => urls.filter((u) => !u.endsWith("/manifest.json")),
  };
};

beforeEach(() => {
  clearManifestCache();
  clearMessagesCache();
});

describe("manifest without versions → byte-identical legacy requests", () => {
  it("single-file project", async () => {
    const { fetchFn, translationUrls } = recordingFetch(SINGLE_FILE);
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de");
    expect(translationUrls()).toEqual([`${BASE}/de/translations.json`]);
  });

  it("namespaced project, full load uses the batch endpoint", async () => {
    const { fetchFn, translationUrls } = recordingFetch(NAMESPACED);
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de");
    expect(translationUrls()).toEqual([`${BASE}/de/batch.json?ns=common,nav`]);
  });

  it("namespaced project, selective single namespace", async () => {
    const { fetchFn, translationUrls } = recordingFetch(NAMESPACED);
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de", {
      namespaces: ["nav"],
    });
    expect(translationUrls()).toEqual([`${BASE}/de/nav.json`]);
  });
});

describe("manifest with a version → immutable snapshot requests", () => {
  it("single-file project fetches /v/{version}/{locale}/translations.json", async () => {
    const { fetchFn, translationUrls } = recordingFetch(
      withVersion(SINGLE_FILE, "de"),
    );
    const messages = await createI18nCore({
      ...CONFIG,
      fetch: fetchFn,
    }).getMessages("de");
    expect(translationUrls()).toEqual([`${BASE}/v/${V}/de/translations.json`]);
    expect(messages).toEqual({ common: { hello: "single" } });
  });

  it("namespaced project fetches each namespace from the snapshot instead of batch.json", async () => {
    const { fetchFn, translationUrls } = recordingFetch(
      withVersion(NAMESPACED, "de"),
    );
    const messages = await createI18nCore({
      ...CONFIG,
      fetch: fetchFn,
    }).getMessages("de");
    expect(translationUrls().sort()).toEqual([
      `${BASE}/v/${V}/de/common.json`,
      `${BASE}/v/${V}/de/nav.json`,
    ]);
    expect(messages).toEqual({
      common: { hello: "common" },
      nav: { hello: "nav" },
    });
  });

  it("selective namespaces use the snapshot too", async () => {
    const { fetchFn, translationUrls } = recordingFetch(
      withVersion(NAMESPACED, "de"),
    );
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de", {
      namespaces: ["common", "nav"],
    });
    expect(translationUrls().sort()).toEqual([
      `${BASE}/v/${V}/de/common.json`,
      `${BASE}/v/${V}/de/nav.json`,
    ]);
  });

  it("a locale without a version keeps the legacy path while another locale is versioned", async () => {
    const { fetchFn, translationUrls } = recordingFetch(
      withVersion(NAMESPACED, "de"),
    );
    const core = createI18nCore({ ...CONFIG, fetch: fetchFn });
    await core.getMessages("en");
    expect(translationUrls()).toEqual([`${BASE}/en/batch.json?ns=common,nav`]);
  });

  it("a malformed version never reaches the URL", async () => {
    const { fetchFn, translationUrls } = recordingFetch(
      withVersion(SINGLE_FILE, "de", "../x"),
    );
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de");
    expect(translationUrls()).toEqual([`${BASE}/de/translations.json`]);
  });

  it("the manifest itself is still fetched from the unversioned path", async () => {
    const { fetchFn, urls } = recordingFetch(withVersion(SINGLE_FILE, "de"));
    await createI18nCore({ ...CONFIG, fetch: fetchFn }).getMessages("de");
    expect(urls[0]).toBe(`${BASE}/manifest.json`);
  });
});
