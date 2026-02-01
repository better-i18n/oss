"use client";

import { useState } from "react";
import { useTranslations } from "@better-i18n/use-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPeople,
  IconSpeaker,
  IconChart1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { ComponentType, SVGProps } from "react";

const roleIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  pm: IconPeople,
  marketing: IconSpeaker,
  leadership: IconChart1,
};

const roleKeys = ["pm", "marketing", "leadership"] as const;

export default function ProductCollaboration() {
  const t = useTranslations("product-teams");
  const [activeRole, setActiveRole] = useState<(typeof roleKeys)[number]>("pm");

  const points = [
    t(`collaboration.roles.${activeRole}.points.0`),
    t(`collaboration.roles.${activeRole}.points.1`),
    t(`collaboration.roles.${activeRole}.points.2`),
    t(`collaboration.roles.${activeRole}.points.3`),
  ];

  return (
    <section className="px-2 py-16 lg:py-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-semibold tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("collaboration.title")}
            </h2>
            <p className="mt-4 text-base text-mist-600">
              {t("collaboration.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Role Tabs */}
            <div className="lg:col-span-1 space-y-2">
              {roleKeys.map((roleKey) => {
                const Icon = roleIcons[roleKey];
                const isActive = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => setActiveRole(roleKey)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive
                        ? "bg-white border-mist-300 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-white/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-mist-950 text-white"
                            : "bg-mist-200 text-mist-600"
                        }`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <span
                          className={`block text-sm font-medium ${
                            isActive ? "text-mist-950" : "text-mist-700"
                          }`}
                        >
                          {t(`collaboration.roles.${roleKey}.title`)}
                        </span>
                        <span className="block text-xs text-mist-500">
                          {t(`collaboration.roles.${roleKey}.description`)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Content Panel */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-mist-200 p-6 lg:p-8"
                >
                  <h3 className="text-lg font-medium text-mist-950 mb-6">
                    {t(`collaboration.roles.${activeRole}.title`)}
                  </h3>

                  <ul className="space-y-4">
                    {points.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg
                            className="w-3 h-3 text-emerald-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-mist-700">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
