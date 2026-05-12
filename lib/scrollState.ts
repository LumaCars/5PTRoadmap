// Module-level mutable state shared between GSAP (outside Canvas) and Three.js (inside Canvas).
// No React state — zero re-renders.
export const scrollState = {
  cameraTargetZ: 500,
}
