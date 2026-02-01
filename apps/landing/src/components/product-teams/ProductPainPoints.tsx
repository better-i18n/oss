"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";
import {
  IconExclamationCircle,
  IconCheckCircle2,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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
    <section className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("painPoints.title")}
            </h2>
            <p className="mt-4 text-base text-mist-600">
              {t("painPoints.description")}
            </p>
          </div>

          {/* Pain Points Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {painPoints.map((item, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group bg-white rounded-2xl p-6 lg:p-8 border border-mist-200 hover:border-mist-300 transition-colors"
              >
                {/* Pain Title */}
                <h3 className="text-lg font-medium text-mist-950 mb-6">
                  "{item.pain}"
                </h3>

                {/* Before/After */}
                <div className="space-y-4">
                  {/* Before */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconExclamationCircle className="size-5 text-red-400" />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-mist-400">
                        {t("painPoints.before")}
                      </span>
                      <p className="text-sm text-mist-600 mt-1">
                        {item.before}
                      </p>
                    </div>
                  </div>

                  {/* After */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <IconCheckCircle2 className="size-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-mist-400">
                        {t("painPoints.after")}
                      </span>
                      <p className="text-sm text-mist-950 mt-1 font-medium">
                        {item.after}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
