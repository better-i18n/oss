import { describe, expect, it, mock, beforeEach } from "bun:test";
import { clearManifestCache, clearMessagesCache } from "@better-i18n/core";
import { BetterI18nBackend } from "../backend";
import { createMemoryStorage } from "../storage";
import type { TranslationStorage } from "../types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MOCK_TRANSLATIONS = {
  welcome: "Welcome",
  goodbye: "Goodbye",
};

const MOCK_NAMESPACED_TRANSLATIONS = {
  "common.hero.title": "Welcome to My App",
  "common.hero.subtitle": "The best app ever",
  "common.nav.home": "Home",
  "common.nav.about": "About",
  "auth.login.title": "Sign In",
  "auth.login.button": "Log In",
};

const MOCK_NESTED_TRANSLATIONS = {
  common: {
    hero: { title: "Welcome to My App" },
    nav: { home: "Home", about: "About" },
  },
  auth: {
    login: { title: "Sign In", button: "Log In" },
  },
};

/**
 * Minimal manifest payload shared by every test's mock fetch. The SDK's core
 * `getMessages` fetches the manifest up front to derive a version suffix for
 * its cache key (see oss/packages/core/src/cdn.ts). Without a valid manifest
 * response, the derivation falls back to "unversioned" AND the manifest fetch
 * retries on every call — breaking cache-hit assertions below. Returning a
 * proper manifest once lets core's TtlCache short-circuit subsequent reads.
 */
