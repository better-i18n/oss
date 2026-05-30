import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Keep the real detectLocale/createLogger, only stub the CDN locale fetch so the
// middleware runs offline with a fixed locale set.
vi.mock("@better-i18n/core", async (importActual) => {
  const actual = await importActual<typeof import("@better-i18n/core")>();
  return {
    ...actual,
    createI18nCore: () => ({
      getLocales: async () => ["en", "tr", "de"],
    }),
  };
});

// next-intl middleware: pass-through (no redirect) so we always reach the
// callback branch with a 200 response.
vi.mock("next-intl/middleware", () => ({
  default: () => () => NextResponse.next(),
}));

import { createBetterI18nMiddleware, type MiddlewareContext } from "../middleware.js";

const config = {
  project: "acme/web",
  defaultLocale: "en",
  localePrefix: "always" as const,
};

function run(url: string, cookie?: string) {
  let ctx: MiddlewareContext | undefined;
  const middleware = createBetterI18nMiddleware(config, async (_req, c) => {
    ctx = c;
  });
  const req = new NextRequest(url, {
    headers: cookie ? { cookie } : {},
  });
  return middleware(req).then(() => ctx!);
}

describe("explicit locale marker", () => {
  it("isExplicit is false when no explicit cookie is present", async () => {
    const ctx = await run("https://acme.test/tr/dashboard");
    expect(ctx.locale).toBe("tr");
    expect(ctx.detectedFrom).toBe("path");
    expect(ctx.isExplicit).toBe(false);
  });

  it("isExplicit is true when the default explicit cookie is present", async () => {
    const ctx = await run("https://acme.test/tr/dashboard", "locale_explicit=tr");
    expect(ctx.isExplicit).toBe(true);
  });

  it("a plain locale cookie does NOT count as explicit", async () => {
    // The locale cookie is auto-written by the middleware too, so on its own it
    // must not be treated as a deliberate user choice.
    const ctx = await run("https://acme.test/tr/dashboard", "locale=tr");
    expect(ctx.isExplicit).toBe(false);
  });

  it("exposes detectedFrom for non-path resolution", async () => {
    // No locale in path, no cookie, no accept-language → default.
    const ctx = await run("https://acme.test/dashboard");
    expect(ctx.locale).toBe("en");
    expect(ctx.detectedFrom).toBe("default");
    expect(ctx.isExplicit).toBe(false);
  });

  it("honors a custom explicitCookieName", async () => {
    let ctx: MiddlewareContext | undefined;
    const middleware = createBetterI18nMiddleware(
      { ...config, detection: { explicitCookieName: "bi18n_explicit" } },
      async (_req, c) => {
        ctx = c;
      },
    );
    const req = new NextRequest("https://acme.test/de/dashboard", {
      headers: { cookie: "bi18n_explicit=de" },
    });
    await middleware(req);
    expect(ctx!.isExplicit).toBe(true);
  });
});
