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
      // Trailing lerp — the lag is what makes it feel like an object with mass
      // rather than a second cursor glued to the first.
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
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
      <div
        className="rounded-full border transition-all duration-300 ease-[var(--ease-out-expo)]"
        style={{
          width: label ? 72 : active ? 34 : 10,
          height: label ? 72 : active ? 34 : 10,
          borderColor: active ? "var(--color-accent)" : "var(--color-bone-dim)",
          backgroundColor: label
            ? "color-mix(in oklab, var(--color-accent) 14%, transparent)"
            : "transparent",
        }}
      />
      {label && (
        <span className="label absolute text-bone text-[0.625rem] whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
