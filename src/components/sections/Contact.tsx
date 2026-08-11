"use client";

import Section from "@/components/ui/Section";
import { Rise, TextReveal } from "@/components/ui/Reveal";
import { identity } from "@/lib/content";

const links = [
  { label: "Email", value: identity.email, href: `mailto:${identity.email}` },
  { label: "LinkedIn", value: "sarmad-ali", href: identity.linkedin },
  ...(identity.github
    ? [{ label: "GitHub", value: "github", href: identity.github }]
    : []),
];

export default function Contact() {
  return (
    <Section
      id="contact"
      formation="disperse"
      className="bleed flex min-h-svh flex-col justify-between py-[14vh]"
    >
      <div>
        <Rise>
          <p className="label mb-10">Contact</p>
        </Rise>

        <TextReveal as="h2" className="display text-h2 max-w-[13ch]">
          Building something that thinks?
        </TextReveal>

        <Rise delay={0.15}>
          <a
            href={`mailto:${identity.email}`}
            className="group mt-14 inline-block"
            data-cursor="Write"
          >
            <span className="display text-h3 border-b border-bone-faint pb-2 transition-colors duration-500 group-hover:border-accent group-hover:text-accent">
              {identity.email}
            </span>
          </a>
        </Rise>
      </div>

      {/*
        The field is at full strength here and densest along the right, exactly
        where the colophon sits. A gradient scrim rising from the page floor
        gives the footer ground without drawing a box around it.
      */}
      <div className="relative mt-24">
        <div className="pointer-events-none absolute inset-x-[calc(var(--gutter)*-1)] -bottom-[14vh] -top-8 bg-gradient-to-t from-ink via-ink/85 to-transparent" />
        <div className="relative">
          <div className="rule mb-8" />
          <div className="flex flex-wrap items-end justify-between gap-8">
            <ul className="flex flex-wrap gap-x-10 gap-y-4">
              {links.map((l) => (
                <li key={l.label}>
                  <p className="label text-[0.625rem] mb-1">{l.label}</p>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className="text-bone-dim transition-colors hover:text-accent"
                  >
                    {l.value}
                  </a>
                </li>
              ))}
            </ul>

            {/* Colophon. Saying what it's made of is part of the craft signal. */}
            <p className="label max-w-[24ch] text-right">
              Next.js, WebGL, GSAP.
              <br />
              Instrument Serif & Geist Mono.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
