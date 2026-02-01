import { useTranslations } from "@better-i18n/use-intl";
import {
  IconMagnifyingGlass,
  IconBook,
  IconCircleInfo,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const painPoints = [
  { key: "noContext", icon: <IconMagnifyingGlass className="size-6" /> },
  { key: "inconsistentTerms", icon: <IconBook className="size-6" /> },
  { key: "blindQuality", icon: <IconCircleInfo className="size-6" /> },
];

export default function TranslatorPainPoints() {
  const t = useTranslations("translators");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("painPoints.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600">
            {t("painPoints.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point) => (
            <div
              key={point.key}
              className="group relative border border-mist-200 rounded-2xl p-6 lg:p-8 hover:border-mist-300 transition-colors"
            >
              <div>
                <div className="size-12 rounded-xl bg-mist-100 flex items-center justify-center text-mist-600 mb-5">
                  {point.icon}
                </div>
                <h3 className="text-lg font-semibold text-mist-950 mb-2">
                  {t(`painPoints.items.${point.key}.title`)}
                </h3>
                <p className="text-mist-600 leading-relaxed">
                  {t(`painPoints.items.${point.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
