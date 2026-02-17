import { describe, it, expect } from "vitest";
import { normalizeConfig } from "../config.js";
import type { TranslationStorage, Messages } from "@better-i18n/core";

// ─── Test fixtures ──────────────────────────────────────────────────

const BASE_CONFIG = {
  project: "acme/dashboard",
  defaultLocale: "en",
};

const mockStorage: TranslationStorage = {
  get: async () => null,
  set: async () => {},
};

const mockStaticData: Record<string, Messages> = {
  en: { common: { hello: "Hello" } },
  tr: { common: { hello: "Merhaba" } },
};

// ─── Tests ──────────────────────────────────────────────────────────

describe("normalizeConfig — fallback fields passthrough", () => {
  it("passes storage to core config", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      storage: mockStorage,
    });

    expect(config.storage).toBe(mockStorage);
  });

  it("passes staticData to core config", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      staticData: mockStaticData,
    });

    expect(config.staticData).toBe(mockStaticData);
  });

  it("passes fetchTimeout to core config", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      fetchTimeout: 5000,
    });

    expect(config.fetchTimeout).toBe(5000);
  });

  it("passes retryCount to core config", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      retryCount: 3,
    });

    expect(config.retryCount).toBe(3);
  });

  it("passes all fallback fields together", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      storage: mockStorage,
      staticData: mockStaticData,
      fetchTimeout: 7000,
      retryCount: 2,
    });

    expect(config.storage).toBe(mockStorage);
    expect(config.staticData).toBe(mockStaticData);
    expect(config.fetchTimeout).toBe(7000);
    expect(config.retryCount).toBe(2);
  });

  it("applies default fetchTimeout when not specified", () => {
    const config = normalizeConfig(BASE_CONFIG);

    expect(config.fetchTimeout).toBe(10000);
  });

  it("applies default retryCount when not specified", () => {
    const config = normalizeConfig(BASE_CONFIG);

    expect(config.retryCount).toBe(1);
  });

  it("leaves storage undefined when not specified", () => {
    const config = normalizeConfig(BASE_CONFIG);

    expect(config.storage).toBeUndefined();
  });

  it("leaves staticData undefined when not specified", () => {
    const config = normalizeConfig(BASE_CONFIG);

    expect(config.staticData).toBeUndefined();
  });

  it("preserves Next.js-specific defaults alongside fallback fields", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      storage: mockStorage,
    });

    // Next.js defaults should still be set
    expect(config.localePrefix).toBe("as-needed");
    expect(config.cookieName).toBe("locale");
    expect(config.manifestRevalidateSeconds).toBe(3600);
    expect(config.messagesRevalidateSeconds).toBe(30);

    // Fallback field should be present
    expect(config.storage).toBe(mockStorage);
  });

  it("supports lazy staticData function", () => {
    const lazyStaticData = async () => mockStaticData;
    const config = normalizeConfig({
      ...BASE_CONFIG,
      staticData: lazyStaticData,
    });

    expect(config.staticData).toBe(lazyStaticData);
  });

  it("passes timeZone when provided", () => {
    const config = normalizeConfig({
      ...BASE_CONFIG,
      timeZone: "Europe/Istanbul",
    });

    expect(config.timeZone).toBe("Europe/Istanbul");
  });

  it("leaves timeZone undefined when not specified", () => {
    const config = normalizeConfig(BASE_CONFIG);

    expect(config.timeZone).toBeUndefined();
  });
});
