import { useT } from "@/lib/i18n";

const STATS = [
  {
    value: "$75.7B",
    labelKey: "marketSize",
    defaultLabel: "Global localization market by 2030",
    sourceKey: "sourceGrandView",
    defaultSource: "Grand View Research",
  },
  {
    value: "17.2%",
    labelKey: "marketGrowth",
    defaultLabel: "Annual market growth rate (CAGR)",
    sourceKey: "sourceGrandView2",
    defaultSource: "Grand View Research",
  },
  {
    value: "96%",
    labelKey: "positiveRoi",
    defaultLabel: "Companies report positive i18n ROI",
    sourceKey: "sourceCsa",
    defaultSource: "CSA Research",
  },
  {
    value: "60%",
    labelKey: "hallucinationRisk",
    defaultLabel: "AI translations with hallucination risk",
    sourceKey: "sourceIndustry",
    defaultSource: "Industry Report 2025",
  },
] as const;

export default function IndustryStats() {
  const t = useT("industryStats");

  return (
    <section aria-label="Industry statistics" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
              {t("eyebrow", { defaultValue: "Market" })}
            </div>
            <h2 className="mt-4 font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("title", { defaultValue: "The localization market is booming." })}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-mist-600 lg:text-right">
            {t("subtitle", { defaultValue: "Industry data behind the global demand for i18n." })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.labelKey}
              className="flex flex-col justify-between gap-6 rounded-[1.75rem] border border-mist-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]"
            >
              <div>
                <p className="text-4xl font-bold tracking-[-0.04em] text-mist-950 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-mist-700">
                  {t(stat.labelKey, { defaultValue: stat.defaultLabel })}
                </p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full border border-mist-100 bg-mist-50 px-2.5 py-1 text-[11px] font-medium text-mist-500">
                {t(stat.sourceKey, { defaultValue: stat.defaultSource })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
