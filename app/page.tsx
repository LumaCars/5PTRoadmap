import { SpaceCanvasLoader } from "@/components/canvas/SpaceCanvasLoader";
import { IntroSection } from "@/components/sections/IntroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { Day1Section } from "@/components/sections/Day1Section";
import { EveningSection } from "@/components/sections/EveningSection";
import { OutroSection } from "@/components/sections/OutroSection";

export default function Home() {
  return (
    <>
      <SpaceCanvasLoader />
      <main style={{ position: "relative", zIndex: 10 }}>
        <IntroSection />
        <JourneySection />
        <Day1Section />
        <EveningSection />
        <OutroSection />
      </main>
    </>
  );
}
