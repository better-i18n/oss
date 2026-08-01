"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  IconExclamationCircle,
  IconCheckCircle2,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";


export default function ProductPainPoints() {
  const t = useTranslations("product-teams");

  const painPoints = [
    {
      pain: t("painPoints.items.scattered.pain"),
      before: t("painPoints.items.scattered.before"),
      after: t("painPoints.items.scattered.after"),
    },
    {
      pain: t("painPoints.items.blocked.pain"),
      before: t("painPoints.items.blocked.before"),
      after: t("painPoints.items.blocked.after"),
    },
    {
      pain: t("painPoints.items.markets.pain"),
      before: t("painPoints.items.markets.before"),
      after: t("painPoints.items.markets.after"),
    },
    {
      pain: t("painPoints.items.voice.pain"),
      before: t("painPoints.items.voice.before"),
      after: t("painPoints.items.voice.after"),
    },
  ];

  return (
    <section>
      <div className="section">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("painPoints.title")}
            </h2>
            <p className="section-p mt-3">
              {t("painPoints.description")}
            </p>
          </div>

          {/* Pain Points Grid */}
          <Stagger className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            {painPoints.map((item) => (
              <StaggerItem key={item.pain} className="flex flex-col">
                {/* Pain Title */}
                <h3 className="mb-5 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  "{item.pain}"
                </h3>

                {/* Before/After */}
                <div className="space-y-4">
                  {/* Before */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconExclamationCircle className="size-3.5 text-mist-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-mist-400">
                        {t("painPoints.before")}
                      </span>
                      <p className="mt-1 text-[13px] leading-relaxed text-mist-600">
                        {item.before}
                      </p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconCheckCircle2 className="size-3.5 text-mist-600" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-mist-400">
                        {t("painPoints.after")}
                      </span>
                      <p className="mt-1 text-[13px] font-medium leading-relaxed text-mist-900">
                        {item.after}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        
      </div>
    </section>
  );
}
