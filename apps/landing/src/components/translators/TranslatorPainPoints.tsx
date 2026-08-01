import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCircleInfo,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

const painPoints = [
  { key: "noContext", icon: <SpriteIcon name="magnifying-glass" className="size-3.5" /> },
  { key: "inconsistentTerms", icon: <SpriteIcon name="book" className="size-3.5" /> },
  { key: "blindQuality", icon: <IconCircleInfo className="size-3.5" /> },
];

export default function TranslatorPainPoints() {
  const t = useTranslations("translators");

  return (
    <section>
      <div className="section">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-h2">
            {t("painPoints.title")}
          </h2>
          <p className="section-p mt-3">
            {t("painPoints.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point) => (
            <div
              key={point.key}
              className="flex flex-col"
            >
              <div>
                <div className="mb-5 flex size-[22px] items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {point.icon}
                </div>
                <h3 className="mb-2 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {t(`painPoints.items.${point.key}.title`)}
                </h3>
                <p className="text-[13px] leading-relaxed text-mist-600">
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
