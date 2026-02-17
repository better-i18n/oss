import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createI18nCore,
  clearManifestCache,
  clearMessagesCache,
} from "../cdn";
import { createMemoryStorage } from "../storage/memory";
import type { ManifestResponse, Messages, TranslationStorage } from "../types";

// ─── Test fixtures ──────────────────────────────────────────────────

const MANIFEST: ManifestResponse = {
  projectSlug: "dashboard",
  sourceLanguage: "en",
  languages: [
    { code: "en", name: "English", isSource: true },
    { code: "tr", name: "Turkish" },
  ],
  updatedAt: "2026-01-01T00:00:00Z",
};

const MESSAGES_EN: Messages = {
  common: { hello: "Hello", goodbye: "Goodbye" },
};

const MESSAGES_TR: Messages = {
  common: { hello: "Merhaba", goodbye: "Hoşçakal" },
};

const BASE_CONFIG = {
  project: "acme/dashboard",
  defaultLocale: "en",
  cdnBaseUrl: "https://cdn.test.com",
};

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Create a mock fetch that responds with given data, or throws.
 */
const createMockFetch = (
  responses: Record<string, { ok: boolean; data?: unknown; throws?: boolean }>
): typeof fetch => {
  return vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    // Check if aborted
    if (init?.signal?.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }

    const url = typeof input === "string" ? input : input.toString();

    for (const [pattern, response] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        if (response.throws) {
          throw new Error(`Network error for ${pattern}`);
        }
        return {
          ok: response.ok,
          status: response.ok ? 200 : 500,
          json: async () => response.data,
        } as Response;
      }
    }

    throw new Error(`Unmocked URL: ${url}`);
  }) as typeof fetch;
};

/**
 * Create a fetch that hangs forever (for timeout tests)
 */
const createHangingFetch = (): typeof fetch => {
  return vi.fn(
    (_input: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        // Listen for abort signal
        if (init?.signal) {
          init.signal.addEventListener("abort", () => {
            reject(
              new DOMException("The operation was aborted.", "AbortError")
            );
          });
        }
        // Never resolves otherwise
      })
  ) as typeof fetch;
};

// ─── Tests ──────────────────────────────────────────────────────────

