import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";

interface SwitchReason {
  readonly painPoint: string;
  readonly solution: string;
}

interface WhySwitchSectionProps {
  readonly competitor: string;
  readonly reasons: readonly SwitchReason[];
}

export function WhySwitchSection({ competitor, reasons }: WhySwitchSectionProps) {
  const t = useT("marketing");

  return (
    <section className="py-16 border-t border-mist-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1] mb-10">
          {t("compare.whySwitch.title", { competitor })}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.painPoint}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-mist-200 bg-white p-5"
            >
              <div className="rounded-lg bg-red-50 border border-red-100 p-4">
                <span className="text-xs font-medium uppercase tracking-wide text-red-500 mb-1 block">
                  {t("compare.whySwitch.painLabel", "Pain")}
                </span>
                <p className="text-sm text-red-700">{reason.painPoint}</p>
              </div>
              <div className="hidden sm:flex items-center justify-center">
                <SpriteIcon name="arrow-right" className="w-5 h-5 text-mist-400" aria-hidden="true" />
              </div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-600 mb-1 block">
                  {t("compare.whySwitch.solutionLabel", "Solution")}
                </span>
                <p className="text-sm text-emerald-700">{reason.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
