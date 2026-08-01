"use client";

import { useTranslations } from "@better-i18n/use-intl";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import {
  IconPencil,
  IconSend,
  IconFileText,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import type { ComponentType } from "react";
import type { SpriteIconName } from "@/components/SpriteIcon";

const spriteIcons: Record<string, SpriteIconName> = {
  dashboard: "chart",
  aiHuman: "sparkles-soft",
  glossary: "book",
};

const legacyIcons: Record<string, ComponentType<{ className?: string }>> = {
  noCode: IconPencil,
  publish: IconSend,
  draft: IconFileText,
};

const featureKeys = [
  "dashboard",
  "aiHuman",
  "noCode",
  "publish",
  "draft",
  "glossary",
] as const;


export default function ProductFeatures() {
  const t = useTranslations("product-teams");

  return (
    <section>
      <div className="section">
          {/* Section Header */}
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl/[1.2] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.2]">
              {t("features.title")}
            </h2>
            <p className="section-p mt-3">
              {t("features.description")}
            </p>
          </div>

          {/* Bento Grid */}
          <Stagger className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((key) => {
              const spriteName = spriteIcons[key];
              const LegacyIcon = legacyIcons[key];
              return (
                <StaggerItem key={key} className="flex flex-col">
                  <div className="mb-4 flex size-[22px] items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                    {spriteName ? (
                      <SpriteIcon name={spriteName} className="size-3.5" />
                    ) : LegacyIcon ? (
                      <LegacyIcon className="size-3.5" />
                    ) : null}
                  </div>
                  <h3 className="text-base font-medium text-mist-950 mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-sm text-mist-600 leading-relaxed">
                    {t(`features.items.${key}.description`)}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        
      </div>
    </section>
  );
}
