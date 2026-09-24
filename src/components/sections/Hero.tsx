"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onReady, scrollToId, store } from "@/lib/store";
import { hero } from "@/content/site";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";

const PrismScene = dynamic(() => import("@/components/three/PrismScene"), { ssr: false });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => onReady(() => setReady(true)), []);

  useGSAP(
    () => {
      // Feed the 3D prism an eased progress value as the hero scrolls away.
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => (store.heroProgress = self.progress),
      });
      if (!store.reduced) {
        gsap.set([".hero-fade", ".hero-canvas"], { opacity: 0 });
        gsap.to(".hero-copy", {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "70% top", scrub: 1 },
        });
      }
      return () => st.kill();
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      if (!ready || store.reduced) return;
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, delay: 0.9, stagger: 0.08, ease: "power3.out" },
      );
      gsap.fromTo(".hero-canvas", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" });
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <section ref={ref} id="top" aria-label="Introduction" className="relative min-h-[100dvh] overflow-hidden">
      <div className="hero-canvas absolute inset-0" aria-hidden="true">
        <PrismScene />
      </div>

      <div className="hero-copy frame relative flex min-h-[100dvh] flex-col justify-end pb-28 pt-32 md:pb-32">
        {ready ? (
          <h1 className="display max-w-[14ch] text-[clamp(2.8rem,7.4vw,8.4rem)] text-ink">
            <GooeyTextReveal mode="immediate" duration={1.3} stagger={0.14} blurAmount={0.8}>
              <span className="block">{hero.lines[0]}</span>
              <span className="block text-crystal pb-[0.08em]">{hero.lines[1]}</span>
            </GooeyTextReveal>
          </h1>
        ) : (
          <h1 className="display max-w-[14ch] text-[clamp(2.8rem,7.4vw,8.4rem)] text-ink opacity-0">
            <span className="block">{hero.lines[0]}</span>
            <span className="block">{hero.lines[1]}</span>
          </h1>
        )}

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
          <p className="hero-fade max-w-[40ch] text-[1.05rem] leading-relaxed text-ink-soft">{hero.intro}</p>
          <div className="hero-fade flex flex-wrap items-center gap-5">
            <LiquidMetalButton
              size="lg"
              data-cursor="Open"
              onClick={() => scrollToId("contact")}
              icon={<ArrowUpRight className="h-5 w-5 text-ink" strokeWidth={1.6} />}
              metalConfig={{ colorBack: "#ff7d00", colorTint: "#ffe2c4", speed: 0.35 }}
            >
              <span className="font-medium text-ink">Start a project</span>
            </LiquidMetalButton>
            <a
              href="#work"
              className="link-line text-[0.95rem] font-medium text-ink"
            >
              See the work
            </a>
          </div>
        </div>

        <div className="hero-fade mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 text-[0.9rem] text-ink-soft">
          <span className="font-medium text-orange">Visible in</span>
          {hero.engines.map((e) => (
            <span key={e}>{e}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
