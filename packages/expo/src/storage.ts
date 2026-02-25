import type { Messages } from "@better-i18n/core";
import type { CacheMeta, TranslationStorage } from "./types";

const CACHE_PREFIX = "@better-i18n";

/**
 * Build the storage key for cached translations
 */
export const buildStorageKey = (project: string, locale: string): string =>
  `${CACHE_PREFIX}:${project}:${locale}:translations`;

/**
 * Build the storage key for cache metadata
 */
export const buildMetaKey = (project: string, locale: string): string =>
  `${CACHE_PREFIX}:${project}:${locale}:meta`;

/**
 * Create an in-memory storage adapter.
 * Used as fallback when no persistent storage is available.
 */
export const createMemoryStorage = (): TranslationStorage => {
  const store = new Map<string, string>();
  return {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
  };
};

/**
 * Auto-detect the best available storage. Zero config.
 *
 * Priority:
 * 1. User-provided custom storage
 * 2. react-native-mmkv (fastest, sync I/O)
 * 3. @react-native-async-storage/async-storage (most common)
 * 4. In-memory Map (no persistence, works everywhere)
 *
 * Uses require() so Metro bundler creates stubs with real file paths.
 * import() causes Metro to set undefined paths for missing modules →
 * path.relative(bundleDir, undefined) crash at serialization time.
 * require() stubs execute at runtime and throw → caught by try/catch.
 */
export const resolveStorage = async (
  userStorage?: TranslationStorage
): Promise<TranslationStorage> => {
  if (userStorage) return userStorage;

  // 1. Try MMKV — fastest persistent storage for RN
  try {
    // @ts-ignore — optional peer dependency, may not be installed
    const { MMKV } = require("react-native-mmkv");
    const mmkv = new MMKV({ id: "better-i18n" });
    return {
      getItem: async (key) => mmkv.getString(key) ?? null,
      setItem: async (key, value) => { mmkv.set(key, value); },
      removeItem: async (key) => { mmkv.delete(key); },
    };
  } catch {
    // not installed
  }

  // 2. Try AsyncStorage
  try {
    // @ts-ignore — optional peer dependency, may not be installed
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    return {
      getItem: (key: string) => AsyncStorage.getItem(key),
      setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
      removeItem: (key: string) => AsyncStorage.removeItem(key),
    };
  } catch {
    // not installed
  }

  // 3. Fallback — in-memory (no persistence across restarts)
  return createMemoryStorage();
};

/**
 * Read cached translations from storage.
 * Meta is optional — if only translations exist, they are still returned.
 */
export const readCache = async (
  storage: TranslationStorage,
  project: string,
  locale: string
): Promise<{ data: Messages; meta: CacheMeta } | null> => {
  try {
    const raw = await storage.getItem(buildStorageKey(project, locale));
    if (!raw) return null;

    const data: Messages = JSON.parse(raw);

    // Meta is best-effort — default to epoch if missing/corrupt
    let meta: CacheMeta = { cachedAt: 0 };
    try {
      const rawMeta = await storage.getItem(buildMetaKey(project, locale));
      if (rawMeta) meta = JSON.parse(rawMeta) as CacheMeta;
    } catch {
      // meta is non-critical
    }

    return { data, meta };
  } catch {
    return null;
  }
};

/**
 * Write translations to persistent storage with metadata
 */
export const writeCache = async (
  storage: TranslationStorage,
  project: string,
  locale: string,
  data: Messages
): Promise<void> => {
  const meta: CacheMeta = { cachedAt: Date.now() };
  await Promise.all([
    storage.setItem(buildStorageKey(project, locale), JSON.stringify(data)),
    storage.setItem(buildMetaKey(project, locale), JSON.stringify(meta)),
  ]);
};
