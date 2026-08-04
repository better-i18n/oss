import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A price that counts from its previous value to its next one.
 *
 * Lives in its own module rather than inside `Pricing` because the thing being
 * animated is a NUMBER, not the pricing section: the plan grid, the comparison
 * table and any future seat calculator all show the same figure and should
 * travel the same way. Passing `format` in keeps the currency rule
 * (`formatPrice` in `Pricing.tsx`) as the single source — this component never
 * decides how money is written (rule 3).
 *
 * Reduced motion is taken from `useReducedMotion()`, the same framer-motion
 * hook `features/use-demo-loop.ts:32` already uses. The media query is not
 * re-implemented here, and under `reduce` no frame loop starts at all — the
 * value is assigned once, exactly as `use-demo-loop` jumps straight to its
 * final beat instead of stepping through them.
 */

/**
 * 320ms, ease-out cubic.
 *
 * The figure has to stay READABLE: a price is a decision input, and a long
 * count delays the decision it exists to support. 320ms is long enough to read
 * as movement between two numbers and short enough that the eye lands on the
 * new value before it looks for it. Ease-out puts almost all of the distance in
 * the first half, so the final digits settle rather than crawl.
 */
const DURATION_MS = 320;

/** `1 - (1-t)³` — fast start, soft landing. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function useCountUp(target: number): number {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(target);
  /** Where the next run starts — the value currently on screen, never 0. */
  const fromRef = useRef(target);
  /** First commit must not animate: a price counting up on page load reads as
   *  a marketing trick, not a product. */
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fromRef.current = target;
      setShown(target);
      return;
    }

    if (reduced) {
      fromRef.current = target;
      setShown(target);
      return;
    }

    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    let frame = 0;

    /**
     * `fromRef` advances on EVERY frame, not only at the end.
     *
     * The first version wrote it in the effect cleanup instead, and measured on
     * `/en/` the digit finished on the old price ($20) while the accessible
     * value was already correct ($16): React runs the cleanup on the dev
     * double-invoke too, so the ref was rewound to a stale reading and the next
     * run started from the wrong place. Advancing it inside the frame means an
     * interrupted count always resumes from what the reader can actually see,
     * with no cleanup writes at all.
     */
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const next = Math.round(from + (target - from) * easeOut(progress));
      fromRef.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced]);

  return shown;
}

export function AnimatedPrice({
  value,
  format,
  minCh,
  className,
}: {
  /** The final amount. Counting runs from whatever is on screen to this. */
  value: number;
  /** Currency formatting, owned by the caller. */
  format: (amount: number) => string;
  /**
   * Reserved width in `ch`, decided by the caller from THIS plan's own two
   * prices and passed in — not measured from the digits currently on screen. A
   * cell that sized itself would be 2ch wide on "$9" and 3ch on "$49", so
   * toggling billing would shove the "/mo" sideways mid-count.
   *
   * The caller computes this per plan, not once for the row. Reserving the
   * row's widest string padded every cheap tier to the most expensive one's
   * width — Free's "$0" sat in Pro's box with 33px of dead air before its
   * "/mo". Prices live in separate grid columns, so one plan's box width cannot
   * displace another's content; only its own suffix.
   */
  minCh: number;
  className?: string;
}) {
  const shown = useCountUp(value);

  return (
    <span className={className} style={{ minWidth: `${minCh}ch`, display: "inline-block" }}>
      {/* The counting digits are decorative while they move: a screen reader
          that announced every frame would read a dozen wrong prices. The real
          figure is given once, in a node that only changes when `value` does. */}
      <span aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
