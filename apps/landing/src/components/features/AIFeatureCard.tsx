/**
 * AIFeatureCard — mirrors the real `proposeTranslations` tool-call card
 * rendered inside the AI Drawer (`apps/app/components/translations/ai/`).
 *
 * Visual story: assistant identifies ONE key, shows the source value, then
 * proposes target translations across N languages. Real flag images via
 * `<FlagIcon />`, real Edit / Approve buttons via `@better-i18n/ui`.
 *
 * 5-beat story arc:
 *   0 (1.0s): Thinking dots.
 *   1 (1.0s): Tool pill + key header + source row reveal.
 *   2 (0.9s): First target language streams in (DE).
 *   3 (0.9s): Second target (FR).
 *   4 (1.4s): Third target (TR) appears with shimmer (still streaming).
 *   5 (2.2s): Shimmer clears, Approve glows — loop pause.
 */

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@better-i18n/ui/components/button";
import { cn } from "@better-i18n/ui/lib/utils";

import { useT } from "@/lib/i18n";
import { DURATION, EASE_OUT } from "@/lib/motion";

import { FlagIcon } from "./FlagIcon";
import { useDemoLoop, type Beat } from "./use-demo-loop";

const BEATS: ReadonlyArray<Beat> = [
  { durationMs: 1000 },
  { durationMs: 1000 },
  { durationMs: 900 },
  { durationMs: 900 },
  { durationMs: 1400 },
  { durationMs: 2200 },
];

type TargetRow = { country: string; code: string; value: string };

const TARGETS: ReadonlyArray<TargetRow> = [
  { country: "de", code: "DE", value: "Synchronisieren" },
  { country: "fr", code: "FR", value: "Synchroniser" },
  { country: "tr", code: "TR", value: "Eşitleme" },
];

export function AIFeatureCard() {
  const t = useT("features.ai");
  const ref = useRef<HTMLDivElement>(null);
  const { beatIndex } = useDemoLoop({ beats: BEATS, ref });
  const reduced = useReducedMotion();

  const showShell = beatIndex >= 1;
  const visibleTargets = Math.max(0, beatIndex - 1);
  const isStreaming = beatIndex === 4;
  const approved = beatIndex >= 5;

  return (
    <div
      ref={ref}
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-shadow duration-200 hover:shadow-md"
    >
      <div className="p-1.5">
        <div className="h-[320px] bg-mist-50 rounded-xl border border-mist-200/60 px-5 pt-6 pb-4 flex flex-col shrink-0 relative">
          {/* Assistant header — Better i18n logo + model badge */}
          <div className="flex items-center gap-2.5 mb-4">
            <span
              aria-hidden
              className="size-6 rounded-md bg-white border border-mist-200 flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.06)] overflow-hidden"
            >
              <img
                src="/brand/logo.svg"
                alt=""
                className="size-3.5 object-contain"
              />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-semibold text-mist-900">
                Better AI
              </span>
              <span className="text-[10px] text-mist-400 font-mono">
                gemini-3-pro
              </span>
            </div>
          </div>

          {/* Tool-call shell */}
          <div className="flex-1 bg-white rounded-xl border border-mist-200 shadow-sm overflow-hidden flex flex-col min-h-0">
            {/* Tool header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-mist-100">
              <AnimatePresence mode="wait">
                {showShell ? (
                  <motion.div
                    key="pill"
                    initial={reduced ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                    className="flex items-center gap-1.5 w-full"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                    <code className="text-[10px] font-mono text-mist-900 font-semibold">
                      proposeTranslations
                    </code>
                    <span className="text-[9px] text-mist-500 tabular-nums ml-auto">
                      {visibleTargets}/{TARGETS.length}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="thinking"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fast }}
                    className="flex items-center gap-1.5"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-mist-400"
                        animate={
                          reduced ? { opacity: 0.4 } : { opacity: [0.3, 1, 0.3] }
                        }
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                    <span className="text-[10px] text-mist-500 ml-1">
                      {t("thinking")}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Key + source row */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: showShell ? 1 : 0, y: showShell ? 0 : 4 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
              className="px-3 py-2 border-b border-mist-100 bg-mist-50/40"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="size-3 text-mist-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 4l4-2 4 2 4-2v8l-4 2-4-2-4 2V4z" strokeLinejoin="round" />
                  <path d="M6 2v8M10 4v8" />
                </svg>
                <code className="text-[11px] font-mono text-mist-900">
                  dashboard.sync
                </code>
              </div>
              <div className="flex items-center gap-2 pl-4.5 ml-px">
                <FlagIcon countryCode="gb" />
                <span className="text-[10px] text-mist-600 italic">
                  Sync
                </span>
              </div>
            </motion.div>

            {/* Target language rows */}
            <div className="flex-1 px-2 py-1.5 space-y-0.5 overflow-hidden min-h-0">
              {TARGETS.map((row, i) => {
                const visible = i < visibleTargets;
                const streamingThisRow =
                  isStreaming && i === TARGETS.length - 1;
                return (
                  <motion.div
                    key={row.code}
                    initial={reduced ? false : { opacity: 0, y: 4 }}
                    animate={
                      visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
                    }
                    transition={{ duration: DURATION.base, ease: EASE_OUT }}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-mist-50 relative overflow-hidden"
                  >
                    <FlagIcon countryCode={row.country} />
                    <span className="text-[11px] text-mist-900 font-medium truncate flex-1">
                      {row.value}
                    </span>
                    {streamingThisRow && !reduced && (
                      <motion.div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        initial={{ x: "-100%" }}
                        animate={{ x: "120%" }}
                        transition={{
                          duration: 1.4,
                          ease: "easeInOut",
                          repeat: Infinity,
                        }}
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.16) 50%, transparent 100%)",
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-mist-100">
              <span className="text-[10px] text-mist-500">
                {approved ? t("appliedHint") : t("reviewHint")}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  tabIndex={-1}
                  className="h-6 px-2 text-[10px] text-mist-700 border-mist-200 bg-white hover:bg-mist-50"
                >
                  {t("edit")}
                </Button>
                <Button
                  asChild
                  size="xs"
                  tabIndex={-1}
                  className={cn(
                    "h-6 px-2 text-[10px] font-semibold transition-[background-color]",
                    approved
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-mist-900 text-white hover:bg-mist-800",
                  )}
                >
                  <motion.button
                    type="button"
                    animate={
                      approved && !reduced
                        ? { scale: [1, 1.04, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  >
                    {approved ? t("approved") : t("approve")}
                  </motion.button>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card footer — title + description */}
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
