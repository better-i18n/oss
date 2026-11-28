import { describe, expect, it } from "vitest";
import { getScheduledBlogRedirect } from "./redirects";

const before = Date.parse("2026-12-11T00:00:00Z");
const after = Date.parse("2026-12-12T10:00:00Z");

describe("scheduled blog redirects", () => {
  it("does nothing before the target post is live", () => {
    expect(getScheduledBlogRedirect("/en/blog/mcp-content-ai-blog/", before)).toBeNull();
  });
  it("sends every locale to the English target afterwards", () => {
    expect(getScheduledBlogRedirect("/de/blog/better-i18n-mcp-coding-agents-guide/", after)).toBe(
      "/en/blog/i18n-mcp-server-claude-cursor/",
    );
    expect(getScheduledBlogRedirect("/zh-hans/blog/mcp-content-ai-blog", after)).toBe(
      "/en/blog/i18n-mcp-server-claude-cursor/",
    );
  });
  it("leaves the post that has clicks alone", () => {
    expect(
      getScheduledBlogRedirect("/en/blog/mcp-for-localization-ai-agents-translations/", after),
    ).toBeNull();
  });
});
