"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady, store } from "@/lib/store";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { hero } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  useSectionProgress(ref, "hero", "top top", "bottom top");

  useGSAP(
    () => {
      const metas = gsap.utils.toArray<HTMLElement>(".hero-meta");
      if (!store.reduced) {
        gsap.set(metas, { opacity: 0, y: 12 });
        const stop = onReady(() =>
          gsap.to(metas, { opacity: 1, y: 0, duration: 0.9, delay: 0.7, stagger: 0.08, ease: "expo.out" }),
        );
        // The headline lifts and softens as the scene takes over.
        gsap.to(copy.current, {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        return stop;
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="frame relative flex min-h-[100dvh] flex-col justify-end pb-8 pt-28 md:pb-10"
    >
      <div className="hero-meta meta absolute left-[var(--gutter)] top-24 text-navy/60 md:top-28">
        {hero.metaLeft}
      </div>
      <div className="hero-meta meta absolute right-[var(--gutter)] top-24 hidden text-right text-navy/60 md:top-28 md:block">
        {hero.metaRight}
        <br />
        Est. 2017 — Worldwide
      </div>

      <div ref={copy} className="relative">
        <RevealLines
          as="h1"
          trigger="ready"
          delay={0.35}
          lines={hero.lines}
          className="display text-[clamp(2.6rem,8.4vw,9.5rem)] text-navy"
          lineClassName="md:whitespace-nowrap"
        />
        <div className="mt-8 flex items-end justify-between gap-6 md:mt-10">
          <p className="hero-meta max-w-[34ch] text-[0.95rem] leading-relaxed text-navy/70">
            AI-powered SEO for the way people search now — across Google, answer
            engines and every assistant in between.
          </p>
          <div className="hero-meta meta flex shrink-0 items-center gap-3 text-navy">
            <span className="relative block h-10 w-[1px] overflow-hidden bg-navy/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-orange" />
            </span>
            {hero.scroll}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .scroll-cue { animation: cue 1.8s var(--ease-in-out) infinite; }
      `}</style>
    </section>
  );
}
