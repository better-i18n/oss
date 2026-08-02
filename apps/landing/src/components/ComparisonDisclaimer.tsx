import { Section } from "@/components/ui/page";
import { useT } from "@/lib/i18n";

/**
 * The legal footer every `/compare/*` page carries: trademark ownership, the
 * informational purpose of the comparison, where the data came from and as of
 * when, and a route to corrections.
 *
 * It lives here rather than in each route because it was copy-pasted into four
 * pages, and the copy had the label "Disclaimer" hardcoded in English — so all
 * 22 locales rendered an English word inside an otherwise translated legal
 * paragraph. Both strings now come from the CDN
 * (`compare.disclaimerLabel`, `compare.disclaimer`), and there is exactly one
 * place to change if legal wants different wording.
 *
 * No props: the component owns its copy so a caller cannot accidentally pass a
 * different (or hardcoded) disclaimer on one page.
 */
export function ComparisonDisclaimer() {
  const t = useT("marketing");

  return (
    <Section>
      <div className="border-t border-black/[0.05] pt-6">
        <p className="text-[11px] font-medium text-mist-400">
          {t("compare.disclaimerLabel")}
        </p>
        <p className="mt-2 max-w-[80ch] text-[12px] leading-[1.6] text-mist-500">
          {t("compare.disclaimer")}
        </p>
      </div>
    </Section>
  );
}
