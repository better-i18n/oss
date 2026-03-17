import { describe, it, expect, vi } from "vitest";
import { loadResources, buildI18nextConfig } from "../i18next.js";
import type { RemixI18n } from "../types.js";
import type { Messages } from "@better-i18n/core";

function createMockI18n(overrides: Partial<RemixI18n> = {}): RemixI18n {
  return {
    config: {
      project: "test/app",
      defaultLocale: "en",
    },
    detectLocale: vi.fn(),
    getMessages: vi.fn(async (locale: string): Promise<Messages> => {
      const data: Record<string, Messages> = {
        en: {
          common: { hello: "Hello", bye: "Goodbye" },
          home: { welcome: "Welcome" },
        },
        tr: {
          common: { hello: "Merhaba", bye: "Hoşça kal" },
          home: { welcome: "Hoş geldiniz" },
        },
      };
      return data[locale] ?? {};
    }),
    getLocales: vi.fn(async () => ["en", "tr"]),
    getLanguages: vi.fn(async () => [
      { code: "en", nativeName: "English", isDefault: true },
      { code: "tr", nativeName: "Türkçe", isDefault: false },
    ]),
    ...overrides,
  };
}

describe("loadResources", () => {
  it("converts CDN messages to i18next resource format", async () => {
    const i18n = createMockI18n();
    const resources = await loadResources(i18n);

    // Each locale should have namespace-level resources
    expect(resources.en.common).toEqual({ hello: "Hello", bye: "Goodbye" });
    expect(resources.en.home).toEqual({ welcome: "Welcome" });
    expect(resources.tr.common).toEqual({ hello: "Merhaba", bye: "Hoşça kal" });
    expect(resources.tr.home).toEqual({ welcome: "Hoş geldiniz" });
  });

  it("adds merged 'translation' namespace for dot-notation access", async () => {
    const i18n = createMockI18n();
    const resources = await loadResources(i18n);

    // "translation" namespace contains the raw messages object
    expect(resources.en.translation).toEqual({
      common: { hello: "Hello", bye: "Goodbye" },
      home: { welcome: "Welcome" },
    });
  });

  it("fetches only specified locales when provided", async () => {
    const i18n = createMockI18n();
    const resources = await loadResources(i18n, ["tr"]);

    expect(Object.keys(resources)).toEqual(["tr"]);
    expect(resources.tr.common).toEqual({ hello: "Merhaba", bye: "Hoşça kal" });
    // getLocales should not have been called
    expect(i18n.getLocales).not.toHaveBeenCalled();
  });

  it("falls back to getLocales() when no locales specified", async () => {
    const i18n = createMockI18n();
    await loadResources(i18n);

    expect(i18n.getLocales).toHaveBeenCalledOnce();
  });

  it("handles empty messages gracefully", async () => {
    const i18n = createMockI18n({
      getMessages: vi.fn(async (): Promise<Messages> => ({})),
      getLocales: vi.fn(async () => ["en"]),
    });
    const resources = await loadResources(i18n);

    expect(resources.en).toEqual({ translation: {} });
  });

  it("skips non-object values in messages", async () => {
    const i18n = createMockI18n({
      getMessages: vi.fn(async (): Promise<Messages> => ({
        common: { hello: "Hello" },
        _meta: "should-be-skipped" as unknown as Record<string, unknown>,
      })),
      getLocales: vi.fn(async () => ["en"]),
    });
    const resources = await loadResources(i18n);

    expect(resources.en.common).toEqual({ hello: "Hello" });
    expect(resources.en._meta).toBeUndefined();
  });
});

describe("buildI18nextConfig", () => {
  it("returns complete i18next middleware config", async () => {
    const i18n = createMockI18n();
    const config = await buildI18nextConfig({ i18n });

    expect(config.supportedLanguages).toEqual(["en", "tr"]);
    expect(config.fallbackLanguage).toBe("en");
    expect(config.languages).toEqual([
      { code: "en", nativeName: "English", isDefault: true },
      { code: "tr", nativeName: "Türkçe", isDefault: false },
    ]);
    expect(config.resources.en.common).toEqual({ hello: "Hello", bye: "Goodbye" });
  });

  it("includes default i18next options", async () => {
    const i18n = createMockI18n();
    const config = await buildI18nextConfig({ i18n });

    expect(config.i18nextOptions).toEqual({
      lowerCaseLng: true,
      defaultNS: "translation",
      fallbackNS: "translation",
      interpolation: { escapeValue: false },
    });
  });

  it("merges custom i18next options", async () => {
    const i18n = createMockI18n();
    const config = await buildI18nextConfig({
      i18n,
      i18nextOptions: { debug: true, defaultNS: "common" },
    });

    const opts = config.i18nextOptions as Record<string, unknown>;
    expect(opts.debug).toBe(true);
    expect(opts.defaultNS).toBe("common");
    // Other defaults should still be present
    expect(opts.lowerCaseLng).toBe(true);
  });
});
