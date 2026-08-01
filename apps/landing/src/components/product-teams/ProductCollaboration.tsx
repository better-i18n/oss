"use client";

import { useState } from "react";
import { useTranslations } from "@better-i18n/use-intl";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  IconPeople,
  IconSpeaker,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import type { ComponentType } from "react";
import type { SpriteIconName } from "@/components/SpriteIcon";

const roleIcons: Record<string, ComponentType<{ className?: string }>> = {
  pm: IconPeople,
  marketing: IconSpeaker,
};

const roleSpriteIcons: Record<string, SpriteIconName> = {
  leadership: "chart",
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
    <section>
      <div className="section">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("collaboration.title")}
            </h2>
            <p className="section-p mt-3">
              {t("collaboration.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Role Tabs */}
            <div className="lg:col-span-1 space-y-2">
              {roleKeys.map((roleKey) => {
                const Icon = roleIcons[roleKey];
                const spriteName = roleSpriteIcons[roleKey];
                const isActive = activeRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setActiveRole(roleKey)}
                    className={`w-full border-l py-2 pl-4 text-left transition-colors ${ isActive ? "border-l-mist-900 text-mist-900" : "border-l-black/[0.07] text-mist-500 hover:text-mist-900" }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] transition-colors ${ isActive ? "text-mist-900" : "text-mist-500" }`}
                      >
                        {spriteName ? (
                          <SpriteIcon name={spriteName} className="size-3.5" />
                        ) : Icon ? (
                          <Icon className="size-3.5" />
                        ) : null}
                      </div>
                      <div>
                        <span
                          className={`block text-sm font-medium ${ isActive ? "text-mist-950" : "text-mist-700" }`}
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
              {/* Re-keyed on the active role so switching tabs replays the
                  house fade-up. AnimatePresence plus a hand-rolled x-slide was
                  the only bespoke motion left on this page; Stagger is the
                  same grammar every other section already uses. */}
              <Stagger key={activeRole} className="min-w-0">
                <StaggerItem>
                  <h3 className="mb-6 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    {t(`collaboration.roles.${activeRole}.title`)}
                  </h3>
                </StaggerItem>

                <StaggerItem>
                  <ul className="space-y-4">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-black/[0.06] bg-white">
                          <svg
                            className="size-2.5 text-mist-700"
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
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              </Stagger>

          </div>
        </div>
      </div>
    </section>
  );
}
