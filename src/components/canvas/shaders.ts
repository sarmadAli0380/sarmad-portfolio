/**
 * Particle-field shaders.
 *
 * The morph is done per-particle in the vertex shader: `position` holds the
 * formation being left, `aTarget` the one being entered, and `uMix` sweeps
 * 0 → 1. Each particle gets its own slice of that sweep (from `aSeed.x`) so the
 * field reorganizes in a wave instead of snapping as one rigid body.
 */

/** Ashima Arts simplex noise — public domain. Drives drift and morph turbulence. */
const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMix;
uniform float uSize;
uniform float uPixelRatio;
uniform float uReveal;
uniform float uTurbulence;
uniform float uPointerStrength;
uniform vec3  uPointer;

attribute vec3 aTarget;
attribute vec3 aSeed;

varying float vSeed;
varying float vEnergy;
varying float vDepth;

${simplex}

void main() {
  // Each particle morphs inside its own window of the global sweep. Particles
  // with a low stagger seed move first; the rest follow, so the transition
  // reads as a wave crossing the field.
  float window = 0.45;
  float start = aSeed.x * (1.0 - window);
  float m = clamp((uMix - start) / window, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec3 pos = mix(position, aTarget, m);

  // Energy peaks mid-morph — particles in flight get bigger and hotter.
  float energy = sin(m * 3.14159265);

  float t = uTime * 0.08;
  vec3 drift = vec3(
    snoise(pos * 0.22 + vec3(t, 0.0, 0.0)),
    snoise(pos * 0.22 + vec3(0.0, t, 12.7)),
    snoise(pos * 0.22 + vec3(31.4, 0.0, t))
  );
  pos += drift * (0.16 + energy * 0.6) * uTurbulence;

  // Pointer pushes the field away with a soft gaussian falloff.
  vec3 delta = pos - uPointer;
  float dist = length(delta);
  pos += normalize(delta + 1e-5) * uPointerStrength * exp(-dist * dist * 0.28);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.45 + aSeed.y * 0.9) * (1.0 + energy * 0.85);
  gl_PointSize = size * uPixelRatio * (30.0 / max(-mv.z, 0.1));
  gl_PointSize *= smoothstep(0.0, 0.35, uReveal);

  vSeed = aSeed.z;
  vEnergy = energy;
  vDepth = -mv.z;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec3  uColorBase;
uniform vec3  uColorAccent;
uniform float uReveal;
uniform float uIntensity;

varying float vSeed;
varying float vEnergy;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = dot(uv, uv);
  if (d > 0.25) discard;

  // Squared falloff gives a soft core without needing a texture.
  float alpha = smoothstep(0.25, 0.0, d);
  alpha *= alpha;

  // A minority of particles carry the accent at rest; morphing pushes the rest
  // toward it, so the field visibly heats up during a transition.
  float accent = smoothstep(0.74, 1.0, vSeed) + vEnergy * 0.65;
  vec3 col = mix(uColorBase, uColorAccent, clamp(accent, 0.0, 1.0));

  // Depth fade across the whole field, not just its far edge — this is most of
  // what keeps 60k additive points from reading as a solid bright mass.
  float depthFade = smoothstep(30.0, 8.0, vDepth);

  gl_FragColor = vec4(col, alpha * depthFade * 0.34 * uReveal * uIntensity);
}
`;
