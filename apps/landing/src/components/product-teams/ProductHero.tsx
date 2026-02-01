"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconChevronRight,
  IconEarth,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export default function ProductHero() {
  const t = useTranslations("product-teams");

  const stats = [
    {
      value: t("hero.stats.faster.value"),
      label: t("hero.stats.faster.label"),
    },
    {
      value: t("hero.stats.devHours.value"),
      label: t("hero.stats.devHours.label"),
    },
    {
      value: t("hero.stats.visibility.value"),
      label: t("hero.stats.visibility.label"),
    },
    {
      value: t("hero.stats.publish.value"),
      label: t("hero.stats.publish.label"),
    },
  ];

  return (
    <section className="px-2 pt-8 pb-16 lg:pb-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content */}
            <motion.div
              className="flex flex-col gap-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit">
                <IconEarth className="size-4" />
                {t("hero.badge")}
              </span>

              <h1
                className="text-3xl/[1.1] font-semibold tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]"
                style={{ textWrap: "balance" }}
              >
                {t("hero.title")}
              </h1>

              <p
                className="text-base/7 text-mist-600 lg:text-lg/8"
                style={{ textWrap: "pretty" }}
              >
                {t("hero.description")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
                >
                  {t("hero.cta.primary")}
                  <IconArrowRight className="size-4" />
                </a>
                <a
                  href="#workflow"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
                >
                  {t("hero.cta.secondary")}
                  <IconChevronRight className="size-4" />
                </a>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="text-2xl lg:text-3xl font-semibold text-mist-950">
                    {stat.value}
                  </span>
                  <span className="text-sm text-mist-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
