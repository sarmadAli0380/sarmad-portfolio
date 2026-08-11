import type { FormationId } from "./content";

/**
 * Particle-field formations.
 *
 * Every formation fills the same fixed-size buffer, so the vertex shader can
 * morph between any two by mixing positions. Each shape is a literal reading of
 * the project it belongs to — a pipeline is a pipeline, a fan-out is a fan-out.
 */

export const PARTICLE_COUNT = 60000;

/** Deterministic RNG so the field looks identical on every load and on the server. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Builder = (out: Float32Array, count: number, rand: () => number) => void;

/** Latent cloud — a noisy fibonacci shell. The resting state. */
const latent: Builder = (out, count, rand) => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    // Shell thickness falls off toward the poles for a denser equator.
    const jitter = 0.86 + rand() * 0.28;
    const radius = 3.1 * jitter;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius * 0.92;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
};

/** Lattice — three stacked tiers. Role hierarchy made literal. */
const lattice: Builder = (out, count, rand) => {
  const tiers = 3;
  const perTier = Math.floor(count / tiers);
  const side = Math.ceil(Math.sqrt(perTier));
  for (let i = 0; i < count; i++) {
    const tier = Math.min(tiers - 1, Math.floor(i / perTier));
    const local = i - tier * perTier;
    const gx = local % side;
    const gz = Math.floor(local / side);
    // Upper tiers are narrower — fewer people, more authority.
    const spread = 5.4 - tier * 1.1;
    const cell = spread / side;
    out[i * 3] = (gx - side / 2) * cell + (rand() - 0.5) * cell * 0.5;
    out[i * 3 + 1] = (tier - 1) * 1.5 + (rand() - 0.5) * 0.12;
    out[i * 3 + 2] = (gz - side / 2) * cell + (rand() - 0.5) * cell * 0.5;
  }
};

/** Pipeline — a helical stream with dense checkpoint knots along its length. */
const pipeline: Builder = (out, count, rand) => {
  const stages = 5;
  const length = 9.5;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // 35% of particles collapse into checkpoint knots, the rest flow between.
    const knot = rand() < 0.35;
    let x: number;
    if (knot) {
      const stage = Math.floor(rand() * stages);
      x = -length / 2 + (stage / (stages - 1)) * length;
      x += (rand() - 0.5) * 0.22;
    } else {
      x = -length / 2 + t * length + (rand() - 0.5) * 0.3;
    }
    const phase = t * Math.PI * 14;
    const radius = knot ? 0.42 + rand() * 0.5 : 0.85 + Math.sin(t * Math.PI) * 0.5;
    const wobble = knot ? 1 : 0.8 + rand() * 0.4;
    out[i * 3] = x;
    out[i * 3 + 1] = Math.sin(phase) * radius * wobble;
    out[i * 3 + 2] = Math.cos(phase) * radius * wobble;
  }
};

/** Dual lobe — two model backends, one bridge. Cloud left, local right. */
const duallobe: Builder = (out, count, rand) => {
  const gap = 3.4;
  for (let i = 0; i < count; i++) {
    const bridge = rand() < 0.18;
    if (bridge) {
      const t = rand();
      // Bridge sags slightly so it reads as a connection, not a bar.
      out[i * 3] = (t * 2 - 1) * gap;
      out[i * 3 + 1] = -Math.sin(t * Math.PI) * 0.5 + (rand() - 0.5) * 0.18;
      out[i * 3 + 2] = (rand() - 0.5) * 0.35;
      continue;
    }
    const side = rand() < 0.5 ? -1 : 1;
    // Slightly different densities so the two lobes aren't mirror-identical.
    const r = Math.pow(rand(), side < 0 ? 0.62 : 0.5) * 2.05;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    out[i * 3] = side * gap + r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.95;
    out[i * 3 + 2] = r * Math.cos(phi);
  }
};

/** Fan-out — one core, seven spokes, one outer ring. */
const fanout: Builder = (out, count, rand) => {
  const spokes = 7;
  for (let i = 0; i < count; i++) {
    const roll = rand();
    if (roll < 0.16) {
      // Core.
      const r = Math.pow(rand(), 0.45) * 0.85;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      out[i * 3 + 2] = r * Math.cos(phi);
    } else if (roll < 0.78) {
      // Spokes.
      const s = Math.floor(rand() * spokes);
      const a = (s / spokes) * Math.PI * 2;
      const t = 0.85 + rand() * 2.9;
      const spread = 0.06 + t * 0.045;
      out[i * 3] = Math.cos(a) * t + (rand() - 0.5) * spread;
      out[i * 3 + 1] = (rand() - 0.5) * spread * 1.6;
      out[i * 3 + 2] = Math.sin(a) * t + (rand() - 0.5) * spread;
    } else {
      // Ring.
      const a = rand() * Math.PI * 2;
      const r = 3.85 + (rand() - 0.5) * 0.22;
      out[i * 3] = Math.cos(a) * r;
      out[i * 3 + 1] = (rand() - 0.5) * 0.2;
      out[i * 3 + 2] = Math.sin(a) * r;
    }
  }
};

/** Disperse — the field lets go. Wide, flat, drifting. */
const disperse: Builder = (out, count, rand) => {
  for (let i = 0; i < count; i++) {
    const t = rand();
    out[i * 3] = (rand() - 0.5) * 16;
    // Density thins toward the top — it reads as rising and dissipating.
    out[i * 3 + 1] = (Math.pow(t, 1.8) - 0.35) * 7;
    out[i * 3 + 2] = (rand() - 0.5) * 7;
  }
};

const builders: Record<FormationId, Builder> = {
  latent,
  lattice,
  pipeline,
  duallobe,
  fanout,
  disperse,
};

const cache = new Map<FormationId, Float32Array>();

export function getFormation(id: FormationId): Float32Array {
  const hit = cache.get(id);
  if (hit) return hit;
  const buf = new Float32Array(PARTICLE_COUNT * 3);
  // Same seed for every formation so a given particle keeps its identity across
  // morphs — the field reorganizes rather than being replaced.
  builders[id](buf, PARTICLE_COUNT, rng(0x5eed));
  cache.set(id, buf);
  return buf;
}

/** Per-particle randoms: morph delay, size variance, colour bias. */
export function getAttributes() {
  const rand = rng(0xc0ffee);
  const seeds = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    seeds[i * 3] = rand(); // stagger
    seeds[i * 3 + 1] = rand(); // size
    seeds[i * 3 + 2] = rand(); // hue bias
  }
  return seeds;
}
