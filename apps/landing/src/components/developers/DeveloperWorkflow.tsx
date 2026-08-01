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
            {/* A hairline, not a gradient: the rail is structure, and a fading
                gradient is decoration pretending to be one. */}
            <div className="absolute top-[11px] left-0 right-0 h-px bg-black/[0.07]" />

            <div className="grid grid-cols-4 gap-6">
              {stepKeys.map((step, index) => (
                <div key={step.key} className="relative flex flex-col">
                  {/* Step Circle */}
                  {/* One 22px neutral tile, not a 96px bordered plate: the
                      number carries the sequence and the tile only carries the
                      mark (rule/listed-items-are-not-cards). */}
                  <div className="relative z-10 mb-5 flex items-center gap-2 bg-white pr-2">
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                      {step.icon}
                    </span>
                    <span className="text-[11px] font-medium tabular-nums text-mist-400">
                      {t(`workflow.steps.${step.key}.number`)}
                    </span>
                  </div>

                  {/* Arrow (between steps) */}
                  {index < stepKeys.length - 1 && (
                    <div className="absolute top-[3px] right-3 flex items-center">
                      <SpriteIcon name="chevron-right" className="size-3.5 text-mist-300" />
                    </div>
                  )}

                  {/* Left-aligned, like every other step list on the site —
                      centred text in a four-column row had nothing to align to. */}
                  <h3 className="mb-1.5 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(`workflow.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-mist-600">
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
            <div className="absolute top-0 bottom-0 left-[11px] w-px bg-black/[0.07]" />

            <div className="space-y-8">
              {stepKeys.map((step) => (
                <div key={step.key} className="relative flex gap-4">
                  {/* Step Circle */}
                  <div className="relative z-10 flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                    {step.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <span className="mb-1 block text-[11px] font-medium tabular-nums text-mist-400">
                      {t(`workflow.steps.${step.key}.number`)}
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
      </div>
    </section>
  );
}
