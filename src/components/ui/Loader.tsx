"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { setState } from "@/lib/store";
import { identity } from "@/lib/content";
import { ease } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Entry sequence.
 *
 * Deliberately short. A loader earns its place by covering work that is
 * genuinely happening — fonts resolving, the field compiling its shader — and
 * by handing over before anyone gets impatient. It waits on real readiness with
 * a hard ceiling, rather than performing a fake progress bar.
 */
const MIN_MS = 900;
const MAX_MS = 2600;

export default function Loader() {
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setDone(true);
      setState({ entered: true });
      return;
    }

    const started = performance.now();
    let raf = 0;
    let settled = false;

    const ready = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, MAX_MS)),
    ]);
    ready.then(() => {
      settled = true;
    });

    const loop = () => {
      const elapsed = performance.now() - started;
      // Progress tracks real elapsed time against the minimum, then snaps to
      // 100 once the page is genuinely ready.
      const floor = Math.min(96, (elapsed / MIN_MS) * 96);
      const value = settled && elapsed >= MIN_MS ? 100 : floor;
      setPct(value);

      if (value >= 100) {
        setDone(true);
        // The field starts revealing while the curtain is still lifting, so the
        // two motions overlap instead of queueing.
        setState({ entered: true });
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // Lock scroll while the curtain is up.
  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink flex flex-col justify-between p-[var(--gutter)] pb-10"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 1, ease: ease.inOut },
          }}
        >
          <motion.div
            className="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            {identity.name}
          </motion.div>

          <motion.div
            className="flex items-end justify-between gap-8"
            exit={{ y: -20, opacity: 0, transition: { duration: 0.5 } }}
          >
            <span className="numeral text-display text-bone">
              {String(Math.floor(pct)).padStart(3, "0")}
            </span>
            <span className="label mb-2 hidden sm:block">
              {identity.role} — {identity.location}
            </span>
          </motion.div>

          {/* Progress as a rule that draws itself, not a filling pill. */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-bone/10">
            <div
              className="h-full bg-accent origin-left"
              style={{
                transform: `scaleX(${pct / 100})`,
                transition: "transform 120ms linear",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
