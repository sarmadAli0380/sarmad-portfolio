"use client";

import { motion } from "motion/react";
import Section from "@/components/ui/Section";
import { identity } from "@/lib/content";
import { ease } from "@/lib/theme";
import { useStore } from "@/lib/store";

/**
 * The hero leads with what he builds, not with a greeting. The name is
 * metadata at the foot of the frame — the work is the headline.
 */
export default function Hero() {
  const entered = useStore((s) => s.entered);

  // Opacity is paired with the mask for the same reason as in Reveal — under
  // reduced motion the transform is skipped and only opacity brings it in.
  const line = {
    hidden: { y: "108%", opacity: 0 },
    show: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        duration: 1.15,
        delay: 0.25 + i * 0.09,
        ease: ease.out,
        opacity: { duration: 0.4, delay: 0.25 + i * 0.09 },
      },
    }),
  };

  const lines = ["Agent systems,", "MCP tooling,", "LLM infrastructure."];

  return (
    <Section
      id="hero"
      formation="latent"
      className="relative flex min-h-svh flex-col justify-between bleed pb-10 pt-32"
    >
      <motion.p
        className="label max-w-xs"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 1.1 }}
      >
        Portfolio — {new Date().getFullYear()}
      </motion.p>

      <h1 className="display text-h1 my-auto max-w-[16ch]">
        {lines.map((l, i) => (
          <span key={l} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              variants={line}
              custom={i}
              initial="hidden"
              animate={entered ? "show" : "hidden"}
            >
              {/* The last clause is the one he's betting on — italic marks it. */}
              {i === 2 ? <em className="italic text-accent">{l}</em> : l}
            </motion.span>
          </span>
        ))}
      </h1>

      <motion.div
        className="flex flex-wrap items-end justify-between gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={entered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.2, ease: ease.out }}
      >
        <div>
          <p className="label mb-2">Built by</p>
          <p className="text-lead">
            {identity.name}
            <span className="text-bone-dim">
              {" "}
              — {identity.role}, {identity.location}
            </span>
          </p>
        </div>

        <a
          href="#thesis"
          className="label group flex items-center gap-3 text-bone"
          data-cursor="Scroll"
        >
          Enter
          <span className="relative block h-8 w-px overflow-hidden bg-bone-faint">
            <span className="absolute inset-x-0 top-0 h-3 animate-[drop_2.4s_var(--ease-in-out-expo)_infinite] bg-accent" />
          </span>
        </a>
      </motion.div>

      <style>{`
        @keyframes drop {
          0%   { transform: translateY(-100%); }
          55%  { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </Section>
  );
}
