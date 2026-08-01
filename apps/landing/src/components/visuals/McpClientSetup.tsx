import { useState } from "react";
import {
  IconCursor,
  IconWindsurf,
  IconClaudeai,
  IconAntigravity,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { ZedIcon } from "@/components/ZedIcon";
import { HighlightedCode, type CodeLang } from "@/components/CodeBlock";

/**
 * The MCP client setup panel: one tab per editor, each showing that editor's
 * real config.
 *
 * Lifted out of `DeveloperIDESupport` unchanged, because /integrations/mcp-server/
 * needs exactly this and the alternative was a second copy of five config blocks
 * that would drift the first time an editor changes its config format. The
 * persona page keeps its own heading, description and feature list; only the
 * panel is shared.
 *
 * The configs are the ones the packages document: `npx -y @better-i18n/mcp`
 * over stdio for the JSON clients, `claude mcp add` for Claude Code
 * (packages/mcp/src/index.ts module header).
 */

const IDE_CONFIGS = [
  {
    key: "cursor",
    name: "Cursor",
    icon: IconCursor,
    filename: "mcp-config.json",
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
    filename: "terminal",
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
    filename: "mcp-config.json",
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
    filename: "mcp-config.json",
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
    filename: "GEMINI.md",
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

/** Every tab renders the same number of lines so switching does not resize the panel. */
const CODE_LINES = 11;

function normalizeCode(code: string): string[] {
  const lines = code.split("\n");
  while (lines.length < CODE_LINES) {
    lines.push("");
  }
  return lines.slice(0, CODE_LINES);
}

export function McpClientSetup() {
  const [activeIDE, setActiveIDE] = useState("cursor");
  const activeConfig = IDE_CONFIGS.find((ide) => ide.key === activeIDE) ?? IDE_CONFIGS[0];
  const codeLines = normalizeCode(activeConfig.code);

  return (
    /* A figure keeps its own shell, but a hairline one — this is a single
       object with one job, not a listed item (rule/listed-items-are-not-cards). */
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
        <span className="font-mono text-xs text-mist-400">{activeConfig.filename}</span>
      </div>

      <div className="flex overflow-x-auto border-b border-black/[0.06]">
        {IDE_CONFIGS.map((ide) => {
          const Icon = ide.icon;
          const isActive = activeIDE === ide.key;
          return (
            <button
              key={ide.key}
              type="button"
              onClick={() => setActiveIDE(ide.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${ isActive ? "-mb-px border-b-2 border-mist-950 text-mist-950" : "text-mist-500 hover:text-mist-900" }`}
            >
              <Icon className="size-4" />
              {ide.name}
            </button>
          );
        })}
      </div>

      <HighlightedCode
        lang={activeConfig.lang}
        code={codeLines.join("\n")}
        className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7] text-mist-700"
      />
    </div>
  );
}
