import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";

/**
 * The four translation statuses, told by ink weight instead of hue.
 *
 * Each step used to carry a colour on four surfaces at once — plate background,
 * plate border, a filled dot and the status text — red → amber → orange → green.
 * Four decorative hues in one row (rule/neutral-ink-accent-is-identity-only), and
 * they were not carrying the meaning: the published status LABEL does that. The
 * progression now reads as ink getting heavier as a string gets closer to live,
 * which is the same device the rest of the site uses for "more done".
 *
 * If we ever decide status hue is information (the way code tokens are), that is
 * a rule to ratify in DESIGN-DECISIONS.md first, not a per-component choice.
 */
const workflowSteps = [
  { key: "missing", dot: "bg-mist-200", ink: "text-mist-400" },
  { key: "draft", dot: "bg-mist-300", ink: "text-mist-500" },
  { key: "approved", dot: "bg-mist-500", ink: "text-mist-600" },
  { key: "published", dot: "bg-mist-900", ink: "text-mist-900" },
];

export default function TranslatorWorkflow() {
  const t = useTranslations("translators");

  return (
    <section>
      <div className="section">
        <div className="mb-12 lg:mb-16 text-center">
          <h2 className="section-h2">
            {t("workflow.title")}
          </h2>
          <p className="section-p mt-3 max-w-2xl mx-auto">
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
                  {/* Status: a 6px dot and the label, no 112px plate. */}
                  <div className="relative z-10 mb-5 flex items-center gap-2 bg-white pr-2">
                    <span className={`size-1.5 shrink-0 rounded-full ${step.dot}`} />
                    <span className={`text-[11px] font-medium ${step.ink}`}>
                      {t(`workflow.steps.${step.key}.status`)}
                    </span>
                  </div>

                  {/* Arrow (between steps) */}
                  {index < workflowSteps.length - 1 && (
                    <div className="absolute top-14 -translate-y-1/2 left-[calc(50%+56px)] w-[calc(100%-112px)] flex items-center justify-center">
                      <SpriteIcon name="chevron-right" className="size-4 text-mist-300" />
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

        {/* Mobile: Vertical Pipeline */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-mist-200" />

            <div className="space-y-8">
              {workflowSteps.map((step) => (
                <div key={step.key} className="relative flex gap-6">
                  <div className="relative z-10 mt-1.5 flex size-[22px] shrink-0 items-center justify-center bg-white">
                    <span className={`size-1.5 rounded-full ${step.dot}`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <span className={`mb-1 block text-[11px] font-medium ${step.ink}`}>
                      {t(`workflow.steps.${step.key}.status`)}
                    </span>
                    <h3 className="mb-1 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                      {t(`workflow.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-mist-600">
                      {t(`workflow.steps.${step.key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary — a sentence, not a pill on a tinted chip. */}
        <p className="mt-10 text-[13px] leading-relaxed text-mist-600">
          {t("workflow.summary")}
        </p>
      </div>
    </section>
  );
}
