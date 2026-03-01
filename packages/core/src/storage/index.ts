import type { TranslationStorage } from "../types.js";
import { createLocalStorage } from "./localStorage.js";
import { createMemoryStorage } from "./memory.js";

export { createLocalStorage } from "./localStorage.js";
export { createMemoryStorage } from "./memory.js";

/**
 * Minimal Storage interface for detection purposes.
 */
interface WebStorage {
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Auto-detect the best available storage.
 * Uses localStorage if available (browser), otherwise falls back to in-memory.
 */
export const createAutoStorage = (): TranslationStorage => {
  try {
    const storage = (globalThis as { localStorage?: WebStorage }).localStorage;
    if (storage) {
      // Test that localStorage actually works (may throw in private browsing, iframes, etc.)
      const testKey = "__better_i18n_test__";
      storage.setItem(testKey, "1");
      storage.removeItem(testKey);
      return createLocalStorage();
    }
  } catch {
    // localStorage not available or not writable
  }
  return createMemoryStorage();
};
