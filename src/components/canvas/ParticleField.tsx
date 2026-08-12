"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getAttributes, getFormation, PARTICLE_COUNT } from "@/lib/formations";
import { readState, useStore } from "@/lib/store";
import { fragmentShader, vertexShader } from "./shaders";
import { theme } from "@/lib/theme";

const MORPH_DURATION = 1.9; // seconds

type Props = { reducedMotion: boolean };

export default function ParticleField({ reducedMotion }: Props) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const formation = useStore((s) => s.formation);
  const { viewport, gl, size } = useThree();

  const seeds = useMemo(() => getAttributes(), []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const start = getFormation("latent");
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(start), 3),
    );
    g.setAttribute(
      "aTarget",
      new THREE.BufferAttribute(new Float32Array(start), 3),
    );
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    // Fixed bounds — the field never leaves this box, and computing them from
    // 60k morphing points every frame is wasted work.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, [seeds]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMix: { value: 1 },
      uSize: { value: 1 },
      uPixelRatio: { value: 1 },
      uReveal: { value: 0 },
      uIntensity: { value: 1 },
      uTurbulence: { value: 1 },
      uPointer: { value: new THREE.Vector3(999, 999, 999) },
      uPointerStrength: { value: 0 },
      uColorBase: { value: new THREE.Color(theme.bone) },
      uColorAccent: { value: new THREE.Color(theme.accent) },
    }),
    [],
  );

  // Point size has to track both DPR and viewport width — the same field on a
  // phone needs proportionally larger points to read as a continuous surface.
  useEffect(() => {
    const mat = material.current;
    if (!mat) return;
    mat.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2);
    mat.uniforms.uSize.value = size.width < 768 ? 1.45 : 1;
  }, [gl, size.width]);

  // Morph bookkeeping lives in a ref so useFrame can drive it without re-renders.
  const morph = useRef({ t: 1, active: false, current: "latent" as string });

  useEffect(() => {
    if (formation === morph.current.current) return;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const target = geometry.getAttribute("aTarget") as THREE.BufferAttribute;
    const next = getFormation(formation);

    if (morph.current.active) {
      // Interrupted mid-flight: bake where each particle actually is right now,
      // using the same per-particle window the vertex shader applies. Without
      // this, changing sections quickly snaps the field.
      const a = pos.array as Float32Array;
      const b = target.array as Float32Array;
      const mix = morph.current.t;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const stagger = seeds[i * 3];
        const start = stagger * 0.55;
        let m = (mix - start) / 0.45;
        m = m < 0 ? 0 : m > 1 ? 1 : m;
        m = m * m * (3 - 2 * m);
        const j = i * 3;
        a[j] += (b[j] - a[j]) * m;
        a[j + 1] += (b[j + 1] - a[j + 1]) * m;
        a[j + 2] += (b[j + 2] - a[j + 2]) * m;
      }
    } else {
      (pos.array as Float32Array).set(target.array as Float32Array);
    }

    (target.array as Float32Array).set(next);
    pos.needsUpdate = true;
    target.needsUpdate = true;

    morph.current.current = formation;
    morph.current.t = reducedMotion ? 1 : 0;
    morph.current.active = !reducedMotion;
    uniforms.uMix.value = morph.current.t;
  }, [formation, geometry, seeds, uniforms, reducedMotion]);

  // Pointer in world space, smoothed. Raw pointer values make the repulsion
  // feel twitchy; a lerp gives it weight.
  const pointer = useRef(new THREE.Vector3(999, 999, 999));
  const pointerTarget = useRef(new THREE.Vector3(999, 999, 999));
  // Scratch vector for the world → local conversion, reused every frame.
  const pointerLocal = useRef(new THREE.Vector3());

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current.set(
        (x * viewport.width) / 2,
        (y * viewport.height) / 2,
        0,
      );
    };
    const onLeave = () => pointerTarget.current.set(999, 999, 999);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [viewport.width, viewport.height, reducedMotion]);

  // Below the md breakpoint the layout is single-column and centred, so the
  // field stays centred too — there's no side to get out of the way of.
  const offsetX = size.width >= 768 ? viewport.width * 0.16 : 0;

  useFrame((_, rawDelta) => {
    const mat = material.current;
    const group = points.current;
    if (!mat || !group) return;

    // Clamp delta so a backgrounded tab doesn't resume with a huge jump.
    const delta = Math.min(rawDelta, 1 / 30);

    // On wide screens the text column owns the left. Sliding the field right
    // keeps the two from fighting over the same pixels.
    group.position.x = offsetX;

    // Reduced motion keeps the field — it just holds still. Time is what drives
    // the drift, so freezing time is the whole intervention.
    if (!reducedMotion) mat.uniforms.uTime.value += delta;

    if (morph.current.active) {
      morph.current.t += delta / MORPH_DURATION;
      if (morph.current.t >= 1) {
        morph.current.t = 1;
        morph.current.active = false;
      }
      mat.uniforms.uMix.value = morph.current.t;
    }

    // Reveal ramps in once the loader hands over.
    const state = readState();
    const revealTarget = state.entered ? 1 : 0;
    mat.uniforms.uReveal.value +=
      (revealTarget - mat.uniforms.uReveal.value) * delta * 1.6;

    // Eased rather than switched — a hard cut in brightness on section change
    // would read as a bug.
    mat.uniforms.uIntensity.value +=
      (state.intensity - mat.uniforms.uIntensity.value) * delta * 2.2;

    if (!reducedMotion) {
      // A slow yaw keeps the silhouette changing without reading as a turntable.
      group.rotation.y += delta * 0.035;
      group.rotation.x = Math.sin(state.scroll * Math.PI * 2) * 0.13;
      group.position.y = -state.scroll * 0.8;

      pointer.current.lerp(pointerTarget.current, 1 - Math.pow(0.0004, delta));

      /*
       * The shader compares the pointer against particle positions, which are
       * in this object's local space — but the pointer arrives in world space,
       * and this object is rotating and translating every frame. Without
       * converting, the repulsion lands somewhere other than the cursor and
       * slides away as the field turns. Transform must happen after the
       * rotation/position writes above, hence updateMatrixWorld.
       */
      group.updateMatrixWorld();
      pointerLocal.current.copy(pointer.current);
      group.worldToLocal(pointerLocal.current);
      (mat.uniforms.uPointer.value as THREE.Vector3).copy(pointerLocal.current);
      mat.uniforms.uPointerStrength.value = 1.3;
    }
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
