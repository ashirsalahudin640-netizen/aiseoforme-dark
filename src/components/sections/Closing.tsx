"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { contact } from "@/content/site";
import { GooeyTextReveal } from "@/components/ui/gooey-text-reveal";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";
import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";
import { BorderBeam } from "@/components/ui/border-beam";

/** Closing: a molten orange-and-navy panel opens up, with a crystal card on top. */
export function Closing() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (store.reduced) return;
      const st = { trigger: ref.current, start: "top 85%", end: "top 15%", scrub: 1 };
      gsap.fromTo(
        ".closing-media",
        { clipPath: "inset(14% 18% 14% 18% round 40px)" },
        { clipPath: "inset(0% 0% 0% 0% round 32px)", ease: "none", scrollTrigger: st },
      );
      gsap.fromTo(".closing-card", { y: 80, scale: 0.94 }, { y: 0, scale: 1, ease: "none", scrollTrigger: { ...st } });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="closing-title" className="frame relative py-28 md:py-40">
      <div className="closing-media relative flex min-h-[82vh] items-center justify-center overflow-hidden rounded-[32px] p-5 md:p-12">
        <div className="absolute inset-0" aria-hidden="true">
          <FluidMorphBg
            duration={7}
            backgroundColor="#0b076e"
            colors={["#ff7d00", "#ff9a2e", "#ffb266", "#ff6200", "#2a27a8", "#12108a", "#ff8a1a"]}
          />
        </div>

        <div className="closing-card crystal-dark relative w-full max-w-[980px] overflow-hidden rounded-[28px] p-8 text-paper md:p-14">
          <BorderBeam size={320} duration={10} colorFrom="#ffb266" colorTo="#ffffff" borderWidth={1.5} />
          <p className="text-[0.95rem] text-paper/80">Start a project</p>
          <GooeyTextReveal mode="scroll" start="top 80%" blurAmount={0.8}>
            <h2 id="closing-title" className="display mt-4 text-[clamp(2.8rem,6.6vw,7rem)] text-paper">
              Let&apos;s make you the answer.
            </h2>
          </GooeyTextReveal>
          <div className="mt-10 flex flex-wrap items-center gap-6 md:mt-12">
            <LiquidMetalButton
              size="lg"
              data-cursor="Open"
              onClick={() => {
                window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("New project")}`;
              }}
              icon={<ArrowUpRight className="h-5 w-5 text-ink" strokeWidth={1.6} />}
              metalConfig={{ colorBack: "#ff7d00", colorTint: "#ffe2c4", speed: 0.35 }}
            >
              <span className="font-medium text-ink">Book a free audit</span>
            </LiquidMetalButton>
            <a href={`mailto:${contact.email}`} className="link-line text-[1.05rem] font-medium text-paper">
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
