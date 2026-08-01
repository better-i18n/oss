import { useT } from "@/lib/i18n";
import { ClosingCta, Divider } from "@/components/ui/page";

/**
 * The shared closing band, rendered by `MarketingLayout` on every page with
 * `showCTA` (104 files at last count) — so this is the single most repeated
 * block on the site.
 *
 * What changed and why:
 *   - It sat on `bg-mist-100`, which made the last band of every page a tinted
 *     canvas: the one thing rule/white-page-hairline-separation exists to
 *     remove. It is now white, opened by the `<Divider />` that separates every
 *     other section, so the page ends the way it reads throughout.
 *   - The markup was a hand-rolled `<section><div className="section">` with
 *     `rounded-full` pill buttons. It now composes `<ClosingCta>` from
 *     `ui/page.tsx`, the same primitive the pillar pages use for their own
 *     closing ask, so there is one closing band in the codebase instead of two
 *     that drift apart.
 *   - All five `defaultValue` fallbacks are gone. Every key exists in the `cta`
 *     namespace (which `page-namespaces.ts` ships on every page via
 *     SHARED_NAMESPACES), and the published copy had already diverged from the
 *     fallbacks — the band was rendering "Ready to ship globally?" while the code
 *     claimed "Ready to go global?". `useT` humanises a missing key and never
 *     consults `defaultValue`, so those objects were dead weight hiding the
 *     divergence.
 *
 * `cta.startTrialAriaLabel` is deliberately not used any more: the visible
 * label is now the full sentence ("Try Better I18N free for 14 days"), and an
 * aria-label that restates it only breaks voice control ("click start free
 * trial" no longer matches what is on screen). The key still exists on the CDN
 * if we ever need a shorter visible label again.
 */
export default function CTA() {
  const t = useT("cta");

  return (
    <>
      <Divider />
      <ClosingCta
        title={t("title")}
        subtitle={t("subtitle")}
        primary={{ label: t("startTrial"), href: "https://dash.better-i18n.com" }}
        secondary={{
          label: t("bookDemo"),
          href: "https://cal.com/better-i18n/30min?overlayCalendar=true",
        }}
      />
    </>
  );
}
