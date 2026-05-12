"use client";

import { useMemo } from "react";
import * as THREE from "three";

export function StarField() {
  const positions = useMemo(() => {
    // Reduce star count on small / low-power devices so mobile GPUs don't
    // choke (or worse, lose the WebGL context and crash the page).
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 800 : 3000;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 750;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      pos[i * 3 + 2] = -2000 + Math.random() * 2500;
    }

    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.6}
        color={new THREE.Color("#d8d0ff")}
        transparent
        opacity={0.78}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
