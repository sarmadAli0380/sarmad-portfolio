"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { FormationId } from "@/lib/content";
import { setState } from "@/lib/store";

/**
 * A section that owns the field while it owns the viewport.
 *
 * This is the whole coupling between scroll and WebGL: crossing the midpoint of
 * a section hands the particle formation over to it. One trigger per section,
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
      // Hand over when the section reaches the middle of the viewport, in both
      // directions — so scrolling back up restores the previous formation.
      start: "top 55%",
      end: "bottom 45%",
      onEnter: claim,
      onEnterBack: claim,
    });

    return () => trigger.kill();
  }, [id, formation, intensity]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
