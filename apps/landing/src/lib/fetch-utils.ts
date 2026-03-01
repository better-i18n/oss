/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within
 * the given milliseconds, returns the fallback value instead of hanging.
 *
 * Useful for non-critical data fetches in SSR loaders where a slow API
 * shouldn't block the entire page from rendering.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}
