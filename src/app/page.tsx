import { Runtime } from "@/components/Runtime";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/up/Hero";
import { Shift } from "@/components/up/Shift";
import { Services } from "@/components/up/Services";
import { AnswerDemo } from "@/components/up/AnswerDemo";
import { Work } from "@/components/up/Work";
import { Process } from "@/components/up/Process";
import { Feedback } from "@/components/up/Feedback";
import { Contact } from "@/components/up/Contact";
import { Footer } from "@/components/up/Footer";
import { AtomCursor } from "@/components/up/AtomCursor";
import { Intro } from "@/components/up/Intro";

export default function Home() {
  return (
    <>
      <Runtime />
      <AtomCursor />
      <Intro />
      <Nav />
      <main className="relative">
        <Hero />
        <Shift />
        <Services />
        <AnswerDemo />
        <Work />
        <Process />
        <Feedback />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
