"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { motion } from "framer-motion";

// Static workflow visualization
// TODO: Replace with Remotion animation when ready
// const RemotionWorkflowPlayer = lazy(() => import("./remotion/WorkflowPlayer"));

function WorkflowStatic({
  steps,
}: {
  steps: Array<{ title: string; description: string; icon: string }>;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center gap-2 lg:gap-0">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-mist-200 flex items-center justify-center text-2xl mb-3 shadow-sm">
              {step.icon}
            </div>
            <span className="text-sm font-medium text-mist-950">
              {step.title}
            </span>
            <span className="text-xs text-mist-500 mt-1">
              {step.description}
            </span>
          </motion.div>

          {/* Connector Arrow */}
          {idx < steps.length - 1 && (
            <motion.div
              className="hidden lg:block w-8 h-0.5 bg-mist-200 mx-2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 + 0.1 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProductWorkflow() {
  const t = useTranslations("product-teams");

  const steps = [
    {
      title: t("workflow.steps.merged.title"),
      description: t("workflow.steps.merged.description"),
      icon: "📝",
    },
    {
      title: t("workflow.steps.synced.title"),
      description: t("workflow.steps.synced.description"),
      icon: "🔄",
    },
    {
      title: t("workflow.steps.translate.title"),
      description: t("workflow.steps.translate.description"),
      icon: "🤖",
    },
    {
      title: t("workflow.steps.review.title"),
      description: t("workflow.steps.review.description"),
      icon: "👀",
    },
    {
      title: t("workflow.steps.publish.title"),
      description: t("workflow.steps.publish.description"),
      icon: "🚀",
    },
  ];

  return (
    <section id="workflow" className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("workflow.title")}
            </h2>
            <p className="mt-4 text-base text-mist-600">
              {t("workflow.description")}
            </p>
          </div>

          {/* Workflow Animation Container */}
          <div className="bg-white rounded-2xl border border-mist-200 p-8 lg:p-12">
            {/* Use static version for now, Remotion will enhance it */}
            <WorkflowStatic steps={steps} />

            {/* Timeline indicator */}
            <div className="mt-8 pt-6 border-t border-mist-100">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-mist-300" />
                  <span className="text-mist-500">
                    {t("workflow.legend.developer")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-mist-500">
                    {t("workflow.legend.automated")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-mist-500">
                    {t("workflow.legend.productTeam")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
