/**
 * MotionSection — semantic <section> wrapper that animates on viewport entry.
 *
 * Wraps children in a single fade-up that runs once when the section
 * enters the viewport. For internal stagger, compose with <Stagger>
 * inside this component.
 *
 * Honors `prefers-reduced-motion` via framer-motion's `useReducedMotion`:
 * when the user prefers reduced motion, children render at the visible
 * state immediately with no animation.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, VIEWPORT } from "@/lib/motion";

type MotionSectionProps = Omit<
  HTMLMotionProps<"section">,
  "initial" | "whileInView" | "viewport" | "variants"
> & {
  children: ReactNode;
  /** When true, skips entry animation entirely (useful for above-the-fold). */
  immediate?: boolean;
};

export function MotionSection({
  children,
  immediate = false,
  ...rest
}: MotionSectionProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = !reduced && !immediate;

  return (
    <motion.section
      initial={shouldAnimate ? "hidden" : "visible"}
      whileInView={shouldAnimate ? "visible" : undefined}
      viewport={shouldAnimate ? VIEWPORT : undefined}
      variants={shouldAnimate ? fadeUp : undefined}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
