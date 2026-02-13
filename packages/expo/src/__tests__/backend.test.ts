import { describe, expect, it, mock, beforeEach } from "bun:test";
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

const createMockFetch = (data: Record<string, unknown> = MOCK_TRANSLATIONS) =>
  mock(() =>
    Promise.resolve(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
  );

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
    expect(mockFetch).toHaveBeenCalledTimes(1);
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

    // Only one CDN fetch (second read from memory cache)
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should fall back to persistent cache when CDN is down", async () => {
    const backend1 = new BetterI18nBackend();
    backend1.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    await readFromBackend(backend1, "en");

    // Simulate app restart with CDN down
    const failingFetch = createFailingFetch();
    const backend2 = new BetterI18nBackend();
    backend2.init({} as never, {
      project: "acme/app",
      storage,
      fetch: failingFetch as typeof fetch,
    }, {});

    const data = await readFromBackend(backend2, "en");
    expect(data).toEqual(MOCK_TRANSLATIONS);
    expect(failingFetch).toHaveBeenCalledTimes(1);
  });

  it("should always get fresh data from CDN after app restart", async () => {
    const backend1 = new BetterI18nBackend();
    backend1.init({} as never, {
      project: "acme/app",
      storage,
      fetch: mockFetch as typeof fetch,
    }, {});

    await readFromBackend(backend1, "en");

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
    expect(updatedFetch).toHaveBeenCalledTimes(1);
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
    let callCount = 0;
    const multiFetch = mock((url: string) => {
      callCount++;
      const data = (url as string).includes("/tr/")
        ? trTranslations
        : MOCK_TRANSLATIONS;
      return Promise.resolve(
        new Response(JSON.stringify(data), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
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
    expect(callCount).toBe(2);
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
