"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";
import {
  IconEarth,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";

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
    <section>
      <div className="section">
          <div className="flex flex-col gap-10 lg:gap-12">
            {/* Text Content */}
            <motion.div
              className="flex flex-col gap-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-black/[0.06] bg-mist-50 px-2.5 py-1 text-xs text-mist-600">
                <IconEarth className="size-4" />
                {t("hero.badge")}
              </span>

              <h1
                className="text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]"
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
                  className="btn btn-dark btn-lg"
                >
                  {t("hero.cta.primary")}
                  <SpriteIcon name="arrow-right" className="size-4" />
                </a>
                <a
                  href="#workflow"
                  className="learn-more"
                >
                  {t("hero.cta.secondary")}
                  <SpriteIcon name="chevron-right" className="size-4" />
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
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="text-2xl lg:text-3xl font-medium text-mist-950">
                    {stat.value}
                  </span>
                  <span className="text-[13px] leading-snug text-mist-500 text-pretty">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* The process, not a dashboard picture: the four published
                `painPoints.items.*.before` lines are already the manual lane and
                the `.after` lines are already ours, so the figure is the page's
                own copy laid on one x-scale. (`ProductDashboardPreview` is no
                longer rendered anywhere — it is dead code, not a regression.) */}
            <ProductProcess />
          </div>
      </div>
    </section>
  );
}

/**
 * Manual lane = the four `product-teams.painPoints.items.*.before` lines, Better
 * lane = the matching `.after` lines. Both were already published and already
 * paired as before/after prose on this page, so nothing here is a new claim; the
 * figure only puts the pair on one scale. The lane labels come from
 * `painPoints.before` / `painPoints.after`, which exist for exactly this contrast.
 */
function ProductProcess() {
  const t = useTranslations("product-teams");
  const tc = useTranslations("common");
  const ITEMS = ["blocked", "scattered", "markets", "voice"] as const;

  return (
    <ProcessCompare
      pillar="content"
      title={t("workflow.title")}
      handledLabel={tc("processCompare.handled")}
      /* No `dropped` here, unlike the developer and translator lanes: this
         page's before/after are 1:1 pairs — each manual habit is REPLACED by a
         better one, not eliminated — so striking three of them through claimed a
         shortening that does not happen, and the caption read "4 steps become 4".
         With nothing dropped the caption correctly disappears. */
      manual={{
        label: t("painPoints.before"),
        steps: ITEMS.map((key) => ({ label: t(`painPoints.items.${key}.before`) })),
      }}
      better={{
        label: t("painPoints.after"),
        steps: ITEMS.map((key) => ({ label: t(`painPoints.items.${key}.after`) })),
      }}
    />
  );
}
