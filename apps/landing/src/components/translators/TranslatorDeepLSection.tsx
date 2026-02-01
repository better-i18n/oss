import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowsRepeat,
  IconCheckmark1,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const benefits = [
  { key: "consistent", icon: <IconCheckmark1 className="size-5" /> },
  { key: "autoSync", icon: <IconArrowsRepeat className="size-5" /> },
  { key: "allPairs", icon: <IconGlobe className="size-5" /> },
];

export default function TranslatorDeepLSection() {
  const t = useTranslations("translators");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12 lg:mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm text-blue-700 mb-6">
            <img
              src="/logo/deepl.svg"
              alt="DeepL"
              className="size-4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {t("deepl.badge")}
          </div>
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("deepl.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600 max-w-2xl mx-auto">
            {t("deepl.subtitle")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.key}
              className="relative border border-mist-200 rounded-2xl p-6 lg:p-8 hover:border-mist-300 transition-colors"
            >
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-5">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-mist-950 mb-2">
                {t(`deepl.benefits.${benefit.key}.title`)}
              </h3>
              <p className="text-mist-600 leading-relaxed">
                {t(`deepl.benefits.${benefit.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
