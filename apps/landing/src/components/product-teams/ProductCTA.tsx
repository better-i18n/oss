import { useTranslations } from "@better-i18n/use-intl";
import { ClosingCta } from "@/components/ui/page";

/**
 * Closing ask for /for-product-teams/.
 *
 * Was a `bg-mist-950` slab: a dark, centred, rounded-xl card with white text, two
 * `rounded-full` buttons and its own hardcoded five-logo row, inside a hand-rolled
 * `max-w-[1400px]` container that sat outside the 1160px frame. Four rules broken
 * in one component (one-container, white-page-hairline-separation,
 * weight/pill chrome, name-a-thing-with-its-mark).
 *
 * Now it is the shared `ClosingCta`: flat on white, left-aligned, in frame — plus
 * the customer proof row, which is the one place a logo wall earns its space,
 * because it is where the reader is deciding. The list comes from
 * `src/lib/customers.ts`, so it can no longer drift from the hero band.
 *
 * `mailto:` secondary replaced with the booking link the rest of the site uses:
 * the old handler called `preventDefault()` and then set `window.location.href`
 * to the same mailto, which is what the browser would have done anyway.
 */
export default function ProductCTA() {
  const t = useTranslations("product-teams");

  return (
    <ClosingCta
      title={t("cta.title")}
      subtitle={t("cta.description")}
      primary={{ label: t("cta.primary"), href: "https://dash.better-i18n.com" }}
      secondary={{
        label: t("cta.secondary"),
        href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
      }}
      customers={{ label: t("cta.trustedBy") }}
    />
  );
}
