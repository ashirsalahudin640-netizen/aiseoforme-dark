import { Runtime } from "@/components/Runtime";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";
import { Cursor } from "@/components/ui/Cursor";
import { CanvasRoot } from "@/components/three/CanvasRoot";
import { Hero } from "@/components/sections/Hero";
import { Reel } from "@/components/sections/Reel";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Journey } from "@/components/sections/Journey";
import { Philosophy } from "@/components/sections/Philosophy";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Runtime />
      <Loader />
      <CanvasRoot />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Reel />
        <Work />
        <Services />
        <Journey />
        <Philosophy />
        <Cta />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
