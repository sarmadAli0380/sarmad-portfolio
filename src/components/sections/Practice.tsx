"use client";

import Section from "@/components/ui/Section";
import { Rise, TextReveal } from "@/components/ui/Reveal";
import { certifications, education, skills } from "@/lib/content";

export default function Practice() {
  return (
    <Section
      id="practice"
      formation="lattice"
      intensity={0.35}
      className="bleed py-[16vh] md:py-[22vh]"
    >
      <Rise>
        <p className="label mb-10">Practice</p>
      </Rise>

      <TextReveal as="h2" className="display text-h1 max-w-[14ch] mb-20">
        Things I work with.
      </TextReveal>

      <div className="grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((group, gi) => (
          <Rise key={group.group} delay={gi * 0.08}>
            <div className="h-full bg-ink p-6">
              <p className="label mb-6 text-accent">{group.group}</p>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="text-bone-dim">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
        ))}
      </div>

      <div className="rule my-16" />

      <div className="grid gap-10 md:grid-cols-12">
        <Rise className="md:col-span-4">
          <p className="label mb-6 text-accent">Certifications</p>
          <p className="label mb-4 text-bone-faint">{certifications.issuer}</p>
          <ul className="space-y-2.5">
            {certifications.items.map((c) => (
              <li key={c} className="text-bone-dim">
                {c}
              </li>
            ))}
          </ul>
        </Rise>

        <Rise className="md:col-span-7 md:col-start-6" delay={0.08}>
          <p className="label mb-6 text-accent">Education</p>
          <p className="text-h4">
            {education.degree}
            <br />
            <span className="text-bone-dim">{education.org}</span>
          </p>
          <p className="label mt-4 text-bone-faint">
            {education.location}
            {education.year ? ` — ${education.year}` : ""}
          </p>
        </Rise>
      </div>
    </Section>
  );
}
