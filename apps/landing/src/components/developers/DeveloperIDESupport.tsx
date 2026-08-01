import { useTranslations } from "@better-i18n/use-intl";
import { useState } from "react";
import {
  IconCursor,
  IconWindsurf,
  IconClaudeai,
  IconAntigravity,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { SpriteIcon } from "@/components/SpriteIcon";
import { HighlightedCode, type CodeLang } from "@/components/CodeBlock";
import { ZedIcon } from "@/components/ZedIcon";

const ideConfigs = [
  {
    key: "cursor",
    name: "Cursor",
    icon: IconCursor,
    lang: "json" as CodeLang,
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
    lang: "bash" as CodeLang,
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
    lang: "json" as CodeLang,
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
    lang: "json" as CodeLang,
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
    lang: "text" as CodeLang,
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

          {/* Right side - Code Block with Tabs */}
          <div className="relative">
            {/* Browser-like window frame */}
            {/* A figure keeps its own shell, but a hairline one — the card
                shadow was the last piece of elevation on this page. */}
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
              {/* Window header with dots */}
              <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
                <span className="text-xs text-mist-400 font-mono">
                  {activeIDE === "claude"
                    ? "terminal"
                    : activeIDE === "antigravity"
                      ? "GEMINI.md"
                      : "mcp-config.json"}
                </span>
              </div>

              {/* IDE Tabs */}
              <div className="flex border-b border-black/[0.06]">
                {ideConfigs.map((ide) => {
                  const Icon = ide.icon;
                  const isActive = activeIDE === ide.key;
                  return (
                    <button
                      key={ide.key}
                      type="button"
                      onClick={() => setActiveIDE(ide.key)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${ isActive ? "border-b-2 border-mist-950 text-mist-950 -mb-px" : "text-mist-500 hover:text-mist-900" }`}
                    >
                      <Icon className="size-4" />
                      {ide.name}
                    </button>
                  );
                })}
              </div>

              {/* This panel had its own two-hue highlighter: a line was italic
                  grey if it started with `#`, darker if it contained a quote.
                  That guessed at syntax it could not see. The shared tokeniser
                  reads the language properly and gives the same three hues as
                  every other code block on the site
                  (rule/code-blocks-carry-three-hues); the fixed line count is
                  kept so switching IDE does not resize the panel. */}
              <HighlightedCode
                lang={activeConfig.lang}
                code={codeLines.join("\n")}
                className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-mist-700"
              />
            </div>

            {/* Decorative gradient blur behind */}
            {/* (Removed: a blurred gradient glow behind the panel. Decoration
                with no information, and the only gradient left on the page.) */}
          </div>
        </div>
      </div>
    </section>
  );
}
