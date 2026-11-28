import { describe, expect, it } from "vitest";
import { fixSitemapXml, SITEMAP_NS } from "./sitemap-xml";

const url = (loc: string) =>
  `<url><loc>https://better-i18n.com${loc}</loc><lastmod>2026-11-13</lastmod>` +
  `<xhtml:link rel="alternate" hreflang="en" href="https://better-i18n.com${loc}"/></url>`;

const pluginXml = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;

describe("fixSitemapXml", () => {
  it("rewrites the https namespace the plugin emits to the http one the spec requires (F5)", () => {
    const { xml } = fixSitemapXml(pluginXml(url("/en/pricing/")));
    expect(xml).toContain(`<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="http://www.w3.org/1999/xhtml">`);
    expect(xml).not.toContain("https://www.sitemaps.org");
    expect(SITEMAP_NS).toBe("http://www.sitemaps.org/schemas/sitemap/0.9");
  });

  it("is idempotent: running it on an already-fixed file changes nothing", () => {
    const once = fixSitemapXml(pluginXml(url("/en/pricing/"))).xml;
    expect(fixSitemapXml(once).xml).toBe(once);
  });

  it("fixes a sitemap index too", () => {
    const { xml } = fixSitemapXml(
      `<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>x</loc></sitemap></sitemapindex>`,
    );
    expect(xml).toContain(`<sitemapindex xmlns="${SITEMAP_NS}">`);
  });

  it("drops the bare root and excluded paths, but not longer paths that share a prefix", () => {
    const { xml, droppedUrls } = fixSitemapXml(
      pluginXml(url("/") + url("/en/about/") + url("/en/about/team/") + url("/en/pricing/")),
      ["/en/about/"],
    );
    expect(droppedUrls).toBe(2);
    expect(xml).not.toContain("<loc>https://better-i18n.com/</loc>");
    expect(xml).not.toContain("<loc>https://better-i18n.com/en/about/</loc>");
    expect(xml).toContain("<loc>https://better-i18n.com/en/about/team/</loc>");
    expect(xml).toContain("<loc>https://better-i18n.com/en/pricing/</loc>");
  });
});
