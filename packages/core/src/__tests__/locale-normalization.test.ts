import { describe, it, expect, beforeEach, vi } from "vitest";
import { normalizeLocale } from "../utils/locale";
import {
  createI18nCore,
  clearManifestCache,
  clearMessagesCache,
} from "../cdn";
import type { Messages } from "../types";

// ─── Unit tests: normalizeLocale ─────────────────────────────────────

describe("normalizeLocale", () => {
  it("lowercases simple locale codes", () => {
    expect(normalizeLocale("EN")).toBe("en");
    expect(normalizeLocale("TR")).toBe("tr");
    expect(normalizeLocale("De")).toBe("de");
  });

  it("lowercases sub-locale codes with hyphen", () => {
    expect(normalizeLocale("pt-BR")).toBe("pt-br");
    expect(normalizeLocale("en-US")).toBe("en-us");
    expect(normalizeLocale("zh-TW")).toBe("zh-tw");
  });

  it("converts underscore separator to hyphen", () => {
    expect(normalizeLocale("zh_TW")).toBe("zh-tw");
    expect(normalizeLocale("pt_BR")).toBe("pt-br");
    expect(normalizeLocale("en_US")).toBe("en-us");
  });

  it("handles script subtags (BCP 47 extended)", () => {
    expect(normalizeLocale("zh-Hant-TW")).toBe("zh-hant-tw");
    expect(normalizeLocale("zh-Hans-CN")).toBe("zh-hans-cn");
    expect(normalizeLocale("sr-Latn-RS")).toBe("sr-latn-rs");
  });

  it("is idempotent on already-normalized input", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("pt-br")).toBe("pt-br");
    expect(normalizeLocale("zh-hant-tw")).toBe("zh-hant-tw");
  });

  it("handles mixed separators", () => {
    expect(normalizeLocale("zh_Hant-TW")).toBe("zh-hant-tw");
  });
});

// ─── Integration tests: CDN fetch with sub-locale normalization ──────

describe("CDN locale normalization", () => {
  const MESSAGES_PT_BR: Messages = {
    common: { hello: "Olá", goodbye: "Tchau" },
  };

  const BASE_CONFIG = {
    project: "acme/dashboard",
    defaultLocale: "en",
    cdnBaseUrl: "https://cdn.test.com",
  };

  beforeEach(() => {
    clearManifestCache();
    clearMessagesCache();
  });

  it('fetches "pt-BR" as "pt-br" from CDN', async () => {
    const mockFetch = vi.fn(async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("pt-br/translations.json")) {
        return {
          ok: true,
          status: 200,
          json: async () => MESSAGES_PT_BR,
        } as Response;
      }
      throw new Error(`Unmocked URL: ${url}`);
    }) as typeof fetch;

    const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
    const messages = await i18n.getMessages("pt-BR");

    expect(messages).toEqual(MESSAGES_PT_BR);
    // Verify the URL used lowercase
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("pt-br/translations.json"),
      expect.anything(),
    );
  });

  it('normalizes "EN" to "en" for CDN fetch', async () => {
    const MESSAGES_EN: Messages = { common: { hello: "Hello" } };

    const mockFetch = vi.fn(async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("en/translations.json")) {
        return {
          ok: true,
          status: 200,
          json: async () => MESSAGES_EN,
        } as Response;
      }
      throw new Error(`Unmocked URL: ${url}`);
    }) as typeof fetch;

    const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
    const messages = await i18n.getMessages("EN");

    expect(messages).toEqual(MESSAGES_EN);
  });

  it('normalizes underscore "zh_TW" to "zh-tw" for CDN fetch', async () => {
    const MESSAGES_ZH_TW: Messages = { common: { hello: "你好" } };

    const mockFetch = vi.fn(async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("zh-tw/translations.json")) {
        return {
          ok: true,
          status: 200,
          json: async () => MESSAGES_ZH_TW,
        } as Response;
      }
      throw new Error(`Unmocked URL: ${url}`);
    }) as typeof fetch;

    const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
    const messages = await i18n.getMessages("zh_TW");

    expect(messages).toEqual(MESSAGES_ZH_TW);
  });

  it("uses normalized locale for storage key", async () => {
    const storage = {
      get: vi.fn(async () => null),
      set: vi.fn(async () => {}),
    };

    const mockFetch = vi.fn(async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("pt-br/translations.json")) {
        return {
          ok: true,
          status: 200,
          json: async () => MESSAGES_PT_BR,
        } as Response;
      }
      throw new Error(`Unmocked URL: ${url}`);
    }) as typeof fetch;

    const i18n = createI18nCore({
      ...BASE_CONFIG,
      fetch: mockFetch,
      storage,
    });

    await i18n.getMessages("pt-BR");

    // Wait for fire-and-forget storage write
    await new Promise((r) => setTimeout(r, 10));

    // Storage key should use normalized "pt-br", not "pt-BR"
    expect(storage.set).toHaveBeenCalledWith(
      expect.stringContaining("pt-br"),
      expect.any(String),
    );
  });
});
