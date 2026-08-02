import { useT } from "@/lib/i18n";
import { StatColumns, type StatCell } from "@/components/MetricsBadges";

const STATS = [
  {
    value: "$75.7B",
    labelKey: "marketSize",
    sourceKey: "sourceGrandView",
  },
  {
    value: "17.2%",
    labelKey: "marketGrowth",
    sourceKey: "sourceGrandView2",
  },
  {
    value: "96%",
    labelKey: "positiveRoi",
    sourceKey: "sourceCsa",
  },
  {
    value: "60%",
    labelKey: "hallucinationRisk",
    sourceKey: "sourceIndustry",
  },
] as const;

export default function IndustryStats() {
  const t = useT("industryStats");

  /* Same archetype as the platform metrics (StatColumns) so the page speaks one
     numeric language. Here the label IS the sentence, so it goes in
     `description`; the attribution is the 11px meta line, not a pill. */
  const stats: StatCell[] = STATS.map((stat) => ({
    id: stat.labelKey,
    value: stat.value,
    description: t(stat.labelKey),
    meta: t(stat.sourceKey),
  }));

  return (
    <section aria-label="Industry statistics">
      <div className="section">

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">
              {t("eyebrow")}
            </div>
            <h2 className="section-h2">
              {t("title")}
            </h2>
          </div>
          <p className="section-p lg:text-right">
            {t("subtitle")}
          </p>
        </div>

        <StatColumns stats={stats} columns={4} />

      </div>
    </section>
  );
}
