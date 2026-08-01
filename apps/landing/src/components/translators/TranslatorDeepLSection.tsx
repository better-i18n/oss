import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowsRepeat,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

const benefits = [
  { key: "consistent", icon: <SpriteIcon name="checkmark" className="size-3.5" /> },
  { key: "autoSync", icon: <IconArrowsRepeat className="size-3.5" /> },
  { key: "allPairs", icon: <SpriteIcon name="globe" className="size-3.5" /> },
];

export default function TranslatorDeepLSection() {
  const t = useTranslations("translators");

  return (
    <section>
      <div className="section">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <div className="eyebrow">{t("deepl.badge")}</div>
          <h2 className="section-h2">
            {t("deepl.title")}
          </h2>
          <p className="section-p mt-3">
            {t("deepl.subtitle")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.key}
              className="flex flex-col"
            >
              <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600 mb-4">
                {benefit.icon}
              </div>
              <h3 className="mb-2 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                {t(`deepl.benefits.${benefit.key}.title`)}
              </h3>
              <p className="text-[13px] leading-relaxed text-mist-600">
                {t(`deepl.benefits.${benefit.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
