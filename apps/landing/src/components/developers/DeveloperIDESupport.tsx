import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";
import { McpClientSetup } from "@/components/visuals/McpClientSetup";

const features = [
  {
    spriteName: "sparkles-soft" as const,
    titleKey: "ideSupport.features.ai.title",
    descKey: "ideSupport.features.ai.description",
  },
  {
    spriteName: "globe" as const,
    titleKey: "ideSupport.features.context.title",
    descKey: "ideSupport.features.context.description",
  },
  {
    spriteName: "zap" as const,
    titleKey: "ideSupport.features.realtime.title",
    descKey: "ideSupport.features.realtime.description",
  },
];

export default function DeveloperIDESupport() {
  const t = useTranslations("developers");

  return (
    <section>
      <div className="section">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left side - Content */}
          <div className="lg:sticky lg:top-24">
            <h2 className="section-h2 lg:text-[2.75rem]/[1.1]">
              {t("ideSupport.title")}
            </h2>
            <p className="mt-5 text-lg text-mist-600 leading-relaxed max-w-lg">
              {t("ideSupport.description")}
            </p>

            {/* Features list */}
            <div className="mt-10 space-y-6">
              {features.map((feature) => {
                return (
                  <div key={feature.spriteName} className="flex gap-4">
                    <div className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
                      <SpriteIcon name={feature.spriteName} className="size-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-mist-950 text-base">
                        {t(feature.titleKey)}
                      </h3>
                      <p className="text-sm text-mist-500 mt-1 leading-relaxed">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right side — the shared MCP client panel. Same object, same five
              editors; /integrations/mcp-server/ renders it too instead of
              carrying a second copy of the configs that would drift. */}
          <McpClientSetup />
        </div>
      </div>
    </section>
  );
}
