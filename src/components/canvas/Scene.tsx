"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import ParticleField from "./ParticleField";

/**
 * The field sits behind everything, fixed, and never captures pointer events —
 * it reacts to the pointer via a window listener instead, so text stays
 * selectable and links stay clickable.
 */
export default function Scene() {
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Defer the canvas past first paint so it never competes with LCP text.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (failed) return null;

  return (
    <div className="scene" aria-hidden="true">
      {mounted && (
        <Canvas
          // Far enough back that the field reads as depth behind the page. Any
          // closer and it stops being atmosphere and starts being foreground.
          camera={{ position: [0, 0, 16], fov: 45, near: 0.1, far: 60 }}
          dpr={[1, 2]}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          // Additive points don't benefit from a full clear colour; keeping the
          // canvas transparent lets the CSS ground and grain show through.
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          onError={() => setFailed(true)}
        >
          <ParticleField />
        </Canvas>
      )}
    </div>
  );
}
