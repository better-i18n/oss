/**
 * useDemoLoop — drives a multi-beat looping animation for feature cards.
 *
 * Runs ONLY while the target ref is in the viewport. When the user scrolls
 * away the loop pauses, when they come back it resumes from beat 0. When
 * `prefers-reduced-motion: reduce` is set, the hook freezes the demo at
 * its final beat so the user sees the end state without any motion.
 *
 * This replaces the recursive setTimeout(runDemo) pattern in the legacy
 * Features.tsx — that pattern ran forever and burned CPU/battery while
 * off-screen.
 */

import { useEffect, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export type Beat = {
  /** Milliseconds to hold this beat before advancing. */
  durationMs: number;
};

type Options = {
  /** Ordered list of beats. The last beat's duration acts as the loop pause. */
  beats: ReadonlyArray<Beat>;
  /** Element to observe. Loop runs while this element is in view. */
  ref: RefObject<Element | null>;
};

export function useDemoLoop({ beats, ref }: Options) {
  // Start the loop a little before the element fully enters the viewport.
  const inView = useInView(ref, { margin: "-20% 0px 0px 0px" });
  const reduced = useReducedMotion();
  const [beatIndex, setBeatIndex] = useState(0);

  useEffect(() => {
    if (reduced) {
      setBeatIndex(beats.length - 1);
      return;
    }

    if (!inView) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const advance = (next: number) => {
      if (cancelled) return;
      setBeatIndex(next);
      timer = setTimeout(
        () => advance((next + 1) % beats.length),
        beats[next].durationMs,
      );
    };

    advance(0);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [inView, reduced, beats]);

  return { beatIndex, inView, reduced };
}
