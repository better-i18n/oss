import { useTranslations } from "@better-i18n/use-intl";
import { useState } from "react";
import {
  IconCursor,
  IconWindsurf,
  IconClaudeai,
  IconAntigravity,
  IconSparklesSoft,
  IconGlobe,
  IconZap,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { ZedIcon } from "@better-i18n/ui";

const ideConfigs = [
  {
    key: "cursor",
    name: "Cursor",
    icon: IconCursor,
    language: "json",
    code: `{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["@better-i18n/mcp"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key"
      }
    }
  }
}`,
  },
  {
    key: "claude",
    name: "Claude",
    icon: IconClaudeai,
    language: "bash",
    code: `# Claude Code (terminal)
claude mcp add better-i18n -s user \\
  -e BETTER_I18N_API_KEY=your-api-key \\
  -- npx -y @better-i18n/mcp

# Claude Desktop: add to config
# { "mcpServers": { "better-i18n":
#   { "command": "npx",
#     "args": ["@better-i18n/mcp"] }}}`,
  },
  {
    key: "windsurf",
    name: "Windsurf",
    icon: IconWindsurf,
    language: "json",
    code: `{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["@better-i18n/mcp"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key"
      }
    }
  }
}`,
  },
  {
    key: "zed",
    name: "Zed",
    icon: ZedIcon,
    language: "json",
    code: `{
  "context_servers": {
    "better-i18n": {
      "command": {
        "path": "npx",
        "args": ["@better-i18n/mcp"],
        "env": {
          "BETTER_I18N_API_KEY": "key"
        }
      }
    }
  }
}`,
  },
  {
    key: "antigravity",
    name: "Antigravity",
    icon: IconAntigravity,
    language: "markdown",
    code: `# Antigravity MCP Configuration
# Add to your GEMINI.md or .rules:

MCP Servers:
- better-i18n: @better-i18n/mcp

Environment Variables:
BETTER_I18N_API_KEY: your-api-key
BETTER_I18N_DEBUG: false`,
  },
];

const features = [
  {
    icon: IconSparklesSoft,
    titleKey: "ideSupport.features.ai.title",
    descKey: "ideSupport.features.ai.description",
  },
  {
    icon: IconGlobe,
    titleKey: "ideSupport.features.context.title",
    descKey: "ideSupport.features.context.description",
  },
  {
    icon: IconZap,
    titleKey: "ideSupport.features.realtime.title",
    descKey: "ideSupport.features.realtime.description",
  },
];

const CODE_LINES = 11;

// Normalize code to fixed line count for consistent height
function normalizeCode(code: string): string[] {
  const lines = code.split("\n");
  while (lines.length < CODE_LINES) {
    lines.push("");
  }
  return lines.slice(0, CODE_LINES);
}

export default function DeveloperIDESupport() {
  const t = useTranslations("developers");
  const [activeIDE, setActiveIDE] = useState("cursor");

  const activeConfig = ideConfigs.find((ide) => ide.key === activeIDE)!;
  const codeLines = normalizeCode(activeConfig.code);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left side - Content */}
          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-[2.75rem]/[1.1]">
              {t("ideSupport.title")}
            </h2>
            <p className="mt-5 text-lg text-mist-600 leading-relaxed max-w-lg">
              {t("ideSupport.description")}
            </p>

            {/* Features list */}
            <div className="mt-10 space-y-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 size-12 rounded-xl bg-mist-100 flex items-center justify-center text-mist-600">
                      <Icon className="size-6" />
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

          {/* Right side - Code Block with Tabs */}
          <div className="relative">
            {/* Browser-like window frame */}
            <div className="bg-white rounded-2xl border border-mist-200 shadow-xl overflow-hidden">
              {/* Window header with dots */}
              <div className="flex items-center gap-2 px-4 py-3 bg-mist-50 border-b border-mist-200">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400/80" />
                  <div className="size-3 rounded-full bg-yellow-400/80" />
                  <div className="size-3 rounded-full bg-green-400/80" />
                </div>
                <span className="ml-3 text-xs text-mist-400 font-mono">
                  {activeIDE === "claude"
                    ? "terminal"
                    : activeIDE === "antigravity"
                      ? "GEMINI.md"
                      : "mcp-config.json"}
                </span>
              </div>

              {/* IDE Tabs */}
              <div className="flex border-b border-mist-200 bg-mist-50/50">
                {ideConfigs.map((ide) => {
                  const Icon = ide.icon;
                  const isActive = activeIDE === ide.key;
                  return (
                    <button
                      key={ide.key}
                      onClick={() => setActiveIDE(ide.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? "bg-white text-mist-950 border-b-2 border-mist-950 -mb-px"
                          : "text-mist-500 hover:text-mist-700 hover:bg-mist-100/50"
                      }`}
                    >
                      <Icon className="size-4" />
                      {ide.name}
                    </button>
                  );
                })}
              </div>

              {/* Code Content - Fixed height, no scroll */}
              <div className="relative">
                <pre className="p-5 text-[13px] leading-[1.7]">
                  <code className="text-mist-700 font-mono block">
                    {codeLines.map((line, i) => (
                      <div key={i} className="flex h-[22px]">
                        <span className="select-none text-mist-400 w-6 text-right mr-4 shrink-0">
                          {i + 1}
                        </span>
                        <span
                          className={
                            line.trim().startsWith("#") ||
                            line.trim().startsWith("//")
                              ? "text-mist-400 italic"
                              : line.includes('"')
                                ? "text-mist-800"
                                : "text-mist-600"
                          }
                        >
                          {line || " "}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Decorative gradient blur behind */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-mist-200/40 via-transparent to-mist-100/40 rounded-3xl blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
