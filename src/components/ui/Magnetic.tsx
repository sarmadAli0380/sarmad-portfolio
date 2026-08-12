"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Pulls its child toward the cursor when the cursor gets close, and lets it
 * spring back on exit.
 *
 * The element starts reacting before you reach it, which is the whole point:
 * it makes the target feel like it wants to be clicked rather than sitting
 * inert until a hover state fires.
 */
export default function Magnetic({
  children,
  /** how far out the pull starts, in px beyond the element's own box */
  radius = 90,
  /** 0 → 1; how far the element travels toward the cursor */
  strength = 0.32,
  className,
}: {
  children: React.ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const pos = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let running = false;

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      el.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;

      // Stop the loop once it has settled, so idle elements cost nothing.
      const settled =
        Math.abs(target.x - pos.x) < 0.05 && Math.abs(target.y - pos.y) < 0.05;
      if (settled && target.x === 0 && target.y === 0) {
        el.style.transform = "";
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Distance to the element's edge, not its centre — otherwise wide
      // elements like a long email address barely register.
      const outsideX = Math.max(0, Math.abs(dx) - r.width / 2);
      const outsideY = Math.max(0, Math.abs(dy) - r.height / 2);
      const dist = Math.hypot(outsideX, outsideY);

      if (dist > radius) {
        target.x = 0;
        target.y = 0;
      } else {
        const falloff = 1 - dist / radius;
        target.x = dx * strength * falloff;
        target.y = dy * strength * falloff;
      }
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [radius, strength, reducedMotion]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
