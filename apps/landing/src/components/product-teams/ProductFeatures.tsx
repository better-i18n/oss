"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";
import {
  IconChart1,
  IconSparklesSoft,
  IconPencil,
  IconSend,
  IconFileText,
  IconBook,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { ComponentType, SVGProps } from "react";

const featureIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: IconChart1,
  aiHuman: IconSparklesSoft,
  noCode: IconPencil,
  publish: IconSend,
  draft: IconFileText,
  glossary: IconBook,
};

const featureKeys = [
  "dashboard",
  "aiHuman",
  "noCode",
  "publish",
  "draft",
  "glossary",
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductFeatures() {
  const t = useTranslations("product-teams");

  return (
    <section className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-base text-mist-600">
              {t("features.description")}
            </p>
          </div>

          {/* Bento Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featureKeys.map((key, idx) => {
              const Icon = featureIcons[key];
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="group bg-white rounded-2xl p-6 border border-mist-200 hover:border-mist-300 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-mist-100 flex items-center justify-center mb-4 group-hover:bg-mist-200 transition-colors">
                    <Icon className="size-5 text-mist-600" />
                  </div>
                  <h3 className="text-base font-medium text-mist-950 mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-mist-600 leading-relaxed">
                    {t(`features.items.${key}.description`)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
