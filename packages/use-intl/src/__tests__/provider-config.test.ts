import { describe, it, expect } from "vitest";
import type { TranslationStorage, Messages } from "@better-i18n/core";
import type { BetterI18nProviderConfig } from "../types.js";

// ─── Test fixtures ──────────────────────────────────────────────────

const mockStorage: TranslationStorage = {
  get: async () => null,
  set: async () => {},
};

const mockStaticData: Record<string, Messages> = {
  en: { common: { hello: "Hello" } },
  tr: { common: { hello: "Merhaba" } },
};

// ─── Tests ──────────────────────────────────────────────────────────

describe("BetterI18nProviderConfig — fallback fields", () => {
  it("accepts storage field", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      storage: mockStorage,
    };

    expect(config.storage).toBe(mockStorage);
  });

  it("accepts staticData field", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      staticData: mockStaticData,
    };

    expect(config.staticData).toBe(mockStaticData);
  });

  it("accepts fetchTimeout field", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      fetchTimeout: 5000,
    };

    expect(config.fetchTimeout).toBe(5000);
  });

  it("accepts retryCount field", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      retryCount: 3,
    };

    expect(config.retryCount).toBe(3);
  });

  it("accepts all fallback fields together", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      storage: mockStorage,
      staticData: mockStaticData,
      fetchTimeout: 7000,
      retryCount: 2,
    };

    expect(config.storage).toBe(mockStorage);
    expect(config.staticData).toBe(mockStaticData);
    expect(config.fetchTimeout).toBe(7000);
    expect(config.retryCount).toBe(2);
  });

  it("works without any fallback fields (backward compat)", () => {
    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
    };

    expect(config.storage).toBeUndefined();
    expect(config.staticData).toBeUndefined();
    expect(config.fetchTimeout).toBeUndefined();
    expect(config.retryCount).toBeUndefined();
  });

  it("supports lazy staticData function", () => {
    const lazyStaticData = async () => mockStaticData;

    const config: BetterI18nProviderConfig = {
      project: "acme/dashboard",
      locale: "en",
      staticData: lazyStaticData,
    };

    expect(config.staticData).toBe(lazyStaticData);
  });
});
