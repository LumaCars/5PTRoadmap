"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useMotionValue, useSpring } from "framer-motion";
import { StarField } from "./StarField";
import { SpaceGlobe } from "./SpaceGlobe";
import { CameraController } from "./CameraController";

export function SpaceCanvas() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 15 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 500], fov: 60, near: 0.1, far: 5000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "#050505" }}
      >
        <Suspense fallback={null}>
          <StarField />
          <SpaceGlobe />
          <CameraController springX={springX} springY={springY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
