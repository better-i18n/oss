import { describe, expect, it } from "bun:test";
import {
  buildMetaKey,
  buildStorageKey,
  createMemoryStorage,
  readCache,
  writeCache,
} from "../storage";
import type { TranslationStorage } from "../types";

describe("storage keys", () => {
  it("should build correct translation storage key", () => {
    expect(buildStorageKey("acme/app", "en")).toBe(
      "@better-i18n:acme/app:en:translations"
    );
  });

  it("should build correct meta storage key", () => {
    expect(buildMetaKey("acme/app", "tr")).toBe(
      "@better-i18n:acme/app:tr:meta"
    );
  });
});

describe("createMemoryStorage", () => {
  it("should store and retrieve values", async () => {
    const storage = createMemoryStorage();
    await storage.setItem("key", "value");
    expect(await storage.getItem("key")).toBe("value");
  });

  it("should return null for missing keys", async () => {
    const storage = createMemoryStorage();
    expect(await storage.getItem("missing")).toBeNull();
  });

  it("should remove values", async () => {
    const storage = createMemoryStorage();
    await storage.setItem("key", "value");
    await storage.removeItem("key");
    expect(await storage.getItem("key")).toBeNull();
  });
});

describe("readCache / writeCache", () => {
  let storage: TranslationStorage;

  it("should return null when no cache exists", async () => {
    storage = createMemoryStorage();
    const result = await readCache(storage, "acme/app", "en");
    expect(result).toBeNull();
  });

  it("should write and read back cached translations", async () => {
    storage = createMemoryStorage();
    const data = { welcome: "Hello", goodbye: "Bye" };
    await writeCache(storage, "acme/app", "en", data);

    const result = await readCache(storage, "acme/app", "en");
    expect(result).not.toBeNull();
    expect(result!.data).toEqual(data);
    expect(result!.meta.cachedAt).toBeGreaterThan(0);
  });

  it("should handle corrupted cache gracefully", async () => {
    storage = createMemoryStorage();
    await storage.setItem(
      "@better-i18n:acme/app:en:translations",
      "not-json{{"
    );
    await storage.setItem(
      "@better-i18n:acme/app:en:meta",
      '{"cachedAt":123}'
    );

    const result = await readCache(storage, "acme/app", "en");
    expect(result).toBeNull();
  });

  it("should return null when translations exist but meta is missing", async () => {
    storage = createMemoryStorage();
    await storage.setItem(
      "@better-i18n:acme/app:en:translations",
      '{"hello":"world"}'
    );

    const result = await readCache(storage, "acme/app", "en");
    expect(result).toBeNull();
  });
});
