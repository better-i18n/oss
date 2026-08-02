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
      className="flex h-full flex-col"
    >
      <div className="p-1.5">
        <div className="relative flex h-[300px] shrink-0 flex-col rounded-lg bg-black/[0.02] px-4 pt-5 pb-4">
          {/* Assistant header — Better I18N logo + model badge */}
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
              <span className="text-[11px] font-medium text-mist-900">
                Better AI
              </span>
              <span className="text-[10px] text-mist-400 font-mono">
                gemini-3-pro
              </span>
            </div>
          </div>

          {/* Tool-call shell */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black/[0.07] bg-white">
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
                    <code className="text-[10px] font-mono text-mist-900 font-medium">
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
            <div className="flex min-h-0 flex-1 flex-col justify-start gap-0.5 overflow-hidden px-2 py-1.5">
              {TARGETS.map((row, i) => {
                const visible = i < visibleTargets;
                const streamingThisRow =
                  isStreaming && i === TARGETS.length - 1;
                return (
                  <div key={row.code} className="relative">
                    {/* Skeleton twin. Each row fades in on its own beat, so at
                        beat 0 this list would be one blank block inside the
                        panel. A hairline bar in the same geometry keeps the
                        list's shape readable; it sits outside the animated
                        element (which is opacity-0) and shifts no layout. */}
                    {!visible && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-4 top-1/2 h-[7px] -translate-y-1/2 rounded-full bg-black/[0.07]"
                      />
                    )}
                    <motion.div
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
                  </div>
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
                    "h-6 px-2 text-[10px] font-medium transition-[background-color]",
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
      <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
        <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
          {t("title")}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600 text-pretty">
          {t("description")}
        </p>
      </div>
    </div>
  );
}
