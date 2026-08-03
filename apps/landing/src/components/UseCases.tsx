import { useT } from "@/lib/i18n";
import { FeatureGrid } from "@/components/ui/page";
import {
  IconBag,
  IconPhone,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

type Feature = {
  key: string;
  title: string;
  description: string;
} & (
  | { spriteName: import("@/components/SpriteIcon").SpriteIconName; icon?: never }
  | { icon: React.ComponentType<{ className?: string }>; spriteName?: never }
);

/* Order is load-bearing: the first four are developer tooling, the last four are
   the use cases they serve. At 4 columns that reads as two labelled bands without
   needing two containers or two headings. */
const features: Feature[] = [
  { key: "typescript", spriteName: "code-brackets", title: "Type-Safe SDKs", description: "Full TypeScript support with autocompletion for every translation key." },
  { key: "cli", spriteName: "script", title: "CLI Tooling", description: "Scan your codebase, check for missing keys, and sync translations from the terminal." },
  { key: "git", spriteName: "github", title: "Git Integration", description: "Translation updates delivered via pull requests to your repository." },
  { key: "cdn", spriteName: "globe", title: "CDN Delivery", description: "Translations served globally with edge caching for instant load times." },
  { key: "saas", spriteName: "zap", title: "SaaS Apps", description: "Multi-tenant localization with per-workspace language configurations." },
  { key: "ecommerce", icon: IconBag, title: "E-Commerce", description: "Localize product listings, checkout flows, and marketing content." },
  { key: "mobile", icon: IconPhone, title: "Mobile Apps", description: "Over-the-air translation updates without app store resubmissions." },
  { key: "contentPlatforms", spriteName: "api-connection", title: "Content Platforms", description: "Manage translations alongside your CMS content with full API access." },
];

export default function UseCases() {
  const t = useT("developerFeatures");

  return (
    <section id="developer-features">
      <div className="section">
        <div className="mb-12 max-w-3xl">
          <h2 className="section-h2">
            {t("title")}
          </h2>
          <p className="section-p mt-3">
            {t("subtitle")}
          </p>
        </div>

        {/* One hairline container instead of eight cards. Cell rules follow the
            FrameworkSupport pattern: every cell draws its own top + left rule and
            the grid shifts -1px up/left, so the first row's and first column's
            rules slide under the container border and get clipped. No nth-child
            arithmetic, so no rule goes missing or doubles when the column count
            changes. 8 items in 4 (or 2, or 1) columns is always full rows. */}
        <div
          id="use-cases"
          /* No outer box — the frame already contains this block (Pricing does the
             same). overflow-hidden still clips the shifted edge rules, so only the
             interior hairlines remain, at every breakpoint. */
          className="overflow-hidden"
        >
          <FeatureGrid cols="auto-rows-fr sm:grid-cols-2 lg:grid-cols-4" padY={24}>
            {features.map((feature) => (
              <div
                key={feature.key}
                className="feat-cell flex flex-col gap-3"
              >
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                  {feature.spriteName ? (
                    <SpriteIcon name={feature.spriteName} className="size-3.5" />
                  ) : (
                    <feature.icon className="size-3.5" />
                  )}
                </span>
                <div>
                  <h3 className="text-[15px] font-medium leading-[1.3] tracking-[-0.02em] text-mist-900">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.55] text-mist-600">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </div>
    </section>
  );
}
