import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconChevronRight,
  IconGithub,
  IconLightBulb,
  IconMagnifyingGlass,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const stepKeys = [
  {
    key: "connect",
    icon: <IconGithub className="size-5" />,
  },
  {
    key: "discover",
    icon: <IconMagnifyingGlass className="size-5" />,
  },
  {
    key: "translate",
    icon: <IconLightBulb className="size-5" />,
  },
  {
    key: "publish",
    icon: <IconCheckmark1 className="size-5" />,
  },
];

export default function DeveloperWorkflow() {
  const t = useTranslations("developers");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("workflow.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600">
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
                <div key={index} className="relative flex flex-col items-center">
                  {/* Step Circle */}
                  <div className="size-24 rounded-2xl bg-white border border-mist-200 shadow-sm flex flex-col items-center justify-center mb-6 relative z-10">
                    <span className="text-xs font-bold text-mist-400 mb-1">
                      {t(`workflow.steps.${step.key}.number`)}
                    </span>
                    <div className="text-mist-700">{step.icon}</div>
                  </div>

                  {/* Arrow (between steps) */}
                  {index < stepKeys.length - 1 && (
                    <div className="absolute top-12 left-[calc(50%+48px)] w-[calc(100%-96px)] flex items-center justify-center">
                      <IconChevronRight className="size-4 text-mist-400" />
                    </div>
                  )}

                  {/* Text */}
                  <h3 className="text-base font-semibold text-mist-950 text-center mb-2">
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
            <div className="absolute top-0 bottom-0 left-6 w-px bg-mist-200" />

            <div className="space-y-8">
              {stepKeys.map((step, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Step Circle */}
                  <div className="size-12 rounded-xl bg-white border border-mist-200 shadow-sm flex items-center justify-center shrink-0 relative z-10">
                    <div className="text-mist-700">{step.icon}</div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-1">
                    <span className="text-xs font-bold text-mist-400 block mb-1">
                      {t(`workflow.steps.${step.key}.number`)}
                    </span>
                    <h3 className="text-base font-semibold text-mist-950 mb-1">
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
