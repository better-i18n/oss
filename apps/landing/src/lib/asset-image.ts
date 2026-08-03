/**
 * Ask our asset host for the size we are actually going to display.
 *
 * The author avatars are uploaded at full resolution: the one on every blog
 * card and post is a **664 KB PNG rendered into a 20px box** — 121× the bytes
 * of what it needs to be, on a surface that repeats it once per card. That is
 * what makes it look broken in a screenshot: it is not failing, it is still
 * arriving, and the browser shows the missing-image glyph until it does.
 *
 * `?w=` and `?width=` are ignored by the host, but Cloudflare Image Resizing is
 * enabled on it — measured: the same avatar through `/cdn-cgi/image/width=80/`
 * comes back as 5.6 KB. So the fix is not to shrink the upload or to lazy-load
 * harder; it is to stop asking for a size nobody wanted.
 *
 * Only rewrites URLs on our own asset host. A third-party or relative URL is
 * returned untouched — inventing a resize path for a host that has no such
 * endpoint would turn a slow image into a missing one.
 */

/** Hosts we know serve Cloudflare's image-resizing endpoint. */
const RESIZABLE_HOST = /(^|\.)better-i18n\.com$/;

/**
 * @param src   the stored asset URL, or null/undefined when there is none
 * @param width the widest the image is ever displayed, in CSS pixels. Pass the
 *              rendered size; the 2× for retina is added here so callers cannot
 *              forget it.
 */
export function assetImage(src: string | null | undefined, width: number): string | undefined {
  if (!src) return undefined;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    // Relative path — served by us, already the right size.
    return src;
  }

  if (!RESIZABLE_HOST.test(url.hostname)) return src;
  if (url.pathname.startsWith("/cdn-cgi/")) return src;

  const dpr = Math.round(width * 2);
  return `${url.origin}/cdn-cgi/image/width=${dpr},fit=cover,format=auto${url.pathname}${url.search}`;
}
