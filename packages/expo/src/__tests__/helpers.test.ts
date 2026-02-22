import { describe, expect, it, mock, beforeEach } from "bun:test";
import type { i18n as I18nType } from "i18next";
import { initBetterI18n } from "../helpers";
import { createMemoryStorage } from "../storage";

// ---------------------------------------------------------------------------
// Mutable CDN fixtures — reassign in beforeEach or individual tests
// ---------------------------------------------------------------------------

let mockMessages: Record<string, Record<string, string>> = {
  auth: { login: "Sign In", logout: "Sign Out" },
  common: { welcome: "Welcome", goodbye: "Goodbye" },
};

let mockLanguages: { code: string }[] = [{ code: "en" }, { code: "tr" }];

// ---------------------------------------------------------------------------
// Mock @better-i18n/core — prevents real CDN calls.
// Bun hoists mock.module() to before any import resolution.
// ---------------------------------------------------------------------------

mock.module("@better-i18n/core", () => ({
  createI18nCore: (_config: unknown) => ({
    getMessages: async (_locale: string) => mockMessages,
    getLanguages: async () => mockLanguages,
  }),
  normalizeLocale: (l: string) => l.toLowerCase(),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a lightweight i18next instance mock with a simulated resource store.
 * Tracks all addResourceBundle calls and registered languageChanged listeners.
 */
function createMockI18n() {
  const bundles = new Map<string, unknown>();
  const listeners: Record<string, Array<(arg: string) => void>> = {};

  const initMock = mock(async (_opts: unknown) => {});

  const addResourceBundleMock = mock(
    (locale: string, ns: string, data: unknown) => {
      bundles.set(`${locale}:${ns}`, data);
    }
  );

  const hasResourceBundleMock = mock((locale: string, ns: string) =>
    bundles.has(`${locale}:${ns}`)
  );

  const changeLanguageMock = mock(async (_lng?: string) => {});

  const onMock = mock((event: string, listener: (arg: string) => void) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event]!.push(listener);
  });

  const i18n = {
    init: initMock,
    addResourceBundle: addResourceBundleMock,
    hasResourceBundle: hasResourceBundleMock,
    changeLanguage: changeLanguageMock,
    on: onMock,
  } as unknown as I18nType;

  return {
    i18n,
    bundles,
    listeners,
    mocks: {
      init: initMock,
      addResourceBundle: addResourceBundleMock,
      hasResourceBundle: hasResourceBundleMock,
      changeLanguage: changeLanguageMock,
      on: onMock,
    },
  };
}

const PROJECT = "acme/test-app";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("initBetterI18n", () => {
  beforeEach(() => {
    mockMessages = {
      auth: { login: "Sign In", logout: "Sign Out" },
      common: { welcome: "Welcome", goodbye: "Goodbye" },
    };
    mockLanguages = [{ code: "en" }, { code: "tr" }];
  });

  it("calls i18next.init with defaultNS: 'translation' and fallbackNS: 'translation'", async () => {
    const { i18n, mocks } = createMockI18n();

    await initBetterI18n({
      project: PROJECT,
      i18n,
      storage: createMemoryStorage(),
      defaultLocale: "en",
    });

    expect(mocks.init).toHaveBeenCalledTimes(1);
    const initOpts = mocks.init.mock.calls[0]![0] as Record<string, unknown>;
    expect(initOpts["defaultNS"]).toBe("translation");
    expect(initOpts["fallbackNS"]).toBe("translation");
  });

  it("resources[lng] contains merged 'translation' bundle and individual namespaces", async () => {
    const { i18n, mocks } = createMockI18n();

    await initBetterI18n({
      project: PROJECT,
      i18n,
      storage: createMemoryStorage(),
      defaultLocale: "en",
    });

    const initOpts = mocks.init.mock.calls[0]![0] as Record<string, unknown>;
    const resources = initOpts["resources"] as Record<
      string,
      Record<string, unknown>
    >;

    // Merged into "translation" NS — enables t('auth.login')
    expect(resources["en"]!["translation"]).toEqual(mockMessages);

    // Individual namespaces — enables t('auth:login') and useTranslation('auth')
    expect(resources["en"]!["auth"]).toEqual(mockMessages.auth);
    expect(resources["en"]!["common"]).toEqual(mockMessages.common);
  });

  it("returns { core, languages } from CDN manifest", async () => {
    const { i18n } = createMockI18n();

    const result = await initBetterI18n({
      project: PROJECT,
      i18n,
      storage: createMemoryStorage(),
      defaultLocale: "en",
    });

    expect(result.core).toBeDefined();
    expect(result.languages).toEqual(mockLanguages);
  });

  // -------------------------------------------------------------------------
  // changeLanguage override
  // -------------------------------------------------------------------------

  describe("changeLanguage override", () => {
    it("calls addResourceBundle when 'translation' NS is missing for new locale", async () => {
      const { i18n, mocks } = createMockI18n();

      await initBetterI18n({
        project: PROJECT,
        i18n,
        storage: createMemoryStorage(),
        defaultLocale: "en",
      });

      mocks.addResourceBundle.mockClear();

      // "tr" has no pre-loaded translations
      await i18n.changeLanguage("tr");

      const calls = mocks.addResourceBundle.mock.calls as Array<
        [string, string, unknown]
      >;
      expect(calls.length).toBeGreaterThan(0);
      expect(calls.every(([locale]) => locale === "tr")).toBe(true);
      expect(calls.some(([, ns]) => ns === "translation")).toBe(true);
    });

    it("skips addResourceBundle when 'translation' NS already exists", async () => {
      const { i18n, mocks, bundles } = createMockI18n();

      await initBetterI18n({
        project: PROJECT,
        i18n,
        storage: createMemoryStorage(),
        defaultLocale: "en",
      });

      // Simulate "tr" already loaded
      bundles.set("tr:translation", mockMessages);
      mocks.addResourceBundle.mockClear();

      await i18n.changeLanguage("tr");

      const calls = mocks.addResourceBundle.mock.calls as Array<
        [string, string, unknown]
      >;
      const trCalls = calls.filter(([locale]) => locale === "tr");
      expect(trCalls).toHaveLength(0);
    });

    it("pre-load registers both individual namespace bundles and merged 'translation' bundle", async () => {
      const { i18n, mocks } = createMockI18n();

      await initBetterI18n({
        project: PROJECT,
        i18n,
        storage: createMemoryStorage(),
        defaultLocale: "en",
      });

      mocks.addResourceBundle.mockClear();
      await i18n.changeLanguage("tr");

      const calls = mocks.addResourceBundle.mock.calls as Array<
        [string, string, unknown]
      >;
      const namespaces = calls.map(([, ns]) => ns);

      // addAllNamespaces: one call per CDN namespace
      expect(namespaces).toContain("auth");
      expect(namespaces).toContain("common");

      // addTranslationBundle: merged "translation" NS (dot-notation support)
      expect(namespaces).toContain("translation");
    });
  });

  // -------------------------------------------------------------------------
  // languageChanged listener (safety-net)
  // -------------------------------------------------------------------------

  describe("languageChanged listener", () => {
    it("loads 'translation' NS and individual namespaces for the new language", async () => {
      const { i18n, mocks, listeners } = createMockI18n();

      await initBetterI18n({
        project: PROJECT,
        i18n,
        storage: createMemoryStorage(),
        defaultLocale: "en",
      });

      mocks.addResourceBundle.mockClear();

      // Directly trigger the safety-net listener
      const listener = listeners["languageChanged"]![0]! as (
        lang: string
      ) => Promise<void>;
      await listener("tr");

      const calls = mocks.addResourceBundle.mock.calls as Array<
        [string, string, unknown]
      >;
      const namespaces = calls.map(([, ns]) => ns);
      expect(namespaces).toContain("translation");
      expect(namespaces).toContain("auth");
      expect(namespaces).toContain("common");
    });

    it("does nothing when 'translation' NS is already loaded for the new language", async () => {
      const { i18n, mocks, bundles, listeners } = createMockI18n();

      await initBetterI18n({
        project: PROJECT,
        i18n,
        storage: createMemoryStorage(),
        defaultLocale: "en",
      });

      // Pre-populate "tr:translation" — safety-net should be a no-op
      bundles.set("tr:translation", mockMessages);
      mocks.addResourceBundle.mockClear();

      const listener = listeners["languageChanged"]![0]! as (
        lang: string
      ) => Promise<void>;
      await listener("tr");

      const calls = mocks.addResourceBundle.mock.calls as Array<
        [string, string, unknown]
      >;
      const trCalls = calls.filter(([locale]) => locale === "tr");
      expect(trCalls).toHaveLength(0);
    });
  });
});
