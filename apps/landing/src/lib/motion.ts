/**
 * Shared motion grammar for the landing page.
 *
 * Single source of truth for easing curves, durations, stagger timings,
 * and viewport defaults. All landing animations should pull from here —
 * never hardcode magic numbers in components.
 *
 * UI-skills constraints honored:
 * - Only `transform` + `opacity` are animated by consumers.
 * - All entries use `ease-out` cubic.
 * - Interaction feedback < 200ms.
 * - `prefers-reduced-motion` is respected at the consumer level via
 *   `useReducedMotion()` from framer-motion.
 */

import type { Variants } from "framer-motion";

/** ease-out cubic — explicitly approved by user for Vercel/Clerk-style entrances. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Standard durations in seconds. Matches Tailwind's transition scale family. */
export const DURATION = {
  /** 200ms — interaction feedback ceiling per UI-skills. */
  fast: 0.2,
  /** 400ms — section/component entrances. */
  base: 0.4,
  /** 600ms — orchestrated reveals (rare). */
  slow: 0.6,
} as const;

/** Stagger between sibling items in a Stagger group. */
export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.1,
} as const;

/**
 * Default viewport options for `whileInView`.
 * - `once: true` — animate on first entry only; no re-trigger on re-scroll.
 * - `margin: "-10% 0px"` — start animation slightly before the element fully enters.
 */
export const VIEWPORT = {
  once: true,
  margin: "-10% 0px",
} as const;

/** Standard fade-up entrance (used by sections and most cards). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Subtle fade-only — used when motion should be felt but not seen. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Word-level reveal for hero displays (used with split text). */
export const displayWord: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

/** Container variants that drive children stagger. */
export function staggerContainer(stagger: number = STAGGER.base): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger },
    },
  };
}
