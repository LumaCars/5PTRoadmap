"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";
import { scrollState } from "@/lib/scrollState";

interface Props {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

export function CameraController({ springX, springY }: Props) {
  const { camera } = useThree();

  useFrame(() => {
    // Fly through stars driven by scroll
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      scrollState.cameraTargetZ,
      0.05
    );

    // Mouse spring rotation ±0.02 rad
    camera.rotation.x = springY.get() * 0.02;
    camera.rotation.y = springX.get() * 0.02;
  });

  return null;
}
