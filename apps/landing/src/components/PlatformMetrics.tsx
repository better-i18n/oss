import { useTranslations } from "@better-i18n/use-intl";

const METRIC_KEYS = [
  "linesOfCode",
  "apiEndpoints",
  "databaseTables",
  "aiTools",
  "mcpTools",
  "sdks",
] as const;

const METRIC_VALUES: Record<(typeof METRIC_KEYS)[number], string> = {
  linesOfCode: "195K+",
  apiEndpoints: "200+",
  databaseTables: "44",
  aiTools: "22",
  mcpTools: "13",
  sdks: "6",
};

/**
 * The numbers only. The section, its heading and its container belong to the
 * caller — this used to ship its own `<section className="bg-white">` plus a
 * centred `section-h2`, which meant the block decided the page's heading level
 * and painted a tinted band that `rule/white-page-hairline-separation` and
 * `rule/section-opens-with-header` both put on the page, not on a component.
 */
export default function PlatformMetrics() {
  const t = useTranslations("aboutPage");

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:gap-x-12">
      {METRIC_KEYS.map((key) => (
        <div key={key}>
          <dd className="text-3xl font-medium tabular-nums tracking-[-0.02em] text-mist-950 lg:text-4xl">
            {METRIC_VALUES[key]}
          </dd>
          <dt className="mt-2 text-sm text-mist-600">
            {t(`platformMetrics.items.${key}`)}
          </dt>
        </div>
      ))}
    </dl>
  );
}
