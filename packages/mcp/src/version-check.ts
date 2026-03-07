/**
 * Version check utility for @better-i18n/mcp
 *
 * Checks npm registry for the latest version and returns update info.
 * Non-critical — all errors are silently caught and return null.
 */

const NPM_REGISTRY_URL = "https://registry.npmjs.org";
const TIMEOUT_MS = 3_000;

interface UpdateInfo {
  needsUpdate: boolean;
  latest: string;
  current: string;
}

export async function checkForUpdate(
  packageName: string,
  currentVersion: string,
): Promise<UpdateInfo | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`${NPM_REGISTRY_URL}/${packageName}/latest`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as { version?: string };
    const latest = data.version;

    if (!latest) return null;

    return {
      needsUpdate: latest !== currentVersion,
      latest,
      current: currentVersion,
    };
  } catch {
    // Network error, timeout, or JSON parse failure — silently ignore
    return null;
  }
}
