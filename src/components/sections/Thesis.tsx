"use client";

import Section from "@/components/ui/Section";
import { Rise, TextReveal } from "@/components/ui/Reveal";
import { experience, identity } from "@/lib/content";

export default function Thesis() {
  return (
    <Section
      id="thesis"
      formation="latent"
      intensity={0.55}
      className="bleed py-[18vh] md:py-[24vh]"
    >
      <Rise>
        <p className="label mb-10">01 — Thesis</p>
      </Rise>

      <TextReveal
        as="h2"
        className="display text-h2 max-w-[18ch]"
        stagger={0.035}
      >
        {identity.statement}
      </TextReveal>

      <div className="rule my-16 md:my-24" />

      <Rise>
        <p className="label mb-12">Experience</p>
      </Rise>

      {experience.map((role, ri) => (
        <div key={`${role.org}-${role.role}`}>
          {/* Rule between entries only — the section already has one above. */}
          {ri > 0 && <div className="rule my-12 md:my-16" />}

          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <Rise className="md:col-span-4">
              <p className="text-lead leading-snug">
                {role.role}
                <br />
                <span className="text-bone-dim">{role.org}</span>
              </p>
              <p className="label mt-4 text-bone-faint">{role.period}</p>
              <p className="label text-bone-faint">{role.location}</p>
            </Rise>

            <div className="md:col-span-7 md:col-start-6">
              <ul className="space-y-6">
                {role.points.map((p, i) => (
                  <Rise key={p} delay={i * 0.06}>
                    <li className="flex gap-5">
                      <span className="numeral mt-1.5 shrink-0 text-micro text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-bone-dim measure">{p}</span>
                    </li>
                  </Rise>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </Section>
  );
}
