import { describe, expect, it } from "vitest";
import { DEMO_BOOKING_URL, resolveCmsPath } from "./cms-links";

describe("resolveCmsPath (F3 broken for-* links)", () => {
  it.each([
    ["/mcp", "https://docs.better-i18n.com/en/docs/mcp"],
    ["/en/mcp", "https://docs.better-i18n.com/en/docs/mcp"],
    ["/frameworks/expo/", "https://docs.better-i18n.com/en/docs/frameworks/expo"],
    ["/en/frameworks/nextjs", "https://docs.better-i18n.com/en/docs/frameworks/nextjs"],
    ["/sdk/api-reference", "https://docs.better-i18n.com/en/docs/sdk/api-reference"],
    ["/en/security", "https://docs.better-i18n.com/en/docs/security"],
    ["/mcp#tools", "https://docs.better-i18n.com/en/docs/mcp#tools"],
  ])("sends the docs-only path %s to the docs site", (input, expected) => {
    expect(resolveCmsPath(input, "de")).toBe(expected);
  });

  it("sends /demo to the booking link", () => {
    expect(resolveCmsPath("/en/demo", "fr")).toBe(DEMO_BOOKING_URL);
    expect(resolveCmsPath("/demo/", "fr")).toBe(DEMO_BOOKING_URL);
  });

  it("keeps the locale rewrite for real landing pages", () => {
    expect(resolveCmsPath("/pricing", "tr")).toBe("/tr/pricing");
    expect(resolveCmsPath("/en/i18n/react/", "tr")).toBe("/tr/i18n/react/");
    expect(resolveCmsPath("/en/blog/x?ref=1", "ja")).toBe("/ja/blog/x?ref=1");
    expect(resolveCmsPath("/", "ko")).toBe("/ko/");
  });

  it("does not take a demo-prefixed landing page for /demo", () => {
    expect(resolveCmsPath("/demo-video", "en")).toBe("/en/demo-video");
  });
});
