"use client";

// This module is ONLY ever loaded client-side (via DynamicApp ssr:false).
// All imports that touch browser globals (Three.js, R3F, GSAP, Lenis)
// are safe here because this file never runs during SSR.
import { LenisProvider } from "@/components/providers/LenisProvider";
import { SpaceCanvasLoader } from "@/components/canvas/SpaceCanvasLoader";
import { IntroSection } from "@/components/sections/IntroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { Day1Section } from "@/components/sections/Day1Section";
import { EveningSection } from "@/components/sections/EveningSection";
import { OutroSection } from "@/components/sections/OutroSection";

export default function App() {
  return (
    <LenisProvider>
      <SpaceCanvasLoader />
      <main style={{ position: "relative", zIndex: 10 }}>
        <IntroSection />
        <JourneySection />
        <Day1Section />
        <EveningSection />
        <OutroSection />
      </main>
    </LenisProvider>
  );
}
