/**
 * TEMPORARY with migration-proxy.ts: the landing worker must see the real host
 * and client IP when the old account's proxy forwards a request.
 */
import { describe, expect, it } from "vitest";
import { unwrapMigrationProxy } from "./migration-proxy";

const SECRET = "test-secret";

function proxied(auth: string) {
  return new Request("https://betteri18n-landing.better-i18n.workers.dev/en?x=1", {
    headers: {
      "x-bi18n-proxy-auth": auth,
      "x-bi18n-client-ip": "203.0.113.7",
      "x-bi18n-client-country": "ID",
      "x-bi18n-original-host": "better-i18n.com",
    },
  });
}

describe("unwrapMigrationProxy", () => {
  it("restores host, IP and country and strips the proxy headers", () => {
    const req = unwrapMigrationProxy(proxied(SECRET), { MIGRATION_PROXY_SECRET: SECRET });
    expect(req.url).toBe("https://better-i18n.com/en?x=1");
    expect(req.headers.get("cf-connecting-ip")).toBe("203.0.113.7");
    expect(req.headers.get("cf-ipcountry")).toBe("ID");
    expect(req.headers.get("x-bi18n-proxy-auth")).toBeNull();
    expect(req.headers.get("x-bi18n-original-host")).toBeNull();
  });

  it("leaves the request alone when the secret is wrong or unset", () => {
    for (const env of [{ MIGRATION_PROXY_SECRET: SECRET }, {}]) {
      const original = proxied("forged");
      expect(unwrapMigrationProxy(original, env)).toBe(original);
    }
  });
});
