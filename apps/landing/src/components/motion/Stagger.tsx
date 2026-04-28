/**
 * Stagger — orchestrates sibling-by-sibling fade-up of its children.
 *
 * Usage:
 *   <Stagger>
 *     <StaggerItem>...</StaggerItem>
 *     <StaggerItem>...</StaggerItem>
 *   </Stagger>
 *
 * Each direct StaggerItem child enters with a `stagger`-second delay
 * after its predecessor. Container is a single fade — children carry
 * the per-item motion.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, STAGGER, VIEWPORT, staggerContainer } from "@/lib/motion";

type StaggerProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport" | "variants"
> & {
  children: ReactNode;
  /** Seconds between each child's animation start. Default: 0.06s. */
  stagger?: number;
};

export function Stagger({
  children,
  stagger = STAGGER.base,
  ...rest
}: StaggerProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = !reduced;

  return (
    <motion.div
      initial={shouldAnimate ? "hidden" : "visible"}
      whileInView={shouldAnimate ? "visible" : undefined}
      viewport={shouldAnimate ? VIEWPORT : undefined}
      variants={shouldAnimate ? staggerContainer(stagger) : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = Omit<
  HTMLMotionProps<"div">,
  "variants"
> & {
  children: ReactNode;
};

export function StaggerItem({ children, ...rest }: StaggerItemProps) {
  return (
    <motion.div variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}
