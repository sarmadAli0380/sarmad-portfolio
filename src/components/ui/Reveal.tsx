"use client";

import { motion, type Variants } from "motion/react";
import { createElement, type ElementType } from "react";
import { ease } from "@/lib/theme";

/**
 * Reveal primitives.
 *
 * Everything on the page enters through one of these two, which is the point:
 * a shared entrance vocabulary is what makes a site feel authored rather than
 * assembled. Masked word-rise for type, plain rise for everything else.
 */

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.028) => ({
    transition: { staggerChildren: stagger },
  }),
};

/*
 * The mask does the visual work, but the opacity pair is load-bearing: under
 * `reducedMotion`, Motion skips transform animations, so a y-only variant would
 * leave every word parked outside its clipping box and invisible. Opacity still
 * animates, so the text always arrives. It's fast enough not to soften the mask.
 */
const word: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, ease: ease.out, opacity: { duration: 0.3 } },
  },
};

type TextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /** seconds between words */
  stagger?: number;
  delay?: number;
};

/** Word-level mask reveal. Each word rises out of a clipped box. */
export function TextReveal({
  children,
  as = "p",
  className,
  stagger = 0.028,
  delay = 0,
}: TextProps) {
  const words = children.split(" ");

  return createElement(
    as,
    { className },
    <motion.span
      className="inline"
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ delayChildren: delay }}
      // The text is already in the DOM for assistive tech and search; the
      // animation is purely visual, so the split spans are hidden from a11y.
      aria-label={children}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
          // Descenders get clipped by overflow:hidden without a little room.
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <motion.span className="inline-block" variants={word}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>,
  );
}

type RiseProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** px */
  distance?: number;
};

/** Generic entrance for non-text blocks. */
export function Rise({
  children,
  className,
  delay = 0,
  distance = 24,
}: RiseProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
