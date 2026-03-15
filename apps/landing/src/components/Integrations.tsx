import { useT } from "@/lib/i18n";
import {
  IconPageText,
  IconCircleInfo,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";

type Integration = {
  key: string;
  title: string;
  description: string;
} & (
  | { spriteName: import("@/components/SpriteIcon").SpriteIconName; icon?: never }
  | { icon: React.ComponentType<{ className?: string }>; spriteName?: never }
);

const integrations: Integration[] = [
  { key: "git", spriteName: "github", title: "Git Sync", description: "Automatic pull requests with translated content, synced to your repository." },
  { key: "cdn", spriteName: "globe", title: "Global CDN", description: "Translations delivered from the edge with sub-50ms latency worldwide." },
  { key: "api", spriteName: "api-connection", title: "REST API", description: "Full API access for custom integrations and automation workflows." },
  { key: "mcp", spriteName: "robot", title: "MCP Server", description: "AI-native integration via Model Context Protocol for LLM workflows." },
  { key: "cicd", spriteName: "zap", title: "CI/CD Hooks", description: "Automated translation checks in your deployment pipeline." },
  { key: "cli", spriteName: "code-brackets", title: "CLI Tool", description: "Scan, sync, and manage translations from the command line." },
  { key: "vercel", spriteName: "script", title: "Vercel", description: "Deploy translations alongside your Vercel deployments." },
  { key: "vscode", icon: IconPageText, title: "VS Code", description: "Inline translation previews and key completion in your editor." },
  { key: "cloud", icon: IconCircleInfo, title: "Cloud Dashboard", description: "Manage all translations from a single, intuitive dashboard." },
];

export default function Integrations() {
  const t = useT("integrations");

  return (
    <section id="integrations" className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title", { defaultValue: "Integrations That Fit Your Stack" })}
          </h2>
          <p className="mt-4 text-lg text-mist-700 max-w-2xl mx-auto">
            {t("subtitle", { defaultValue: "Connect Better i18n to your existing tools and workflows." })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            return (
              <div
                key={integration.key}
                className="flex items-start gap-4 p-6 rounded-xl border border-mist-200 bg-white"
              >
                <div className="flex-shrink-0 size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700">
                  {integration.spriteName ? (
                    <SpriteIcon name={integration.spriteName} className="size-5" />
                  ) : (
                    <integration.icon className="size-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-medium text-mist-950">
                    {t(`${integration.key}.title`, { defaultValue: integration.title })}
                  </h3>
                  <p className="mt-1 text-sm text-mist-600">
                    {t(`${integration.key}.description`, { defaultValue: integration.description })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
