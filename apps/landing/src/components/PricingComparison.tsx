import { useT } from "@/lib/i18n";

const COMPETITORS = [
  { name: "Better i18n", price: "$79/mo", highlight: true },
  { name: "Lokalise", price: "$290\u2013585/mo" },
  { name: "Crowdin", price: "$400/mo" },
  { name: "Phrase", price: "$2,100/mo" },
] as const;

function getDifference(competitorPrice: string): string {
  const betterI18nPrice = 79;
  const match = competitorPrice.match(/\$(\d[\d,]*)/);
  if (!match) return "\u2014";
  const lowest = parseInt(match[1].replace(",", ""), 10);
  const pct = Math.round(((lowest - betterI18nPrice) / lowest) * 100);
  return `${pct}% less`;
}

export function PricingComparison() {
  const t = useT("pricing");

  return (
    <section id="compare-pricing" className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
          {t("comparison.title", {
            defaultValue: "How Better i18n compares on price",
          })}
        </h2>

        <div className="overflow-hidden rounded-2xl border border-mist-200 bg-white">
          {/* Header */}
          <div
            role="row"
            className="grid grid-cols-3 bg-mist-50 border-b border-mist-200"
          >
            <div
              role="columnheader"
              className="p-4 text-sm font-medium text-mist-600"
            >
              Competitor
            </div>
            <div
              role="columnheader"
              className="p-4 text-sm font-medium text-mist-600 text-center border-l border-mist-200"
            >
              10-Person Team Cost
            </div>
            <div
              role="columnheader"
              className="p-4 text-sm font-medium text-mist-600 text-center border-l border-mist-200"
            >
              Difference
            </div>
          </div>

          {/* Rows */}
          {COMPETITORS.map((competitor) => {
            const isHighlight = "highlight" in competitor && competitor.highlight;
            const difference = isHighlight
              ? "\u2014"
              : getDifference(competitor.price);

            return (
              <div
                key={competitor.name}
                role="row"
                className={`grid grid-cols-3 border-b border-mist-100 last:border-b-0 ${
                  isHighlight
                    ? "bg-emerald-50 border-emerald-200"
                    : ""
                }`}
              >
                <div role="cell" className="p-4 text-sm text-mist-700">
                  <span className={isHighlight ? "font-medium text-mist-950" : ""}>
                    {competitor.name}
                  </span>
                </div>
                <div
                  role="cell"
                  className="p-4 text-sm text-center border-l border-mist-100"
                >
                  <span className={isHighlight ? "font-medium text-mist-950" : "text-mist-700"}>
                    {competitor.price}
                  </span>
                </div>
                <div
                  role="cell"
                  className="p-4 text-sm text-center border-l border-mist-100"
                >
                  <span className={isHighlight ? "font-medium text-emerald-700" : "text-emerald-600"}>
                    {difference}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-mist-500 text-center">
          {t("comparison.disclaimer", {
            defaultValue:
              "Based on publicly available pricing as of March 2026",
          })}
        </p>
      </div>
    </section>
  );
}