const buildMockManifest = (locale: string) => ({
  languages: [{ code: locale, name: locale, isSource: true }],
  files: {
    [locale]: {
      url: `https://cdn.better-i18n.com/acme/app/${locale}/translations.json`,
      size: 100,
      lastModified: "2026-01-01T00:00:00.000Z",
    },
  },
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const createMockFetch = (
  data: Record<string, unknown> = MOCK_TRANSLATIONS,
  locale = "en",
) =>
  mock((input: string | Request | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    const body = url.includes("manifest.json")
      ? JSON.stringify(buildMockManifest(locale))
      : JSON.stringify(data);
    return Promise.resolve(
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

const createFailingFetch = () =>
  mock(() =>
    Promise.resolve(
      new Response("Internal Server Error", { status: 500 })
    )
  );

const readFromBackend = (
  backend: BetterI18nBackend,
  language: string,
  namespace = "translation"
): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    backend.read(language, namespace, (err, data) => {
      if (err) reject(err);
      else resolve(data as Record<string, unknown>);
    });
  });

/**
 * Create a mock i18next Services object with a spyable resourceStore.
 */
const createMockServices = () => {
  const bundles: Array<{ lng: string; ns: string; resources: Record<string, unknown> }> = [];
  return {
    services: {
      resourceStore: {
        addResourceBundle: mock(
          (lng: string, ns: string, resources: Record<string, unknown>) => {
            bundles.push({ lng, ns, resources });
          }
        ),
      },
    } as never,
    bundles,
  };
};

// ---------------------------------------------------------------------------
// Unit tests (mock fetch)
// ---------------------------------------------------------------------------

describe("BetterI18nBackend", () => {
  let storage: TranslationStorage;
  let mockFetch: ReturnType<typeof createMockFetch>;

  beforeEach(() => {
    storage = createMemoryStorage();
    mockFetch = createMockFetch();
    // Clear core's global caches to prevent test cross-contamination
    clearManifestCache();
    clearMessagesCache();
  });

  it("should have correct type", () => {
    expect(BetterI18nBackend.type).toBe("backend");
    const backend = new BetterI18nBackend();
    expect(backend.type).toBe("backend");
  });

  it("should throw if project is not provided", () => {
    const backend = new BetterI18nBackend();
    expect(() =>
      backend.init(
        {} as never,
        { project: "" },
        {}
      )
    ).toThrow("`project` is required");
  });

  it("should fetch translations from CDN on first read", async () => {
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    const data = await readFromBackend(backend, "en");
    expect(data).toEqual(MOCK_TRANSLATIONS);
    // First read: 1 manifest + 1 translations = 2 CDN round-trips.
    // The manifest fetch feeds the version suffix on the messages cache key.
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should serve from memory cache on second read", async () => {
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    await readFromBackend(backend, "en");
    await readFromBackend(backend, "en");

    // First read: 2 fetches (manifest + translations). Second read: 0 —
    // manifest and messages both served from their TtlCache.
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should fall back to persistent cache when CDN is down", async () => {
    const backend1 = new BetterI18nBackend();
    backend1.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    await readFromBackend(backend1, "en");

    // Simulate app restart: clear core's global caches
    clearManifestCache();
    clearMessagesCache();
    const failingFetch = createFailingFetch();
    const backend2 = new BetterI18nBackend();
    backend2.init({} as never, {
      project: "acme/app",
      storage,
      fetch: failingFetch as typeof fetch,
    }, {});

    const data = await readFromBackend(backend2, "en");
    expect(data).toEqual(MOCK_TRANSLATIONS);
    // Fall-back path: core tries the manifest first, it 500s; core then tries
    // the messages file, it 500s too; both fall through to the persistent
    // storage written by backend1's successful read. Two CDN attempts.
    expect(failingFetch).toHaveBeenCalledTimes(2);
  });

  it("should always get fresh data from CDN after app restart", async () => {
    const backend1 = new BetterI18nBackend();
    backend1.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    await readFromBackend(backend1, "en");

    // Simulate app restart: clear core's global caches
    clearManifestCache();
    clearMessagesCache();

    // CDN now has updated translations
    const updatedTranslations = { welcome: "Welcome Updated", goodbye: "Goodbye" };
    const updatedFetch = createMockFetch(updatedTranslations);

    const backend2 = new BetterI18nBackend();
    backend2.init({} as never, {
      project: "acme/app",
      storage,
      fetch: updatedFetch as typeof fetch,
    }, {});

    const data = await readFromBackend(backend2, "en");
    expect(data).toEqual(updatedTranslations);
    // Post-restart the caches are empty, so the new backend must re-fetch
    // both the manifest (for version) and the translations payload.
    expect(updatedFetch).toHaveBeenCalledTimes(2);
  });

  it("should throw when CDN fails and no cache exists", async () => {
    const failingFetch = createFailingFetch();
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: failingFetch as typeof fetch,
    }, {});

    await expect(readFromBackend(backend, "en")).rejects.toThrow();
  });

  it("should extract namespace from flat keys", async () => {
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: createMockFetch(MOCK_NAMESPACED_TRANSLATIONS) as typeof fetch,
    }, {});

    const data = await readFromBackend(backend, "en", "common");
    expect(data).toEqual({
      "hero.title": "Welcome to My App",
      "hero.subtitle": "The best app ever",
      "nav.home": "Home",
      "nav.about": "About",
    });
  });

  it("should extract different namespaces independently", async () => {
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: createMockFetch(MOCK_NAMESPACED_TRANSLATIONS) as typeof fetch,
    }, {});

    const authData = await readFromBackend(backend, "en", "auth");
    expect(authData).toEqual({
      "login.title": "Sign In",
      "login.button": "Log In",
    });
  });

  it("should return all data when namespace has no matches", async () => {
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    const data = await readFromBackend(backend, "en", "nonexistent");
    expect(data).toEqual(MOCK_TRANSLATIONS);
  });

  it("should auto-register other namespaces via resourceStore (nested format)", async () => {
    const { services, bundles } = createMockServices();
    const backend = new BetterI18nBackend();
    backend.init(services, {
      project: "acme/app",
      storage,
      fetch: createMockFetch(MOCK_NESTED_TRANSLATIONS as Record<string, unknown>) as typeof fetch,
    }, {});

    // Read "common" — should also register "auth" in the store
    const data = await readFromBackend(backend, "en", "common");
    expect(data).toEqual({
      hero: { title: "Welcome to My App" },
      nav: { home: "Home", about: "About" },
    });

    expect(bundles).toHaveLength(1);
    expect(bundles[0]!.lng).toBe("en");
    expect(bundles[0]!.ns).toBe("auth");
    expect(bundles[0]!.resources).toEqual({
      login: { title: "Sign In", button: "Log In" },
    });
  });

  it("should auto-register namespaces from flat keys", async () => {
    const { services, bundles } = createMockServices();
    const backend = new BetterI18nBackend();
    backend.init(services, {
      project: "acme/app",
      storage,
      fetch: createMockFetch(MOCK_NAMESPACED_TRANSLATIONS) as typeof fetch,
    }, {});

    // Read "common" — should also register "auth"
    await readFromBackend(backend, "en", "common");

    expect(bundles).toHaveLength(1);
    expect(bundles[0]!.ns).toBe("auth");
    expect(bundles[0]!.resources).toEqual({
      "login.title": "Sign In",
      "login.button": "Log In",
    });
  });

  it("should not fail when resourceStore.addResourceBundle is unavailable", async () => {
    const backend = new BetterI18nBackend();
    // Pass empty services — no resourceStore
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: createMockFetch(MOCK_NESTED_TRANSLATIONS as Record<string, unknown>) as typeof fetch,
    }, {});

    // Should still return the correct namespace data without throwing
    const data = await readFromBackend(backend, "en", "common");
    expect(data).toEqual({
      hero: { title: "Welcome to My App" },
      nav: { home: "Home", about: "About" },
    });
  });

  it("should handle different languages independently", async () => {
    const trTranslations = { welcome: "Hosgeldiniz" };
    let translationFetches = 0;
    const multiFetch = mock((input: string | Request | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      // Manifest serves both locales; version is shared so every messages
      // fetch reuses the manifest's TtlCache hit on subsequent calls.
      if (url.includes("manifest.json")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              languages: [
                { code: "en", name: "English", isSource: true },
                { code: "tr", name: "Turkish", isSource: false },
              ],
              files: {
                en: {
                  url: "https://cdn.better-i18n.com/acme/app/en/translations.json",
                  size: 100,
                  lastModified: "2026-01-01T00:00:00.000Z",
                },
                tr: {
                  url: "https://cdn.better-i18n.com/acme/app/tr/translations.json",
                  size: 100,
                  lastModified: "2026-01-01T00:00:00.000Z",
                },
              },
              updatedAt: "2026-01-01T00:00:00.000Z",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        );
      }
      translationFetches++;
      const data = url.includes("/tr/") ? trTranslations : MOCK_TRANSLATIONS;
      return Promise.resolve(
        new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: "acme/app",
      storage,
      fetch: multiFetch as typeof fetch,
    }, {});

    const enData = await readFromBackend(backend, "en");
    const trData = await readFromBackend(backend, "tr");

    expect(enData).toEqual(MOCK_TRANSLATIONS);
    expect(trData).toEqual(trTranslations);
    // Count only translation fetches — one per locale. The shared manifest
    // is served from TtlCache after the first call across both locales.
    expect(translationFetches).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Integration tests (real CDN – aliosman-co/personal)
// ---------------------------------------------------------------------------

describe("BetterI18nBackend (integration)", () => {
  const PROJECT = "aliosman-co/personal";

  it("should fetch real translations from CDN", async () => {
    const storage = createMemoryStorage();
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: PROJECT,
      storage,
    }, {});

    const data = await readFromBackend(backend, "en", "common");

    // common namespace should have header.name
    expect(data).toBeDefined();
    expect(typeof data).toBe("object");

    const header = data.header as Record<string, unknown> | undefined;
    expect(header).toBeDefined();
    expect(typeof header?.name).toBe("string");
    expect(typeof header?.title).toBe("string");
  });

  it("should serve from persistent cache when CDN is unavailable", async () => {
    const storage = createMemoryStorage();

    // First: populate cache from real CDN
    const backend1 = new BetterI18nBackend();
    backend1.init({} as never, {
      project: PROJECT,
      storage,
    }, {});

    const freshData = await readFromBackend(backend1, "en", "common");
    const headerName = (freshData.header as Record<string, unknown>)?.name;
    expect(headerName).toBeDefined();

    // Second: simulate offline — CDN down, should fall back to cache
    const failingFetch = createFailingFetch();
    const backend2 = new BetterI18nBackend();
    backend2.init({} as never, {
      project: PROJECT,
      storage,
      fetch: failingFetch as typeof fetch,
    }, {});

    const cachedData = await readFromBackend(backend2, "en", "common");
    const cachedHeaderName = (cachedData.header as Record<string, unknown>)?.name;

    // Should get same data from cache
    expect(cachedHeaderName).toBe(headerName);
  });

  it("should fetch multiple locales", async () => {
    const storage = createMemoryStorage();
    const backend = new BetterI18nBackend();
    backend.init({} as never, {
      project: PROJECT,
      storage,
    }, {});

    const enData = await readFromBackend(backend, "en", "common");
    const trData = await readFromBackend(backend, "tr", "common");

    expect(Object.keys(enData).length).toBeGreaterThan(0);
    expect(Object.keys(trData).length).toBeGreaterThan(0);
  });
});
