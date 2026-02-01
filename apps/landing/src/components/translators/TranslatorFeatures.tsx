import { useTranslations } from "@better-i18n/use-intl";
import {
  IconSparklesSoft,
  IconCheckmark1,
  IconBook,
  IconAt,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const features = [
  { key: "multiModel", icon: <IconSparklesSoft className="size-5" /> },
  { key: "humanControl", icon: <IconCheckmark1 className="size-5" /> },
  { key: "glossary", icon: <IconBook className="size-5" /> },
  { key: "mentions", icon: <IconAt className="size-5" /> },
];

export default function TranslatorFeatures() {
  const t = useTranslations("translators");

  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600 max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="group relative border border-mist-200 rounded-2xl p-6 lg:p-8 hover:border-mist-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-mist-100 flex items-center justify-center text-mist-700 shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-mist-950 mb-2">
                    {t(`features.items.${feature.key}.title`)}
                  </h3>
                  <p className="text-mist-600 leading-relaxed">
                    {t(`features.items.${feature.key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
