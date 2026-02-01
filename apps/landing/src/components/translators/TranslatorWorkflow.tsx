import { useTranslations } from "@better-i18n/use-intl";
import { IconChevronRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const workflowSteps = [
  {
    key: "missing",
    dotColor: "bg-red-400",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
  },
  {
    key: "draft",
    dotColor: "bg-amber-400",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-600",
  },
  {
    key: "approved",
    dotColor: "bg-orange-400",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
  },
  {
    key: "published",
    dotColor: "bg-green-400",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-600",
  },
];

export default function TranslatorWorkflow() {
  const t = useTranslations("translators");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("workflow.title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600 max-w-2xl mx-auto">
            {t("workflow.subtitle")}
          </p>
        </div>

        {/* Desktop: Horizontal Pipeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-14 left-0 right-0 h-px bg-mist-200" />

            <div className="grid grid-cols-4 gap-6">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.key}
                  className="relative flex flex-col items-center"
                >
                  {/* Status Circle */}
                  <div
                    className={`size-28 rounded-2xl ${step.bgColor} border ${step.borderColor} flex flex-col items-center justify-center mb-6 relative z-10`}
                  >
                    <div
                      className={`size-5 rounded-full ${step.dotColor} mb-2`}
                    />
                    <span className={`text-xs font-semibold ${step.textColor}`}>
                      {t(`workflow.steps.${step.key}.status`)}
                    </span>
                  </div>

                  {/* Arrow (between steps) */}
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute top-14 -translate-y-1/2 left-[calc(50%+56px)] w-[calc(100%-112px)] flex items-center justify-center">
                      <IconChevronRight className="size-4 text-mist-300" />
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

        {/* Mobile: Vertical Pipeline */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-mist-200" />

            <div className="space-y-8">
              {workflowSteps.map((step) => (
                <div key={step.key} className="relative flex gap-6">
                  {/* Status Circle */}
                  <div
                    className={`size-12 rounded-xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center shrink-0 relative z-10`}
                  >
                    <div className={`size-3 rounded-full ${step.dotColor}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-1">
                    <span
                      className={`text-xs font-semibold ${step.textColor} block mb-1`}
                    >
                      {t(`workflow.steps.${step.key}.status`)}
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

        {/* Summary */}
        <div className="mt-12 text-center">
          <p className="text-sm text-mist-500 bg-mist-50 border border-mist-200 inline-block px-4 py-2 rounded-full">
            {t("workflow.summary")}
          </p>
        </div>
      </div>
    </section>
  );
}
