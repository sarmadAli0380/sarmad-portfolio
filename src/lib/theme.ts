/**
 * Design tokens shared by CSS and WebGL.
 *
 * The canvas can't read CSS custom properties, so colours live here in JS and
 * are projected into `globals.css` as variables — one source, two consumers.
 */

export const theme = {
  ink: "#08080B", // page ground
  inkRaised: "#0E0E12", // panels, hairlines against ground
  bone: "#E8E4DC", // primary text, majority of particles
  boneDim: "#8B8880", // secondary text
  boneFaint: "#4A4843", // rules, disabled
  accent: "#FF4D1C", // sodium orange — used sparingly, never decoratively
  accentDim: "#7A2610",
} as const;

/**
 * Easing. Everything on this site uses one of these four — a shared motion
 * vocabulary is most of what separates considered work from decorated work.
 */
export const ease = {
  /** default for entrances */
  out: [0.16, 1, 0.3, 1] as const,
  /** default for exits */
  in: [0.7, 0, 0.84, 0] as const,
  /** transforms that start and end at rest */
  inOut: [0.87, 0, 0.13, 1] as const,
  /** slight overshoot, for elements that should feel physical */
  spring: { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 },
};

export const duration = {
  fast: 0.24,
  base: 0.4,
  slow: 0.7,
  reveal: 1.1,
};
