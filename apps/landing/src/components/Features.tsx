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
    <section id="features">
      <div className="section">
        <div className="flex flex-col gap-12">
          <div className="max-w-2xl">
            <div>
              <h2 className="section-h2 text-balance">
                {t("title")}
              </h2>
              <p className="section-p mt-3">
                {t("subtitle")}
              </p>
            </div>
            {/* Section-level secondary action belongs under the lede it qualifies,
                not floated to the far right where it reads as unrelated chrome. */}
            <Link
              to="/$locale/features/"
              params={{ locale: locale || "en" }}
              className="learn-more mt-5 w-fit"
            >
              {t("seeHowItWorks")}
              <SpriteIcon name="arrow-right" className="size-3.5" />
            </Link>
          </div>

          {/* Three columns split by hairlines, not three floating cards: the demo
              wells carry the visual weight, so a card border around each one was a
              second frame competing with them. overflow-hidden clips the shifted
              edge rules so only the interior verticals show. */}
          <div>
            <Stagger className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
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
      </div>
    </section>
  );
}
