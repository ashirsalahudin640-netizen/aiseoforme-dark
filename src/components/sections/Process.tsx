"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { process } from "@/content/site";

// Each card has its own ground: the page's neutrals plus the two brand accents.
const TONES = [
  { bg: "crystal", text: "text-ink", soft: "text-ink-soft" },
  { bg: "bg-[linear-gradient(135deg,#ff9a2e,#ff7d00_45%,#ff6200)]", text: "text-white", soft: "text-white/85" },
  { bg: "bg-[linear-gradient(135deg,#1b17a0,#0b076e_55%,#07044d)]", text: "text-paper", soft: "text-paper/75" },
  { bg: "crystal bg-[linear-gradient(135deg,rgba(255,232,212,0.9),rgba(255,255,255,0.55))]", text: "text-ink", soft: "text-ink-soft" },
];

/**
 * Sticky card stack (animmaster): cards pin one over another; the one beneath
 * eases back and dims as the next arrives. Scrub is smoothed to stay fluid.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (store.reduced) return;
      const cards = gsap.utils.toArray<HTMLElement>(".step-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: "top bottom", end: "top 18%", scrub: 1 };
        gsap.to(card.querySelector(".step-inner"), {
          scale: 0.94,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger: st,
        });
        // Covered cards become clean coloured tabs; their text steps back.
        gsap.to(card.querySelectorAll(".step-content"), { opacity: 0, ease: "none", scrollTrigger: { ...st } });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="process" aria-labelledby="process-title" className="frame relative overflow-hidden py-28 md:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[20vw] top-[20%] h-[70vw] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(255,125,0,0.28),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-[25vw] bottom-0 h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(11,7,110,0.16),transparent)]" />
      <div className="grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">How we work</p>
        <h2 id="process-title" className="display text-[clamp(2.6rem,5.6vw,6rem)] text-ink md:col-span-9">
          Four steps, repeated until you&apos;re <span className="text-crystal">the answer.</span>
        </h2>
      </div>

      <ol className="mt-20 md:mt-28">
        {process.map((p, i) => {
          const tone = TONES[i % TONES.length];
          return (
            <li
              key={p.step}
              className="step-card sticky mb-[12vh] last:mb-0"
              style={{ top: `calc(12vh + ${i * 1.1}rem)` }}
            >
              <div
                className={`step-inner relative grid min-h-[58vh] gap-8 overflow-hidden rounded-[2rem] p-8 shadow-[0_30px_80px_-40px_rgba(255,125,0,0.45)] md:grid-cols-12 md:p-14 ${tone.bg}`}
              >
                <div className="step-content md:col-span-4">
                  <p className={`font-mono text-[0.85rem] ${tone.soft}`}>Step {i + 1}</p>
                  <p className={`display mt-4 text-[clamp(3.2rem,7vw,7rem)] ${tone.text}`}>{p.step}</p>
                </div>
                <div className="step-content flex flex-col justify-end md:col-span-6 md:col-start-7">
                  <h3 className={`text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-[1.1] tracking-[-0.03em] ${tone.text}`}>
                    {p.title}
                  </h3>
                  <p className={`mt-4 text-[1.05rem] leading-relaxed ${tone.soft}`}>{p.body}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
