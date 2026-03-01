import type { CacheEntry } from "./types.js";

/**
 * Simple in-memory TTL cache
 */
export class TtlCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  /**
   * Get a value from cache if not expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Set a value in cache with TTL
   */
  set(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Build a cache key from config
 */
export const buildCacheKey = (cdnBaseUrl: string, project: string): string =>
  `${cdnBaseUrl}|${project}`;
