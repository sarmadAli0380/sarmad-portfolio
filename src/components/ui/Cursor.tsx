"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A cursor that carries context rather than replacing the pointer for style.
 * It only appears for mouse users, it never hides the native cursor on
 * interactive elements, and elements opt in by declaring `data-cursor="…"`.
 */
export default function Cursor() {
  const reducedMotion = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches && !reducedMotion);
    const onChange = (e: MediaQueryListEvent) =>
      setEnabled(e.matches && !reducedMotion);
    fine.addEventListener("change", onChange);
    return () => fine.removeEventListener("change", onChange);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(el ? el.getAttribute("data-cursor") : null);
      setActive(
        !!(e.target as HTMLElement)?.closest?.("a, button, [data-cursor]"),
      );
    };

    const loop = () => {
      // Enough lag to read as an object with mass, not so much that it feels
      // like the page is behind you.
      pos.x += (target.x - pos.x) * 0.3;
      pos.y += (target.y - pos.y) * 0.3;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 flex items-center justify-center"
    >
      {/*
        Fixed 72px box scaled with a transform. Animating width/height instead
        forces layout on every frame of every hover, which is what made this
        feel sluggish.
      */}
      <div
        className="h-18 w-18 rounded-full border transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)]"
        style={{
          transform: `scale(${label ? 1 : active ? 0.47 : 0.14})`,
          borderColor: active ? "var(--color-accent)" : "var(--color-bone-dim)",
          backgroundColor: label
            ? "color-mix(in oklab, var(--color-accent) 14%, transparent)"
            : "transparent",
        }}
      />
      {label && (
        <span className="label absolute text-bone text-caption whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
