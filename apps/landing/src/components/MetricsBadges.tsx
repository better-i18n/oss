import { useT } from "@/lib/i18n";
import type { ReactNode } from "react";

interface Metric {
  value: string;
  labelKey: string;
  defaultLabel: string;
  descKey: string;
  defaultDesc: string;
  icon: ReactNode;
}

const METRICS: Metric[] = [
  {
    value: "1M+",
    labelKey: "dailyRequests",
    defaultLabel: "Daily CDN Requests",
    descKey: "dailyRequestsDesc",
    defaultDesc: "Translation requests served from the edge daily",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    value: "370K+",
    labelKey: "translationsManaged",
    defaultLabel: "Translations Managed",
    descKey: "translationsManagedDesc",
    defaultDesc: "Translation keys managed across all projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
      </svg>
    ),
  },
  {
    value: "47",
    labelKey: "languages",
    defaultLabel: "Languages",
    descKey: "languagesDesc",
    defaultDesc: "Covering 95%+ of internet users",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
  {
    value: "6",
    labelKey: "sdks",
    defaultLabel: "SDKs",
    descKey: "sdksDesc",
    defaultDesc: "React, Next.js, Expo, Flutter & more",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v5M9.5 14.5h5" />
      </svg>
    ),
  },
  {
    value: "<50ms",
    labelKey: "cdnLatency",
    defaultLabel: "CDN Latency",
    descKey: "cdnLatencyDesc",
    defaultDesc: "Global edge delivery, no build step",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    value: "99.9%",
    labelKey: "uptime",
    defaultLabel: "Uptime",
    descKey: "uptimeDesc",
    defaultDesc: "Enterprise-grade reliability & SLA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function MetricsBadges() {
  const t = useT("metrics");

  return (
    <section aria-label="Platform metrics" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
              {t("eyebrow", { defaultValue: "Platform" })}
            </div>
            <h2 className="mt-4 font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("title", { defaultValue: "Built for scale from day one." })}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-mist-600 lg:text-right">
            {t("subtitle", { defaultValue: "The numbers behind the platform powering global teams." })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((metric) => (
            <div
              key={metric.labelKey}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-mist-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-100 bg-mist-50 text-mist-600">
                {metric.icon}
              </div>
              <div>
                <p className="text-4xl font-bold tracking-[-0.04em] text-mist-950">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm font-medium text-mist-950">
                  {t(metric.labelKey, { defaultValue: metric.defaultLabel })}
                </p>
                <p className="mt-1 text-sm text-mist-500">
                  {t(metric.descKey, { defaultValue: metric.defaultDesc })}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
