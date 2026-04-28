/**
 * Features section — orchestrates the three product showcase cards.
 *
 * Each card mirrors a real, named UI surface from the better-i18n
 * platform dashboard:
 *
 *   - features/AIFeatureCard.tsx       AI tool-call (proposeTranslations)
 *   - features/PublishFeatureCard.tsx  Sync activity log + status summary
 *   - features/McpFeatureCard.tsx      MCP IDE setup (Cursor / Claude / etc.)
 *
 * Cards animate only while in viewport (useDemoLoop), pause off-screen,
 * and freeze at their final beat under prefers-reduced-motion.
 */

import { Link, useParams } from "@tanstack/react-router";

import { SpriteIcon } from "@/components/SpriteIcon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useT } from "@/lib/i18n";

import { AIFeatureCard } from "./features/AIFeatureCard";
import { McpFeatureCard } from "./features/McpFeatureCard";
import { PublishFeatureCard } from "./features/PublishFeatureCard";

export default function Features() {
  const t = useT("features");
  const { locale } = useParams({ strict: false });

  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04] text-balance">
                {t("title", {
                  defaultValue: "Küresel ölçekte yayınlamak için tek platform.",
                })}
              </h2>
              <p className="mt-4 text-lg text-mist-600 text-pretty">
                {t("subtitle", {
                  defaultValue:
                    "Çevirin. Yönetin. Yayınlayın. Tüm dilleri tek panelden kontrol edin.",
                })}
              </p>
            </div>
            <Link
              to="/$locale/features/"
              params={{ locale: locale || "en" }}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-mist-700 hover:text-mist-950 transition-colors"
            >
              {t("seeHowItWorks", { defaultValue: "Nasıl çalıştığını görün" })}
              <SpriteIcon name="arrow-right" className="w-4 h-4" />
            </Link>
          </div>

          <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3 items-stretch">
            <StaggerItem className="h-full">
              <AIFeatureCard />
            </StaggerItem>
            <StaggerItem className="h-full">
              <PublishFeatureCard />
            </StaggerItem>
            <StaggerItem className="h-full">
              <McpFeatureCard />
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