describe("cdn fallback", () => {
  beforeEach(() => {
    clearManifestCache();
    clearMessagesCache();
  });

  // ─── CDN success path ───────────────────────────────────────────

  describe("CDN success path", () => {
    it("fetches messages from CDN successfully", async () => {
      const mockFetch = createMockFetch({
        "manifest.json": { ok: true, data: MANIFEST },
        "en/translations.json": { ok: true, data: MESSAGES_EN },
      });

      const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
      const messages = await i18n.getMessages("en");

      expect(messages).toEqual(MESSAGES_EN);
    });

    it("fetches manifest from CDN successfully", async () => {
      const mockFetch = createMockFetch({
        "manifest.json": { ok: true, data: MANIFEST },
      });

      const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
      const manifest = await i18n.getManifest();

      expect(manifest.languages).toHaveLength(2);
      expect(manifest.languages[0].code).toBe("en");
    });

    it("caches messages in memory on subsequent calls", async () => {
      const mockFetch = createMockFetch({
        "en/translations.json": { ok: true, data: MESSAGES_EN },
      });

      const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });

      await i18n.getMessages("en");
      await i18n.getMessages("en");

      // Should only fetch once — second call served from memory
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("writes through to storage on CDN success", async () => {
      const storage = createMemoryStorage();
      const setSpy = vi.spyOn(storage, "set");

      const mockFetch = createMockFetch({
        "en/translations.json": { ok: true, data: MESSAGES_EN },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        storage,
      });

      await i18n.getMessages("en");

      // Wait for fire-and-forget storage write
      await new Promise((r) => setTimeout(r, 10));

      expect(setSpy).toHaveBeenCalledWith(
        expect.stringContaining("messages"),
        expect.any(String)
      );
    });
  });

  // ─── CDN failure → storage fallback ─────────────────────────────

  describe("CDN failure → storage fallback", () => {
    it("falls back to storage when CDN fails for messages", async () => {
      const storage = createMemoryStorage();

      // Pre-populate storage with cached messages
      await storage.set(
        "@better-i18n:messages:acme/dashboard:en",
        JSON.stringify(MESSAGES_EN)
      );

      const mockFetch = createMockFetch({
        "en/translations.json": { ok: false },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        storage,
        retryCount: 0,
      });

      const messages = await i18n.getMessages("en");
      expect(messages).toEqual(MESSAGES_EN);
    });

    it("falls back to storage when CDN fails for manifest", async () => {
      const storage = createMemoryStorage();

      // Pre-populate storage with cached manifest
      await storage.set(
        "@better-i18n:manifest:acme/dashboard",
        JSON.stringify(MANIFEST)
      );

      const mockFetch = createMockFetch({
        "manifest.json": { ok: false },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        storage,
        retryCount: 0,
      });

      const manifest = await i18n.getManifest();
      expect(manifest.languages).toHaveLength(2);
    });

    it("falls back to storage on network error", async () => {
      const storage = createMemoryStorage();

      await storage.set(
        "@better-i18n:messages:acme/dashboard:tr",
        JSON.stringify(MESSAGES_TR)
      );

      const mockFetch = createMockFetch({
        "tr/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        storage,
        retryCount: 0,
      });

      const messages = await i18n.getMessages("tr");
      expect(messages).toEqual(MESSAGES_TR);
    });
  });

  // ─── CDN failure + storage miss → staticData ────────────────────

  describe("CDN failure + storage miss → staticData fallback", () => {
    it("falls back to staticData when CDN and storage fail", async () => {
      const mockFetch = createMockFetch({
        "en/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        staticData: { en: MESSAGES_EN, tr: MESSAGES_TR },
        retryCount: 0,
      });

      const messages = await i18n.getMessages("en");
      expect(messages).toEqual(MESSAGES_EN);
    });

    it("resolves lazy staticData function", async () => {
      const mockFetch = createMockFetch({
        "tr/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        staticData: async () => ({ en: MESSAGES_EN, tr: MESSAGES_TR }),
        retryCount: 0,
      });

      const messages = await i18n.getMessages("tr");
      expect(messages).toEqual(MESSAGES_TR);
    });

    it("throws when locale not in staticData", async () => {
      const mockFetch = createMockFetch({
        "fr/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        staticData: { en: MESSAGES_EN },
        retryCount: 0,
      });

      await expect(i18n.getMessages("fr")).rejects.toThrow();
    });
  });

  // ─── Complete failure ───────────────────────────────────────────

  describe("complete failure (no CDN, no storage, no staticData)", () => {
    it("throws when all sources fail for messages", async () => {
      const mockFetch = createMockFetch({
        "en/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        retryCount: 0,
      });

      await expect(i18n.getMessages("en")).rejects.toThrow();
    });

    it("throws when all sources fail for manifest", async () => {
      const mockFetch = createMockFetch({
        "manifest.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        retryCount: 0,
      });

      await expect(i18n.getManifest()).rejects.toThrow();
    });
  });

  // ─── Timeout ────────────────────────────────────────────────────

  describe("timeout", () => {
    it("aborts fetch after timeout and falls back to storage", async () => {
      const storage = createMemoryStorage();

      await storage.set(
        "@better-i18n:messages:acme/dashboard:en",
        JSON.stringify(MESSAGES_EN)
      );

      const hangingFetch = createHangingFetch();

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: hangingFetch,
        storage,
        fetchTimeout: 50, // 50ms timeout for fast test
        retryCount: 0,
      });

      const messages = await i18n.getMessages("en");
      expect(messages).toEqual(MESSAGES_EN);
    });

    it("aborts manifest fetch after timeout and falls back to storage", async () => {
      const storage = createMemoryStorage();

      await storage.set(
        "@better-i18n:manifest:acme/dashboard",
        JSON.stringify(MANIFEST)
      );

      const hangingFetch = createHangingFetch();

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: hangingFetch,
        storage,
        fetchTimeout: 50,
        retryCount: 0,
      });

      const manifest = await i18n.getManifest();
      expect(manifest.languages).toHaveLength(2);
    });
  });

  // ─── Retry logic ────────────────────────────────────────────────

  describe("retry logic", () => {
    it("retries on failure before falling back", async () => {
      let callCount = 0;

      const flakyFetch = vi.fn(async (input: string | URL | Request) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("translations.json")) {
          callCount++;
          if (callCount <= 2) {
            throw new Error("Transient error");
          }
          return {
            ok: true,
            status: 200,
            json: async () => MESSAGES_EN,
          } as Response;
        }
        throw new Error(`Unmocked URL: ${url}`);
      }) as typeof fetch;

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: flakyFetch,
        retryCount: 2,
        fetchTimeout: 5000,
      });

      const messages = await i18n.getMessages("en");
      expect(messages).toEqual(MESSAGES_EN);
      // 1st attempt + 2 retries = 3 calls total
      expect(callCount).toBe(3);
    });

    it("falls back to storage after all retries exhausted", async () => {
      const storage = createMemoryStorage();
      await storage.set(
        "@better-i18n:messages:acme/dashboard:en",
        JSON.stringify(MESSAGES_EN)
      );

      let callCount = 0;
      const alwaysFailFetch = vi.fn(async () => {
        callCount++;
        throw new Error("Network error");
      }) as typeof fetch;

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: alwaysFailFetch,
        storage,
        retryCount: 2,
        fetchTimeout: 5000,
      });

      const messages = await i18n.getMessages("en");
      expect(messages).toEqual(MESSAGES_EN);
      // 1st attempt + 2 retries = 3 calls
      expect(callCount).toBe(3);
    });
  });

  // ─── Storage adapter ────────────────────────────────────────────

  describe("storage adapter", () => {
    it("createMemoryStorage works correctly", async () => {
      const storage = createMemoryStorage();

      expect(await storage.get("key")).toBeNull();

      await storage.set("key", "value");
      expect(await storage.get("key")).toBe("value");

      await storage.remove!("key");
      expect(await storage.get("key")).toBeNull();
    });

    it("handles storage.get errors gracefully", async () => {
      const brokenStorage: TranslationStorage = {
        get: async () => {
          throw new Error("Storage read failed");
        },
        set: async () => {
          throw new Error("Storage write failed");
        },
      };

      const mockFetch = createMockFetch({
        "en/translations.json": { ok: false, throws: true },
      });

      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        storage: brokenStorage,
        retryCount: 0,
      });

      // Should still throw CDN error even though storage also fails
      await expect(i18n.getMessages("en")).rejects.toThrow();
    });
  });

  // ─── Config defaults ───────────────────────────────────────────

  describe("config defaults", () => {
    it("uses default fetchTimeout of 10000ms", () => {
      const mockFetch = createMockFetch({});
      const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
      expect(i18n.config.fetchTimeout).toBe(10000);
    });

    it("uses default retryCount of 1", () => {
      const mockFetch = createMockFetch({});
      const i18n = createI18nCore({ ...BASE_CONFIG, fetch: mockFetch });
      expect(i18n.config.retryCount).toBe(1);
    });

    it("allows overriding fetchTimeout", () => {
      const mockFetch = createMockFetch({});
      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        fetchTimeout: 5000,
      });
      expect(i18n.config.fetchTimeout).toBe(5000);
    });

    it("allows overriding retryCount", () => {
      const mockFetch = createMockFetch({});
      const i18n = createI18nCore({
        ...BASE_CONFIG,
        fetch: mockFetch,
        retryCount: 3,
      });
      expect(i18n.config.retryCount).toBe(3);
    });
  });
});
