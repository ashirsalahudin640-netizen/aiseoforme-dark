import { Runtime } from "@/components/Runtime";
import { IntroLoader } from "@/components/IntroLoader";
import { Brand } from "@/components/Brand";
import { Dock } from "@/components/Dock";
import { Cursor } from "@/components/ui/Cursor";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Showcase } from "@/components/sections/Showcase";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Orbit } from "@/components/sections/Orbit";
import { Process } from "@/components/sections/Process";
import { Closing } from "@/components/sections/Closing";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Runtime />
      <IntroLoader />
      <Brand />
      <main className="relative">
        <Hero />
        <Statement />
        <Showcase />
        <Work />
        <Services />
        <Orbit />
        <Process />
        <Closing />
      </main>
      <Footer />
      <Dock />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
