/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "bun:test";
import {
  buildMetaKey,
  buildStorageKey,
  createMemoryStorage,
  readCache,
  storageAdapter,
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

describe("storageAdapter", () => {
  it("adapts MMKV-like sync storage (getString/set/delete)", async () => {
    const store = new Map<string, string>();
    const mockMMKV = {
      getString: (key: string) => store.get(key),
      set: (key: string, value: string) => { store.set(key, value); },
      delete: (key: string) => { store.delete(key); },
    };

    const adapted = storageAdapter(mockMMKV);
    await adapted.setItem("k", "v");
    expect(await adapted.getItem("k")).toBe("v");
    await adapted.removeItem("k");
    expect(await adapted.getItem("k")).toBeNull();
  });

  it("adapts AsyncStorage-like async storage (getItem/setItem/removeItem)", async () => {
    const store = new Map<string, string>();
    const mockAS = {
      getItem: async (key: string) => store.get(key) ?? null,
      setItem: async (key: string, value: string) => { store.set(key, value); },
      removeItem: async (key: string) => { store.delete(key); },
    };

    const adapted = storageAdapter(mockAS);
    await adapted.setItem("k", "v");
    expect(await adapted.getItem("k")).toBe("v");
    await adapted.removeItem("k");
    expect(await adapted.getItem("k")).toBeNull();
  });

  it("throws on unrecognized storage type", () => {
    expect(() => storageAdapter({} as any)).toThrow("unrecognized storage type");
  });
});

describe("storageAdapter — localeKey option", () => {
  function makeMockAS() {
    const store = new Map<string, string>();
    return {
      getItem: async (key: string) => store.get(key) ?? null,
      setItem: async (key: string, value: string) => { store.set(key, value); },
      removeItem: async (key: string) => { store.delete(key); },
    };
  }

  it("adds readLocale/writeLocale when localeKey provided", () => {
    const adapted = storageAdapter(makeMockAS(), { localeKey: "@app:locale" });
    expect(typeof (adapted as any).readLocale).toBe("function");
    expect(typeof (adapted as any).writeLocale).toBe("function");
  });

  it("readLocale returns stored locale", async () => {
    const adapted = storageAdapter(makeMockAS(), { localeKey: "@app:locale" }) as any;
    await adapted.writeLocale("tr");
    expect(await adapted.readLocale()).toBe("tr");
  });

  it("readLocale returns null when key not set", async () => {
    const adapted = storageAdapter(makeMockAS(), { localeKey: "@app:locale" }) as any;
    expect(await adapted.readLocale()).toBeNull();
  });

  it("writeLocale persists locale", async () => {
    const adapted = storageAdapter(makeMockAS(), { localeKey: "@app:locale" }) as any;
    await adapted.writeLocale("fr");
    expect(await adapted.readLocale()).toBe("fr");
    await adapted.writeLocale("de");
    expect(await adapted.readLocale()).toBe("de");
  });

  it("plain TranslationStorage when no localeKey — no readLocale property", () => {
    const adapted = storageAdapter(makeMockAS());
    expect("readLocale" in adapted).toBe(false);
    expect("writeLocale" in adapted).toBe(false);
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

  it("should return data with default meta when translations exist but meta is missing", async () => {
    storage = createMemoryStorage();
    await storage.setItem(
      "@better-i18n:acme/app:en:translations",
      '{"hello":"world"}'
    );

    const result = await readCache(storage, "acme/app", "en");
    expect(result).not.toBeNull();
    expect(result!.data).toEqual({ hello: "world" });
    expect(result!.meta.cachedAt).toBe(0);
  });
});
