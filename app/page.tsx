import { IntroSection } from "@/components/sections/IntroSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { Day1Section } from "@/components/sections/Day1Section";
import { EveningSection } from "@/components/sections/EveningSection";
import { OutroSection } from "@/components/sections/OutroSection";

export default function Home() {
  return (
    <main>
      <IntroSection />
      <JourneySection />
      <Day1Section />
      <EveningSection />
      <OutroSection />
    </main>
  );
}
