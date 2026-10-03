# Portfolio — Sarmad Ali

Personal site for [Sarmad Ali](https://linkedin.com/in/sarmad-ali-3206813a3), Junior Software Engineer.

A single-page, WebGL-driven portfolio. A 60k-point GPU particle field sits behind the
page and reforms as you scroll — each project's section drives the field into a shape
that represents that project's architecture.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| 3D | Three.js + React Three Fiber, custom GLSL |
| Motion | Motion (`motion/react`) |
| Scroll | Lenis + GSAP ScrollTrigger |
| Type | Instrument Serif, Geist, Geist Mono |

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the build
```

## How it works

**The particle field.** [`formations.ts`](src/lib/formations.ts) generates six fixed-size
position buffers — a latent shell, a lattice, a pipeline, a dual lobe, a fan-out, and a
dispersal. Every formation fills the same buffer, so the vertex shader morphs between any
two by mixing positions. Each particle keeps its identity across formations (shared RNG
seed), so the field *reorganizes* rather than being replaced.

**The morph.** [`shaders.ts`](src/components/canvas/shaders.ts) gives each particle its own
slice of the global 0→1 sweep, so transitions cross the field as a wave instead of snapping
as one rigid body. Interrupting a morph mid-flight bakes current positions on the CPU using
the same window maths the shader uses, so fast section changes don't jump.

**Scroll coupling.** [`Section.tsx`](src/components/ui/Section.tsx) is the only wire between
the DOM and the canvas: one ScrollTrigger per section, and crossing its midpoint hands the
field over. Sections also declare an `intensity` — the field is prominent where text is
sparse and recedes behind dense body copy, because legibility wins.

**Accessibility.** `prefers-reduced-motion` is honoured throughout: the loader is skipped,
smooth scrolling falls back to native, the field holds still, and Motion's reveals resolve
without transforms.

## Content

All copy lives in [`src/lib/content.ts`](src/lib/content.ts). Editing that one file updates
the whole site — sections, navigation, and the field's formation order are derived from it.
