/**
 * PublishFeatureCard — mirrors the real publish status popover from
 * `sync-status-button-group.tsx` (StatusSummaryCard + ActivityLog).
 *
 * The activity log walks through 7 sequential steps. Each step has three
 * visual states:
 *
 *   - hidden    — not yet reached (faded)
 *   - active    — currently running (blue, pulsing dot, no timestamp yet)
 *   - completed — finished (emerald dot, timestamp revealed)
 *
 * The vertical connector line between dots fills with emerald (via scaleY)
 * as each step completes — that progressive fill is what gives the card
 * its "sync vibe": you can FEEL the work flowing top-to-bottom.
 *
 * Loop runs only while in viewport. Reduced-motion freezes at the end
 * state.
 */

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useT } from "@/lib/i18n";
import { DURATION, EASE_OUT } from "@/lib/motion";

import { FlagIcon } from "./FlagIcon";
import { useDemoLoop, type Beat } from "./use-demo-loop";

const STEPS = [
  { key: "queued", label: "Queued", time: "14:32:00" },
  { key: "filesGenerated", label: "Generating files", time: "14:32:01" },
  { key: "uploadedToCdn", label: "Uploading to CDN", time: "14:32:04" },
  { key: "manifestUploaded", label: "Manifest uploaded", time: "14:32:08" },
  { key: "cachePurged", label: "CDN cache cleared", time: "14:32:11" },
  { key: "prCreated", label: "Pull request created", time: "14:32:14" },
  { key: "completed", label: "Completed", time: "14:32:16" },
] as const;

const BEATS: ReadonlyArray<Beat> = [
  { durationMs: 1000 }, // 0 — Queued active
  { durationMs: 700 },  // 1 — Generating files active
  { durationMs: 700 },  // 2 — Uploading to CDN active
  { durationMs: 700 },  // 3 — Manifest uploaded active
  { durationMs: 700 },  // 4 — CDN cache cleared active
  { durationMs: 700 },  // 5 — Pull request created active
  { durationMs: 900 },  // 6 — Completed active
  { durationMs: 2200 }, // 7 — all done, status emerald (pause)
];

const LANGUAGES = ["de", "fr", "jp"] as const;

export function PublishFeatureCard() {
  const t = useT("features.publish");
  const ref = useRef<HTMLDivElement>(null);
  const { beatIndex } = useDemoLoop({ beats: BEATS, ref });
  const reduced = useReducedMotion();

  // Last beat = "all done & pause". During earlier beats, beatIndex maps
  // directly to the active step.
  const allDone = beatIndex >= STEPS.length;
  const activeStep = allDone ? -1 : beatIndex;

  // Header duration ticker: 0 → 16 across the loop.
  const elapsed = Math.min(16, allDone ? 16 : beatIndex * 2 + 1);

  return (
    <div
      ref={ref}
      className="flex flex-col h-full bg-white border border-mist-200 rounded-2xl overflow-hidden shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-shadow duration-200 hover:shadow-md"
    >
      <div className="p-1.5">
        <div className="h-[320px] bg-mist-50 rounded-xl border border-mist-200/60 px-5 pt-6 pb-4 flex flex-col shrink-0">
        {/* Header — status + counts + duration */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <motion.span
              aria-hidden
              className={`size-1.5 rounded-full ${
                allDone ? "bg-emerald-500" : "bg-blue-500"
              }`}
              animate={
                !allDone && !reduced
                  ? { opacity: [1, 0.4, 1] }
                  : { opacity: 1 }
              }
              transition={{
                duration: 1.0,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span
              className={`text-[11px] font-medium capitalize ${
                allDone ? "text-emerald-600" : "text-blue-600"
              }`}
            >
              {allDone ? t("statusCompleted") : t("statusRunning")}
            </span>
            <span className="text-mist-300 text-[11px]">·</span>
            <span className="text-[11px] text-mist-700 truncate">
              <span className="font-semibold tabular-nums">47</span>{" "}
              {t("translationsLabel")}
            </span>
          </div>
          <span className="text-[11px] text-mist-400 font-mono tabular-nums shrink-0">
            0:{elapsed.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Languages row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {LANGUAGES.map((country) => (
            <FlagIcon key={country} countryCode={country} className="w-4 h-3" />
          ))}
          <span className="text-[10px] text-mist-400 ml-1">→ CDN</span>
        </div>

        {/* Activity log — 7 sequential steps */}
        <div className="bg-white rounded-xl border border-mist-200 shadow-sm px-4 py-3 overflow-hidden">
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              const status: "hidden" | "active" | "completed" =
                allDone || i < activeStep
                  ? "completed"
                  : i === activeStep
                    ? "active"
                    : "hidden";
              const isVisible = status !== "hidden";

              return (
                <motion.div
                  key={step.key}
                  animate={{
                    opacity: isVisible ? 1 : 0.3,
                    x: isVisible ? 0 : -4,
                  }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  className="flex items-stretch gap-3"
                >
                  <div className="flex flex-col items-center w-3 shrink-0">
                    <motion.span
                      aria-hidden
                      className={`size-1.5 rounded-full mt-2 shrink-0 transition-colors duration-300 ${
                        status === "completed"
                          ? "bg-emerald-500"
                          : status === "active"
                            ? "bg-blue-500"
                            : "bg-mist-300"
                      }`}
                      animate={
                        status === "active" && !reduced
                          ? { opacity: [1, 0.4, 1] }
                          : { opacity: 1 }
                      }
                      transition={{
                        duration: 1.0,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    {!isLast && (
                      <div className="w-px flex-1 bg-mist-200 mt-1 relative overflow-hidden">
                        <motion.div
                          aria-hidden
                          className="absolute inset-0 bg-emerald-400 origin-top"
                          initial={false}
                          animate={{
                            scaleY: status === "completed" ? 1 : 0,
                          }}
                          transition={{
                            duration: reduced ? 0 : 0.45,
                            ease: EASE_OUT,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center justify-between flex-1 min-w-0 ${
                      isLast ? "" : "pb-2.5"
                    }`}
                  >
                    <p
                      className={`text-[11px] leading-none truncate transition-colors duration-300 ${
                        status === "completed"
                          ? "text-mist-700"
                          : status === "active"
                            ? "text-mist-900 font-medium"
                            : "text-mist-400"
                      }`}
                    >
                      {t(step.key)}
                    </p>
                    <motion.span
                      animate={{
                        opacity: status === "completed" ? 1 : 0,
                      }}
                      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                      className="text-[10px] text-mist-400 tabular-nums shrink-0 ml-3"
                    >
                      {step.time}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Result strip — fades in after Completed: live on CDN payoff */}
        <motion.div
          aria-hidden={!allDone}
          initial={false}
          animate={{
            opacity: allDone ? 1 : 0,
            y: allDone ? 0 : 6,
          }}
          transition={{
            duration: DURATION.base,
            ease: EASE_OUT,
            delay: allDone ? 0.25 : 0,
          }}
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-mist-100/70 border border-mist-200/70"
        >
          <span aria-hidden className="text-mist-500 shrink-0">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="size-3.5"
            >
              <circle cx="8" cy="8" r="6.5" />
              <path d="M1.5 8h13M8 1.5c2 2.4 2 10.6 0 13M8 1.5c-2 2.4-2 10.6 0 13" />
            </svg>
          </span>
          <span className="text-[10px] font-mono text-mist-700 truncate">
            cdn.better-i18n.com/acme/dashboard
          </span>
          <span className="text-[10px] text-mist-500 ml-auto whitespace-nowrap font-medium tabular-nums">
            6 edges · 47ms
          </span>
        </motion.div>
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
