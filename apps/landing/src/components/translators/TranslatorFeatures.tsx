import { useTranslations } from "@better-i18n/use-intl";
import {
  IconAt,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

const features = [
  { key: "multiModel", icon: <SpriteIcon name="sparkles-soft" className="size-5" /> },
  { key: "humanControl", icon: <SpriteIcon name="checkmark" className="size-5" /> },
  { key: "glossary", icon: <SpriteIcon name="book" className="size-5" /> },
  { key: "mentions", icon: <IconAt className="size-5" /> },
];

export default function TranslatorFeatures() {
  const t = useTranslations("translators");

  return (
    <section id="features">
      <div className="section">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="section-h2">
            {t("features.title")}
          </h2>
          <p className="section-p mt-3 max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="flex flex-col"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-md border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-mist-950 mb-2">
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
