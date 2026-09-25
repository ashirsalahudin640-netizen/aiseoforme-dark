"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { process } from "@/content/site";

/** Four steps in order; an orange rail fills as the reader moves through them. */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-step-dot]").forEach((dot) => {
        gsap.to(dot, {
          backgroundColor: "#ff5b14",
          borderColor: "#ff5b14",
          duration: 0.25,
          ease: "power2.out",
          scrollTrigger: { trigger: dot, start: "top 62%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} className="relative z-10 bg-pearl py-24 md:py-36">
      <div className="frame grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <h2 className="display text-[clamp(2.1rem,4.4vw,4rem)]">From invisible to quoted in a quarter.</h2>
            <p className="lede mt-6">
              A fixed first month, then a monthly rhythm. You always know what we are doing and why it should
              move the numbers.
            </p>
          </div>
        </div>

        <ol data-steps className="relative md:col-span-6 md:col-start-7">
          <span aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-line" />
          <span
            aria-hidden="true"
            data-rail
            className="absolute bottom-3 left-[11px] top-3 w-[2px] origin-top bg-orange"
          />
          {process.map((step, i) => (
            <li key={step.title} className="relative pb-16 pl-14 last:pb-0">
              <span
                data-step-dot
                aria-hidden="true"
                className="absolute left-0 top-1 size-6 rounded-full border-2 border-ink/20 bg-pearl"
              />
              <p className="text-sm text-ink-faint">
                Step {i + 1}, {step.when}
              </p>
              <h3 className="display mt-2 text-[clamp(1.6rem,2.6vw,2.3rem)]">{step.title}</h3>
              <p className="mt-4 max-w-[30rem] text-[1.05rem] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
