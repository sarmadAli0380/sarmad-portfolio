"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FormationId } from "@/lib/content";
import { setState } from "@/lib/store";

/**
 * A section that owns the field while it owns the viewport.
 *
 * This is the whole coupling between scroll and WebGL: the section containing
 * the viewport midpoint owns the particle formation. One trigger per section,
 * no scroll listeners of our own.
 */
export default function Section({
  id,
  formation,
  intensity = 1,
  className = "",
  children,
}: {
  id: string;
  formation: FormationId;
  /** 0 → 1. Drop it for sections carrying a lot of body copy. */
  intensity?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const claim = () => setState({ formation, activeSection: id, intensity });

    const trigger = ScrollTrigger.create({
      trigger: el,
      // Adjacent sections meet at the same viewport line. The old 55%/45%
      // range overlapped ownership, allowing callback order to select a stale
      // formation after refreshes or a fast reverse scroll.
      start: "top center",
      end: "bottom center",
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (self.isActive) claim();
      },
      // Font loading and the opening curtain both trigger a refresh. Reassert
      // the actual owner afterward instead of retaining whichever trigger ran
      // most recently during measurement.
      onRefresh: (self) => {
        if (self.isActive) claim();
      },
    });

    return () => trigger.kill();
  }, [id, formation, intensity]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
