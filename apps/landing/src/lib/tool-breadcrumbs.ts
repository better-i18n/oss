import { getBreadcrumbItems } from "@/lib/page-seo";

/**
 * Breadcrumb items with the locale already in every href.
 *
 * `getBreadcrumbItems()` returns locale-less paths (`/`, `/tools/`) because it
 * only receives a pathname — it has no way to know which locale is being
 * rendered. That was correct while `MarketingBreadcrumb` prepended the locale
 * itself; it stopped doing that, so those hrefs now drop the locale and send a
 * Turkish reader to the English page. Measured on `/en/tools/translation-file-
 * converter/`: `Home → "/"`, `Free Tools → "/tools/"`.
 *
 * The locale belongs to the caller — it comes from `Route.useParams()` — so the
 * prefixing happens here, at the boundary where the locale first exists, rather
 * than inside the shared SEO helper. It lives in one module instead of a `.map()`
 * repeated in every tool route, so the three call sites cannot drift apart.
 */
export function toolBreadcrumbs(
  pathname: string,
  messages: Parameters<typeof getBreadcrumbItems>[1],
  locale: string,
): ReadonlyArray<{ readonly label: string; readonly href?: string }> {
  return getBreadcrumbItems(pathname, messages).map((item) =>
    item.href === undefined
      ? item
      : /* "/" must become "/en", not "/en/" + "/" — the trailing-slash router
           normalises the rest, but a doubled slash here would 404. */
        { ...item, href: `/${locale}${item.href === "/" ? "" : item.href}` },
  );
}
