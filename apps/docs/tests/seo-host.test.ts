import { describe, expect, test } from "bun:test";
import { onRequest } from "../functions/_middleware";
import { canonicalDocsUrl, decideForHost, isPagesDevHost } from "../src/lib/seo-host";

describe("canonicalDocsUrl", () => {
  test("maps a docs path onto the Helpway /en/docs prefix", () => {
    expect(canonicalDocsUrl("/frameworks/quick-start")).toBe(
      "https://docs.better-i18n.com/en/docs/frameworks/quick-start",
    );
  });
  test("root and trailing slashes", () => {
    expect(canonicalDocsUrl("/")).toBe("https://docs.better-i18n.com/en/docs");
    expect(canonicalDocsUrl("/cli/")).toBe("https://docs.better-i18n.com/en/docs/cli");
  });
});

describe("isPagesDevHost", () => {
  test.each([
    ["better-i18n-docs.pages.dev", true],
    ["abc123.better-i18n-docs.pages.dev", true],
    ["BETTER-I18N-DOCS.PAGES.DEV:443", true],
    ["docs.better-i18n.com", false],
    ["notpages.dev", false],
    ["localhost:8788", false],
  ])("%s -> %p", (host, expected) => {
    expect(isPagesDevHost(host)).toBe(expected);
  });
});

describe("decideForHost", () => {
  const decide = (u: string) => decideForHost(new URL(u));

  test("production alias: documents get a 301 to the canonical URL, query kept", () => {
    expect(decide("https://better-i18n-docs.pages.dev/cli?x=1")).toEqual({
      action: "redirect",
      location: "https://docs.better-i18n.com/en/docs/cli?x=1",
    });
    expect(decide("https://better-i18n-docs.pages.dev/")).toEqual({
      action: "redirect",
      location: "https://docs.better-i18n.com/en/docs",
    });
  });

  test("production alias: assets are served with noindex, not redirected", () => {
    expect(decide("https://better-i18n-docs.pages.dev/_next/static/chunks/a.js").action).toBe("noindex");
    expect(decide("https://better-i18n-docs.pages.dev/llms.txt").action).toBe("noindex");
    expect(decide("https://better-i18n-docs.pages.dev/cli.mdx").action).toBe("noindex");
  });

  test("preview deployments stay viewable, with noindex", () => {
    expect(decide("https://3f9a1c.better-i18n-docs.pages.dev/cli").action).toBe("noindex");
  });

  test("any other host passes through untouched", () => {
    expect(decide("https://docs.better-i18n.com/cli").action).toBe("pass");
    expect(decide("http://localhost:8788/cli").action).toBe("pass");
  });
});

describe("functions/_middleware onRequest", () => {
  const run = (url: string) =>
    onRequest({
      request: new Request(url),
      next: async () => new Response("<html></html>", { headers: { "content-type": "text/html" } }),
    });

  test("301 on the production alias", async () => {
    const res = await run("https://better-i18n-docs.pages.dev/mcp");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://docs.better-i18n.com/en/docs/mcp");
  });

  test("X-Robots-Tag: noindex on a preview", async () => {
    const res = await run("https://abc.better-i18n-docs.pages.dev/mcp");
    expect(res.status).toBe(200);
    expect(res.headers.get("x-robots-tag")).toBe("noindex");
  });

  test("no header on another host", async () => {
    const res = await run("http://localhost:8788/mcp");
    expect(res.headers.get("x-robots-tag")).toBeNull();
  });
});
