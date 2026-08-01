import { useTranslations } from "@better-i18n/use-intl";
import {
  IconArrowLeftRight,
  IconArrowsRepeat,
  IconClipboard2,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const painPointKeys = [
  {
    key: "contextSwitching",
    icon: <IconArrowLeftRight className="size-3.5" />,
  },
  {
    key: "manualSyncing",
    icon: <IconArrowsRepeat className="size-3.5" />,
  },
  {
    key: "backlogDebt",
    icon: <IconClipboard2 className="size-3.5" />,
  },
];

export default function DeveloperPainPoints() {
  const t = useTranslations("developers");

  return (
    <section className="bg">
      <div className="section">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-h2">
            {t("painPoints.title")}
          </h2>
          <p className="section-p mt-3">
            {t("painPoints.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-3">
          {painPointKeys.map((point) => (
            <div
              key={point.key}
              className="flex flex-col"
            >
              <div>
                <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600 mb-4">
                  {point.icon}
                </div>
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900 mb-2">
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
