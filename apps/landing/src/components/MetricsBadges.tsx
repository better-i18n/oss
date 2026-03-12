import { useT } from "@/lib/i18n";

const METRICS = [
  { value: "200+", labelKey: "apiEndpoints", defaultLabel: "API Endpoints" },
  { value: "22", labelKey: "aiTools", defaultLabel: "AI Tools" },
  { value: "47", labelKey: "languages", defaultLabel: "Languages" },
  { value: "6", labelKey: "sdks", defaultLabel: "SDKs" },
] as const;

export default function MetricsBadges() {
  const t = useT("metrics");

  return (
    <section
      aria-label="Platform metrics"
      className="grid grid-cols-2 gap-6 px-6 md:flex md:justify-center md:gap-12 lg:gap-16 mx-auto w-full max-w-[1400px]"
    >
      {METRICS.map((metric) => (
        <div key={metric.labelKey} className="text-center">
          <p className="text-3xl font-bold text-mist-950 sm:text-4xl">
            {metric.value}
          </p>
          <p className="mt-1 text-sm text-mist-600">
            {t(metric.labelKey, { defaultValue: metric.defaultLabel })}
          </p>
        </div>
      ))}
    </section>
  );
}
