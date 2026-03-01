import type { TranslationStorage } from "../types.js";

/**
 * Create an in-memory storage adapter backed by a Map.
 * Useful as a fallback when no persistent storage is available (e.g., SSR).
 */
export const createMemoryStorage = (): TranslationStorage => {
  const store = new Map<string, string>();
  return {
    get: async (key) => store.get(key) ?? null,
    set: async (key, value) => {
      store.set(key, value);
    },
    remove: async (key) => {
      store.delete(key);
    },
  };
};
