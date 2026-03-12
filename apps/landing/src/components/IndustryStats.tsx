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
    <section
      aria-label="Industry statistics"
      className="px-6 py-16 lg:py-20 mx-auto w-full max-w-[1400px]"
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.labelKey} className="text-center">
            <p className="text-4xl font-bold text-mist-950 sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-base text-mist-700">
              {t(stat.labelKey, { defaultValue: stat.defaultLabel })}
            </p>
            <p className="mt-1 text-xs text-mist-400">
              {t(stat.sourceKey, { defaultValue: stat.defaultSource })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
