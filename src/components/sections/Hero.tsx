"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady, scrollToId, store } from "@/lib/store";
import { hasFinePointer } from "@/lib/device";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { hero } from "@/content/site";
import { MagneticHeadline } from "@/components/ui/MagneticHeadline";
import { AnswerWidget } from "@/components/ui/AnswerWidget";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  useSectionProgress(ref, "hero", "top top", "bottom top");

  useGSAP(
    () => {
      if (store.reduced) return;
      const rest = gsap.utils.toArray<HTMLElement>(".hero-rest");
      gsap.set(rest, { clipPath: "inset(0% 0% 100% 0%)", yPercent: 25 });
      const stop = onReady(() =>
        gsap.to(rest, {
          clipPath: "inset(0% 0% -20% 0%)",
          yPercent: 0,
          duration: 1.1,
          delay: 0.9,
          stagger: 0.1,
          ease: "power4.out",
        }),
      );
      gsap.to(".hero-bottom", {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "60% top", scrub: 0.6 },
      });

      // Warm light that trails the cursor across the hero.
      if (!hasFinePointer()) return stop;
      const g = glow.current!;
      const gx = gsap.quickTo(g, "x", { duration: 0.9, ease: "power3.out" });
      const gy = gsap.quickTo(g, "y", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const r = ref.current!.getBoundingClientRect();
        gx(e.clientX - r.left);
        gy(e.clientY - r.top);
      };
      ref.current!.addEventListener("pointermove", onMove);
      return () => {
        stop();
        ref.current?.removeEventListener("pointermove", onMove);
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="frame relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-8 pt-28 md:pb-10"
    >
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -ml-[35vmax] -mt-[35vmax] h-[70vmax] w-[70vmax] rounded-full opacity-70 mix-blend-multiply"
        style={{
          background: "radial-gradient(closest-side, rgba(255,160,58,0.55), rgba(255,217,174,0.25) 55%, transparent)",
          transform: "translate(70vw, 40vh)",
        }}
      />

      <MagneticHeadline
        lines={hero.lines}
        scrollTrigger={ref}
        className="display relative text-[clamp(3rem,9.4vw,10.5rem)] text-orange"
      />

      <div className="hero-bottom relative mt-8 grid items-end gap-6 md:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
        <div className="flex flex-col gap-6">
          <p className="hero-rest max-w-[38ch] text-[1.05rem] leading-snug text-roast">{hero.intro}</p>
          <div className="hero-rest flex items-center gap-5">
            <Magnetic strength={0.3}>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("work");
                }}
                className="roll-host press flex h-14 items-center rounded-full bg-roast px-7 text-[1rem] font-semibold text-pearl"
              >
                <RollText text="See the work" />
              </a>
            </Magnetic>
            <p className="note hidden items-center gap-3 text-roast-soft sm:flex">
              <span className="relative block h-10 w-[2px] overflow-hidden rounded-full bg-orange/20">
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 rounded-full bg-orange" />
              </span>
              {hero.scroll}
            </p>
          </div>
        </div>
        <AnswerWidget className="hero-rest" />
      </div>
      <style>{`
        @keyframes cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .scroll-cue { animation: cue 1.8s var(--ease-in-out) infinite; }
      `}</style>
    </section>
  );
}
