import { useTranslations } from "@better-i18n/use-intl";
import {
  IconLightBulb,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

const stepKeys = [
  {
    key: "connect",
    icon: <SpriteIcon name="github" className="size-5" />,
  },
  {
    key: "discover",
    icon: <SpriteIcon name="magnifying-glass" className="size-5" />,
  },
  {
    key: "translate",
    icon: <IconLightBulb className="size-5" />,
  },
  {
    key: "publish",
    icon: <SpriteIcon name="checkmark" className="size-5" />,
  },
];

export default function DeveloperWorkflow() {
  const t = useTranslations("developers");

  return (
    <section>
      <div className="section">
        <div className="mb-12 lg:mb-16">
          <h2 className="section-h2">
            {t("workflow.title")}
          </h2>
          <p className="section-p mt-3">
            {t("workflow.subtitle")}
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-mist-200 via-mist-300 to-mist-200" />

            <div className="grid grid-cols-4 gap-6">
              {stepKeys.map((step, index) => (
                <div key={step.key} className="relative flex flex-col items-center">
                  {/* Step Circle */}
                  <div className="relative z-10 mb-6 flex size-24 flex-col items-center justify-center rounded-xl border border-black/[0.07] bg-white">
                    <span className="text-xs font-medium text-mist-400 mb-1">
                      {t(`workflow.steps.${step.key}.number`)}
                    </span>
                    <div className="text-mist-700">{step.icon}</div>
                  </div>

                  {/* Arrow (between steps) */}
                  {index < stepKeys.length - 1 && (
                    <div className="absolute top-12 left-[calc(50%+48px)] w-[calc(100%-96px)] flex items-center justify-center">
                      <SpriteIcon name="chevron-right" className="size-4 text-mist-400" />
                    </div>
                  )}

                  {/* Text */}
                  <h3 className="text-base font-medium text-mist-950 text-center mb-2">
                    {t(`workflow.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-sm text-mist-600 text-center max-w-[200px]">
                    {t(`workflow.steps.${step.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-black/[0.07]" />

            <div className="space-y-8">
              {stepKeys.map((step) => (
                <div key={step.key} className="relative flex gap-6">
                  {/* Step Circle */}
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border border-black/[0.07] bg-white">
                    <div className="text-mist-700">{step.icon}</div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-1">
                    <span className="text-xs font-medium text-mist-400 block mb-1">
                      {t(`workflow.steps.${step.key}.number`)}
                    </span>
                    <h3 className="text-base font-medium text-mist-950 mb-1">
                      {t(`workflow.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-mist-600">
                      {t(`workflow.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
