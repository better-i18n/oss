/**
 * McpFeatureCard — mirrors the real MCP `ConnectCard` from
 * `apps/app/routes/(app)/$orgSlug/$projectSlug/integrations/mcp.tsx`.
 *
 * Visual reference: a tab strip across the top with IDE icons (Cursor,
 * Claude Code, Windsurf, Antigravity), an underline indicator showing
 * the active tab, and a code-block panel below with a filename header
 * and a syntax-highlighted command/JSON payload.
 *
 * 4-beat story arc: cycles through the four IDEs, sliding the underline
 * indicator and crossfading the code block content. Demonstrates that
 * Better i18n's MCP works across every major coding agent.
 */

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconAntigravity,
  IconClaudeai,
  IconCursor,
  IconWindsurf,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

import { useT } from "@/lib/i18n";
import { DURATION, EASE_OUT } from "@/lib/motion";

import { useDemoLoop, type Beat } from "./use-demo-loop";

const BEATS: ReadonlyArray<Beat> = [
  { durationMs: 2400 },
  { durationMs: 2400 },
  { durationMs: 2400 },
  { durationMs: 2800 },
];

type TabSpec = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  filename: string;
  language: "json" | "bash" | "markdown";
  code: string;
};

const TABS: ReadonlyArray<TabSpec> = [
  {
    id: "cursor",
    label: "Cursor",
    Icon: IconCursor,
    filename: "~/.cursor/mcp.json",
    language: "json",
    code: `{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp"]
    }
  }
}`,
  },
  {
    id: "claude-code",
    label: "Claude Code",
    Icon: IconClaudeai,
    filename: "Terminal",
    language: "bash",
    code: `claude mcp add -s user \\
  -e BETTER_I18N_API_KEY=*** \\
  better-i18n -- npx @better-i18n/mcp`,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    Icon: IconWindsurf,
    filename: "~/.codeium/windsurf/mcp_config.json",
    language: "json",
    code: `{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp"]
    }
  }
}`,
  },
  {
    id: "antigravity",
    label: "Antigravity",
    Icon: IconAntigravity,
    filename: "GEMINI.md",
    language: "markdown",
    code: `# better-i18n MCP

Use the better-i18n MCP server to manage
translation keys and publish from chat.`,
  },
];

export function McpFeatureCard() {
  const t = useT("features.mcp");
  const ref = useRef<HTMLDivElement>(null);
  const { beatIndex } = useDemoLoop({ beats: BEATS, ref });
  const reduced = useReducedMotion();

  const active = TABS[beatIndex] ?? TABS[0];

  return (
    <div
      ref={ref}
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-shadow duration-200 hover:shadow-md"
    >
      <div className="p-1.5">
        <div className="h-[320px] bg-mist-50 rounded-xl border border-mist-200/60 px-5 pt-6 pb-4 flex flex-col shrink-0">
        {/* Tab strip with sliding underline indicator */}
        <div className="relative flex items-center gap-1 mb-3 border-b border-mist-200">
          {TABS.map((tab, i) => {
            const isActive = i === beatIndex;
            return (
              <div
                key={tab.id}
                className={`relative flex items-center gap-1.5 px-2 py-2 text-[10px] font-medium transition-colors ${
                  isActive ? "text-mist-900" : "text-mist-500"
                }`}
              >
                <tab.Icon className="size-3.5" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="mcp-tab-indicator"
                    className="absolute left-0 right-0 -bottom-px h-px bg-mist-900"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: DURATION.base, ease: EASE_OUT }
                    }
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Code block — filename header + content body */}
        <div className="flex-1 bg-white rounded-xl border border-mist-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-mist-100">
            <AnimatePresence mode="wait">
              <motion.span
                key={active.filename}
                initial={reduced ? false : { opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                className="text-[10px] font-mono text-mist-500"
              >
                {active.filename}
              </motion.span>
            </AnimatePresence>
            <span className="text-[9px] text-mist-400 uppercase tracking-wider">
              {active.language}
            </span>
          </div>
          <div className="flex-1 px-3 py-2.5 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.pre
                key={active.id}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
                className="text-[10px] font-mono leading-[1.6] text-mist-700 whitespace-pre overflow-hidden"
              >
                {active.code}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom hint — works everywhere */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span aria-hidden className="size-1 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-mist-500">
            {t("worksEverywhere")}
          </span>
        </div>
        </div>
      </div>

      <div className="px-6 pt-2 pb-5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-mist-950">
          {t("title")}
        </h3>
        <p className="mt-1.5 text-sm text-mist-600 leading-relaxed text-pretty">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
