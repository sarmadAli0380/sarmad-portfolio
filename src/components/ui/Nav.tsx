"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { identity, sections } from "@/lib/content";
import { useStore } from "@/lib/store";
import { ease } from "@/lib/theme";

/**
 * Header plus a vertical section index. The index doubles as a progress
 * indicator — you always know how much site is left, which is the one thing a
 * long scrolling page owes the reader.
 */
export default function Nav() {
  const active = useStore((s) => s.activeSection);
  const entered = useStore((s) => s.entered);
  const scroll = useStore((s) => s.scroll);

  /*
   * The header retracts while you're reading forward and comes back the moment
   * you scroll up. Blend-mode alone kept it legible over body copy, but legible
   * clutter is still clutter.
   */
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const delta = scroll - lastScroll.current;
    // Ignore sub-pixel jitter, and never hide it at the very top.
    if (Math.abs(delta) > 0.002) {
      setHidden(delta > 0 && scroll > 0.03);
      lastScroll.current = scroll;
    }
  }, [scroll]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bleed py-6 mix-blend-difference"
        initial={{ opacity: 0, y: -12 }}
        animate={
          entered
            ? { opacity: hidden ? 0 : 1, y: hidden ? -24 : 0 }
            : { opacity: 0, y: -12 }
        }
        transition={{ duration: 0.55, delay: hidden ? 0 : 0.05, ease: ease.out }}
      >
        <a href="#hero" className="label text-bone hover:text-accent transition-colors">
          {identity.name}
        </a>
        <a
          href={`mailto:${identity.email}`}
          className="label text-bone hover:text-accent transition-colors"
          data-cursor="Email"
        >
          Available for work
        </a>
      </motion.header>

      <motion.nav
        aria-label="Sections"
        className="fixed right-[max(1rem,calc(var(--gutter)*0.4))] top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <ul className="flex flex-col items-end gap-3">
          {sections.map((s) => {
            const isActive = s.id === active;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-center gap-3"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span
                    className="label text-[0.625rem] transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: `translateX(${isActive ? 0 : 8}px)`,
                      color: "var(--color-bone)",
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="block h-px transition-all duration-500 ease-[var(--ease-out-expo)]"
                    style={{
                      width: isActive ? 32 : 14,
                      background: isActive
                        ? "var(--color-accent)"
                        : "var(--color-bone-faint)",
                    }}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
