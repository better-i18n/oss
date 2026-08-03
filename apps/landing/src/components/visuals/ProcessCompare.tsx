import { useTranslations } from "@better-i18n/use-intl";
import { StepNumber } from "@/components/ui/step-number";
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

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Left: the manual process as hairline rows — no boxes, the same list
            shape the /content/ page uses for its argument column. */}
        <div>
          <p className="text-[11px] font-medium text-mist-400">{manual.label}</p>
          <ol className="mt-4 flex flex-col">
            {manual.steps.map((step, index) => (
              <li
                key={step.label}
                className="flex items-baseline gap-3 border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0"
              >
                <StepNumber n={index + 1} />
                <span className="min-w-0">
                  <span
                    className={`block text-[13px] leading-[1.5] ${
                      step.dropped
                        ? "text-mist-400 line-through decoration-mist-300"
                        : "text-mist-700"
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.meta ? (
                    <span className="mt-0.5 block text-[11px] tabular-nums text-mist-400">
                      {step.meta}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right: ours, in a framed panel — one container, hairline cells. */}
        <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
          <div className="flex items-center gap-2 border-b border-black/[0.05] px-4 py-2.5">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
            <span className="text-[11px] font-medium text-mist-600">{better.label}</span>
          </div>
          <ol className="flex flex-col">
            {better.steps.map((step, index) => (
              <li
                key={step.label}
                className="process-step-in flex items-baseline gap-3 border-t border-black/[0.05] px-4 py-3 first:border-t-0"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <StepNumber n={index + 1} />
                <span className="min-w-0">
                  <span className="block text-[13px] leading-[1.5] text-mist-900">
                    {step.label}
                  </span>
                  {step.meta ? (
                    <span className="mt-0.5 block text-[11px] tabular-nums text-mist-400">
                      {step.meta}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
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
