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

export default function PlatformMetrics() {
  const t = useTranslations("aboutPage");

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl font-medium text-mist-950 mb-12 text-center">
          {t("platformMetrics.title")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
          {METRIC_KEYS.map((key) => (
            <div key={key} className="text-center">
              <span className="block text-3xl lg:text-4xl font-bold text-mist-950">
                {METRIC_VALUES[key]}
              </span>
              <span className="mt-2 block text-sm text-mist-600">
                {t(`platformMetrics.items.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
