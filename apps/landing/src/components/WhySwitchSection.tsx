import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";
import { ProductTile } from "@/components/ui/product-tile";
import { Divider, Section, SectionHeader } from "@/components/ui/page";

interface SwitchReason {
  readonly painPoint: string;
  readonly solution: string;
}

interface WhySwitchSectionProps {
  readonly competitor: string;
  readonly reasons: readonly SwitchReason[];
}

/**
 * "Why teams switch" — a pain / solution ledger, used by the Smartling and XTM
 * comparison pages.
 *
 * This component broke four rules at once and each fix is worth naming:
 *
 *  1. `<section className="border-t border-mist-200">` was doing a Divider's job
 *     by hand — a plain rule with no frame ticks, so it did not line up with any
 *     other section boundary on the page. Now `<Divider />` + `<Section>`.
 *  2. Each row was a `rounded-xl border p-5` card containing TWO more bordered
 *     boxes: three nested boxes inside a page that is already a bordered frame.
 *     The row is bare now, split by one hairline, halves as columns.
 *  3. The halves were `bg-red-50 / text-red-700` and `bg-emerald-50 /
 *     text-emerald-700`. Red-versus-green is the loudest pair available and it
 *     carried nothing the labels were not already carrying — and a red panel
 *     editorialises against a named competitor, which is not the posture this
 *     comparison set is written in. Neutral ink; the solution column is simply
 *     darker (mist-900 against mist-600), which is the whole hierarchy needed.
 *  4. Both labels were `uppercase tracking-wide` caps labels, the pattern removed
 *     everywhere else, and each carried a positional `t(key, "Pain")` fallback:
 *     `useT` humanises a missing key and never reads that argument, so it was
 *     dead code hiding a missing key. Both keys were already on the CDN.
 *
 * The two marks are the one place identity survives, and they earn it: the pain
 * belongs to the competitor's product and the solution to ours, so each mark says
 * *whose column this is* (rule/name-a-thing-with-its-mark) rather than decorating.
 */
export function WhySwitchSection({ competitor, reasons }: WhySwitchSectionProps) {
  const t = useT("marketing");
  /* The pages pass a display name ("Smartling", "XTM"); CompetitorMark keys are
     lowercase and unspaced. An unknown key falls back to the monogram on the same
     tile, so a new competitor never renders a hole. */
  const competitorKey = competitor.toLowerCase().replace(/\s+/g, "") as CompetitorKey;

  return (
    <>
      <Divider />
      <Section>
        <SectionHeader
          eyebrow={t("compare.whySwitch.sectionEyebrow")}
          title={t("compare.whySwitch.title", { competitor })}
          subtitle={t("compare.whySwitch.sectionSubtitle")}
        />

        <div className="mt-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.painPoint}
              className={`grid grid-cols-1 gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start sm:gap-6 ${
                index === 0 ? "pt-0" : "border-t border-black/[0.05]"
              }`}
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[11px] font-medium text-mist-400">
                  <CompetitorMark competitor={competitorKey} size={18} />
                  {t("compare.whySwitch.painLabel")}
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-mist-600">
                  {reason.painPoint}
                </p>
              </div>

              {/* Decorative only, and hidden at one column — there the label
                  order already carries the direction. */}
              <div className="hidden sm:flex sm:pt-6">
                <SpriteIcon
                  name="arrow-right"
                  className="size-4 shrink-0 text-mist-300"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[11px] font-medium text-mist-400">
                  <ProductTile product="i18n" size="sm" className="size-[18px] rounded-[5px]" />
                  {t("compare.whySwitch.solutionLabel")}
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-mist-900">
                  {reason.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
