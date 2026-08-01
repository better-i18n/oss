import { useTranslations } from "@better-i18n/use-intl";
import type { Pillar } from "@/components/ui/page";

/**
 * Before / after process comparison — two lanes of steps on one scale.
 *
 * Rewritten from SVG to plain DOM, deliberately. In SVG every cell needs a fixed
 * coordinate and width, so a step whose copy runs one line longer than the author
 * guessed spills out of its box and past the frame — which is exactly what
 * shipped on /for-product-teams/: cells running off the right edge and struck-out
 * text that could not reflow. A DOM grid reflows, cannot exceed its container,
 * and needs no coordinate math at all.
 *
 * The constraints it has to satisfy:
 *  - **Compact.** Two lanes of 13px phrases. A step is a phrase, not a card
 *    (rule/listed-items-are-not-cards) — the old version drew a rounded box per
 *    step, which is what made the section three screens tall.
 *  - **In frame, always.** Each lane scrolls inside itself on narrow viewports
 *    instead of widening the page.
 *  - **No decorative colour.** Dropped steps are struck through in muted ink and
 *    counted once in the caption. The old version painted "no deploy" in orange,
 *    which is colour as decoration (rule/neutral-ink-accent-is-identity-only).
 *    `pillar` is kept in the API for callers, and used only for the lane marker.
 *  - **Motion is optional.** One CSS reveal on the Better lane, off under
 *    `prefers-reduced-motion`.
 *
 * The public prop shape is unchanged, so existing callers keep working.
 */

export interface ProcessStep {
  /** What happens in this step. Keep it to a few words: it renders at 13px. */
  readonly label: string;
  /** Time or effort for this step, e.g. "~2h", "3 days". Optional. */
  readonly meta?: string;
  /**
   * True when this step disappears with Better I18N. It still renders in the
   * manual lane — struck through, muted — because a removed step you cannot see
   * is a claim the reader has to take on faith.
   */
  readonly dropped?: boolean;
}

export interface ProcessCompareProps {
  /** Top lane: the manual process. */
  readonly manual: { readonly label: string; readonly steps: readonly ProcessStep[] };
  /** Bottom lane: the same job here. */
  readonly better: { readonly label: string; readonly steps: readonly ProcessStep[] };
  /** Caption for the dropped steps, e.g. "handled automatically". */
  readonly handledLabel: string;
  /** Pillar whose hue marks the Better lane. */
  readonly pillar?: Pillar;
  /** Accessible description of the whole figure. */
  readonly title: string;
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[3px] shrink-0 text-mist-300"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Lane({
  label,
  steps,
  isBetter,
  accent,
}: {
  label: string;
  steps: readonly ProcessStep[];
  isBetter: boolean;
  accent?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-[11px] font-medium text-mist-400">
        {isBetter && accent ? (
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: accent }}
          />
        ) : null}
        {label}
      </p>

      {/* Scrolls inside itself: a long lane must never widen the page. */}
      <div className="mt-3 overflow-x-auto">
        <ol className="flex min-w-max items-start gap-3">
          {steps.map((step, index) => (
            <li key={`${step.label}-${index}`} className="flex items-start gap-3">
              <span
                className={`block max-w-[22ch] ${isBetter ? "process-step-in" : ""}`}
                style={isBetter ? { animationDelay: `${index * 90}ms` } : undefined}
              >
                <span
                  className={`block text-[13px] leading-[1.45] ${
                    step.dropped
                      ? "text-mist-400 line-through decoration-mist-300"
                      : isBetter
                        ? "text-mist-900"
                        : "text-mist-600"
                  }`}
                >
                  {step.label}
                </span>
                {step.meta ? (
                  <span className="mt-1 block text-[11px] tabular-nums text-mist-400">
                    {step.meta}
                  </span>
                ) : null}
              </span>
              {index < steps.length - 1 ? <Chevron /> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ProcessCompare({
  manual,
  better,
  handledLabel,
  pillar = "sync",
  title,
}: ProcessCompareProps) {
  const tc = useTranslations("common");
  const dropped = manual.steps.filter((step) => step.dropped).length;
  // Read the hue lazily so this file does not import PILLAR_META's whole module
  // graph just for one dot.
  const accent =
    pillar === "ai" ? "#7e22ce" : pillar === "mcp" ? "#2563eb" : pillar === "content" ? "#c2410c" : "#16a34a";

  return (
    <figure className="mt-10" aria-label={title}>
      <style>{`
        .process-step-in { animation: process-step-in 380ms ease-out both; }
        @keyframes process-step-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .process-step-in { animation: none; }
        }
      `}</style>

      <div className="flex flex-col gap-7">
        <Lane label={manual.label} steps={manual.steps} isBetter={false} />
        {/* One hairline between the lanes — the comparison is the point, so it
            gets a single rule, not a box around each lane. */}
        <div className="border-t border-black/[0.07]" />
        <Lane label={better.label} steps={better.steps} isBetter accent={accent} />
      </div>

      {dropped > 0 ? (
        /* The count sentence is a key, not English assembled in JSX: "steps
           become" would not survive translation into 22 locales, and it was the
           one string in this component the CDN did not own. `handledLabel` still
           comes from the caller, so each persona keeps its own wording for what
           we take over. */
        <figcaption className="mt-6 text-[13px] leading-relaxed text-mist-600">
          {tc("processCompare.summary", {
            total: manual.steps.length,
            /* The Better lane's own length, not `manual - dropped`: the two are
               not the same number (a lane can merge two manual steps into one),
               and the caption was claiming "7 steps become 2" under a lane that
               visibly had 4. */
            remaining: better.steps.length,
          })}
          {" · "}
          {dropped} {handledLabel}
        </figcaption>
      ) : null}
    </figure>
  );
}
