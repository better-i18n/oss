import { useT } from "@/lib/i18n";
import { FeatureGrid } from "@/components/ui/page";
import type { ReactNode } from "react";

/* ─── Shared statistics archetype ───────────────────────────────────
   One numeric language for the whole page: hairline-split number columns,
   no cards, no shadows, no icon chips competing with the numeral.
   `IndustryStats` imports this so the market numbers and the platform
   numbers cannot drift into two different dialects.

   Same logic as `Pricing`: the columns are split by hairlines and nothing
   else. There is NO outer box — `.section` already frames the block, so a
   border here would read as a box inside a box, and the interior rules plus
   an outer rule is twice the ink the split needs.

   Only INTERIOR rules are wanted, without nth-child arithmetic: every cell
   draws its own top + left rule, the grid is shifted -1px up/left, and the
   bare `overflow-hidden` wrapper clips whatever lands outside it — which is
   exactly the first row's top rule and the first column's left rule. The
   clip box carries no border and no radius, so nothing is nested. This holds
   at every breakpoint: at one column the left rules are clipped and the top
   rules become the horizontal dividers.

   Copy is never held here — callers pass already-translated nodes, same
   contract as the `ui/page.tsx` primitives. This belongs in `ui/page.tsx`
   as `<StatColumns>`; it lives here only because that file is owned by
   another change right now. */

export type StatCell = {
  /** Stable list key — usually the translation key of the label. */
  id: string;
  value: string;
  /** Short name of the measure. Omit when the description carries it. */
  label?: ReactNode;
  description?: ReactNode;
  /** 11px meta line: source attribution, or a link out. */
  meta?: ReactNode;
};

const COLUMN_CLASS: Record<3 | 4, string> = {
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function StatColumns({
  stats,
  columns,
}: {
  stats: readonly StatCell[];
  columns: 3 | 4;
}) {
  return (
    <div>
      <FeatureGrid cols={`auto-rows-fr ${COLUMN_CLASS[columns]}`} padY={24}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="feat-cell flex flex-col gap-3"
          >
            <p className="text-[40px] font-medium leading-none tracking-[-0.03em] tabular-nums text-mist-950">
              {stat.value}
            </p>
            <div>
              {stat.label && (
                <p className="text-[13px] font-medium tracking-[-0.015em] text-mist-900">
                  {stat.label}
                </p>
              )}
              {stat.description && (
                <p className="mt-1 text-[13px] leading-[1.55] text-mist-600">
                  {stat.description}
                </p>
              )}
            </div>
            {stat.meta && (
              <p className="mt-auto text-[11px] font-medium text-mist-400">{stat.meta}</p>
            )}
          </div>
        ))}
      </FeatureGrid>
    </div>
  );
}

/* ─── Platform metrics ──────────────────────────────────────────── */

interface Metric {
  value: string;
  labelKey: string;
  descKey: string;
  href?: string;
}

const METRICS: Metric[] = [
  {
    value: "1M+",
    labelKey: "dailyRequests",
    descKey: "dailyRequestsDesc",
  },
  {
    value: "10M+",
    labelKey: "translationsManaged",
    descKey: "translationsManagedDesc",
  },
  {
    value: "25",
    labelKey: "languages",
    descKey: "languagesDesc",
  },
  {
    value: "10+",
    labelKey: "sdks",
    descKey: "sdksDesc",
  },
  {
    value: "<50ms",
    labelKey: "cdnLatency",
    descKey: "cdnLatencyDesc",
  },
  {
    value: "99.9%",
    labelKey: "uptime",
    descKey: "uptimeDesc",
    href: "https://status.better-i18n.com/",
  },
];

export default function MetricsBadges() {
  const t = useT("metrics");

  const stats: StatCell[] = METRICS.map((metric) => ({
    id: metric.labelKey,
    value: metric.value,
    label: t(metric.labelKey),
    description: t(metric.descKey),
    meta: metric.href ? (
      <a
        href={metric.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 transition-colors hover:text-mist-700"
      >
        {t("statusPage")}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </a>
    ) : undefined,
  }));

  return (
    <section aria-label="Platform metrics">
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

        <StatColumns stats={stats} columns={3} />
      </div>
    </section>
  );
}
