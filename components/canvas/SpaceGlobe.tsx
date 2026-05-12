"use client";

import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mesh } from "three";

export function SpaceGlobe() {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture("/5pt space.png");

  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(({ camera }) => {
    if (!meshRef.current) return;
    const dist = Math.abs(camera.position.z - -800);
    const closeness = Math.max(0, 1 - dist / 1300);
    meshRef.current.scale.setScalar(1 + closeness * 0.18);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -800]}>
      <planeGeometry args={[2400, 1350]} />
      <meshBasicMaterial map={texture} transparent opacity={0.92} depthWrite={false} />
    </mesh>
  );
}
