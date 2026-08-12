"use client";

import { motion } from "motion/react";
import Section from "@/components/ui/Section";
import { Rise, TextReveal } from "@/components/ui/Reveal";
import { projects, type Project } from "@/lib/content";
import { ease } from "@/lib/theme";

/**
 * A project case study.
 *
 * The particle field behind this section is already holding this project's
 * shape — so the page doesn't repeat it as a diagram. The architecture strip
 * below annotates that shape in words instead of drawing a second copy of it.
 */
export default function ProjectCase({ project }: { project: Project }) {
  return (
    <Section
      id={project.id}
      formation={project.formation}
      // These sections are all body copy. The field holds the project's shape
      // but recedes far enough that it never competes with the reading.
      intensity={0.3}
      className="bleed py-[16vh] md:py-[22vh]"
    >
      <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-8">
        {/* Sticky identity column — the title stays with you through the read. */}
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Rise>
              <p className="numeral text-caption text-accent mb-6">
                {project.index} / {String(projects.length).padStart(2, "0")}
              </p>
              <h2 className="display text-h2">{project.title}</h2>
              <p className="label mt-3">{project.subtitle}</p>
              <p className="label mt-6 text-bone-faint">{project.year}</p>
            </Rise>

            <Rise delay={0.1}>
              <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-1.5">
                {project.stack.map((s) => (
                  <li
                    key={s}
                    className="label text-caption tracking-[0.1em] border border-bone/12 px-2 py-1 text-bone-dim"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <TextReveal
            as="p"
            className="display text-h3 mb-12 md:mb-16"
            stagger={0.022}
          >
            {project.thesis}
          </TextReveal>

          <div className="measure space-y-6">
            {project.body.map((p, i) => (
              <Rise key={i} delay={i * 0.05}>
                <p className="text-bone-dim">{p}</p>
              </Rise>
            ))}
          </div>

          {/* Metrics. Mono, tabular, and only real numbers. */}
          <div className="mt-16 grid grid-cols-2 gap-px bg-bone/10 sm:grid-cols-3">
            {project.metrics.map((m, i) => (
              <Rise key={m.label} delay={i * 0.08} distance={16} className="h-full">
                <div className="flex h-full flex-col justify-between gap-6 bg-ink p-5">
                  {/* Values vary from "3" to "fire & poll", so the type has to
                      shrink for the long ones instead of wrapping into a wall. */}
                  <p
                    className={`numeral text-bone ${
                      m.value.length > 6 ? "text-body-large" : "text-h3"
                    }`}
                  >
                    {m.value}
                  </p>
                  <p className="label text-caption">{m.label}</p>
                </div>
              </Rise>
            ))}
          </div>

          {/* Architecture strip — the field's shape, annotated. */}
          <div className="mt-16">
            <p className="label mb-6">Architecture</p>
            <ol className="flex flex-col gap-0 md:flex-row md:gap-0">
              {project.architecture.map((node, i) => (
                <li key={node.label} className="relative flex-1 md:pr-4">
                  <motion.span
                    className="absolute left-0 top-0 hidden h-px bg-accent/60 md:block"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + i * 0.12,
                      ease: ease.out,
                    }}
                  />
                  <motion.span
                    className="absolute left-0 top-0 h-full w-px bg-accent/60 md:hidden"
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + i * 0.12,
                      ease: ease.out,
                    }}
                  />
                  <Rise delay={0.25 + i * 0.12} distance={12}>
                    <div className="py-4 pl-4 md:pl-0 md:pt-5">
                      <p className="numeral text-caption text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1.5 text-bone">{node.label}</p>
                      <p className="label mt-1 text-caption text-bone-faint">
                        {node.note}
                      </p>
                    </div>
                  </Rise>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}
