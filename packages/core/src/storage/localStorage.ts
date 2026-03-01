import type { TranslationStorage } from "../types.js";

/**
 * Minimal Storage interface matching the Web Storage API subset we need.
 * Declared here to avoid requiring DOM lib in tsconfig.
 */
interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Access localStorage via globalThis to work in any environment.
 */
const getStorage = (): WebStorage | undefined =>
  (globalThis as { localStorage?: WebStorage }).localStorage;

/**
 * Create a storage adapter backed by browser localStorage.
 * All operations are wrapped in try/catch to handle environments
 * where localStorage is unavailable or full (quota exceeded).
 */
export const createLocalStorage = (): TranslationStorage => ({
  get: async (key) => {
    try {
      return getStorage()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      getStorage()?.setItem(key, value);
    } catch {
      // Storage full or unavailable — silently fail
    }
  },
  remove: async (key) => {
    try {
      getStorage()?.removeItem(key);
    } catch {
      // Silently fail
    }
  },
});
