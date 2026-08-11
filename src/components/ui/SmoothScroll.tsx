"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setState, useStore } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Lenis + ScrollTrigger, wired to a single RAF loop.
 *
 * Running Lenis on its own RAF while ScrollTrigger runs on another is the usual
 * source of jitter in smooth-scroll sites — the two disagree about scroll
 * position within a frame. Driving Lenis from GSAP's ticker keeps them in lockstep.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const entered = useStore((s) => s.entered);

  /*
   * A one-page site with a loader has to start at the top. The browser restores
   * the previous scroll offset on reload, which lands you mid-case-study behind
   * a full-screen curtain — and hands the field to whichever section you happen
   * to land in.
   */
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  /*
   * Every trigger position was measured against a layout that hadn't finished
   * happening: the loader pins scroll, and the display serif swaps in late and
   * reflows every heading. Re-measure once both have settled, or sections hand
   * the field over at visibly wrong moments.
   */
  useEffect(() => {
    if (!entered) return;
    let cancelled = false;
    const refresh = () => !cancelled && ScrollTrigger.refresh();

    // Next's router manages scrollRestoration itself, so setting it to manual
    // on mount doesn't reliably stick. Re-asserting the top here — the moment
    // the curtain lifts — is what actually holds.
    if (!window.location.hash) window.scrollTo(0, 0);

    const id = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [entered]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Smooth scrolling is itself motion. If it's not wanted, use the native
    // scroller and only keep the progress reporting.
    if (reducedMotion) {
      const onScroll = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        setState({ scroll: max > 0 ? window.scrollY / max : 0 });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.4,
      // Trackpads already feel smooth; heavy smoothing on touch feels broken.
      syncTouch: false,
    });

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setState({ scroll: progress });
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links have to go through Lenis or they jump.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  /*
   * The CSS reduced-motion block can't reach Motion's animations — those run in
   * JS, not as CSS transitions. `reducedMotion="user"` is what actually stops
   * the reveals from moving, leaving opacity fades that hurt nobody.
   */
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
