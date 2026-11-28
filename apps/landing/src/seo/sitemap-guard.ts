/**
 * Build gate for the finished sitemap.
 *
 * `generatePages` used to fail silently (the build logged the error and shipped
 * a sitemap without blog posts). The Content API holds 250+ English posts, so a
 * sitemap with far fewer blog URLs means generation broke, not that we wrote less.
 */
export const MIN_BLOG_URLS = 200;

/** Counts `<loc>` entries that point at a blog post (`/{locale}/blog/{slug}/`). */
export function countBlogUrls(xml: string): number {
  const re = /<loc>https:\/\/better-i18n\.com\/[a-z-]+\/blog\/[^/<]+\/?<\/loc>/g;
  return xml.match(re)?.length ?? 0;
}

export function assertEnoughBlogUrls(xmls: readonly string[], min = MIN_BLOG_URLS): number {
  const total = xmls.reduce((n, x) => n + countBlogUrls(x), 0);
  if (total < min) {
    throw new Error(
      `[SEO] sitemap lists ${total} blog URLs, expected at least ${min}. Page generation likely failed.`,
    );
  }
  return total;
}
