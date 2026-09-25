"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { process } from "@/content/site";
import { RiseText } from "./RiseText";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 768px)", narrow: "(max-width: 767px)" },
        (ctx) => {
          const { wide } = ctx.conditions as { wide: boolean };
          const line = "[data-line]";
          if (reduce) {
            gsap.set(line, { scaleX: 1, scaleY: 1 });
            return;
          }
          gsap.fromTo(
            line,
            wide ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
            {
              scaleX: 1,
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 60%", scrub: true },
            },
          );
          gsap.utils.toArray<HTMLElement>("[data-step]", root.current).forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0.25 },
              { opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" } },
            );
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="bg-white py-28 md:py-40">
      <div className="frame">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="display max-w-[16ch] text-[clamp(2.3rem,4.6vw,4.2rem)] font-medium text-navy">
            <RiseText text="From invisible to cited in about twelve weeks." />
          </h2>

          <div data-steps className="relative mt-20">
            <div className="absolute left-[7px] top-2 h-full w-px bg-line md:left-0 md:top-[7px] md:h-px md:w-full" aria-hidden="true">
              <div data-line className="size-full origin-top-left bg-orange" />
            </div>
            <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
              {process.map((p, i) => (
                <li key={p.title} data-step className="relative pl-10 md:pl-0 md:pt-12">
                  <span className="absolute left-0 top-1.5 size-[15px] rounded-full border-[3px] border-white bg-navy shadow-[0_0_0_1px_var(--line)] md:top-0" />
                  <p className="text-[0.9rem] font-medium tabular text-orange-deep">
                    Step {i + 1}, {p.when.toLowerCase()}
                  </p>
                  <h3 className="display mt-3 text-[1.9rem] font-medium text-ink">{p.title}</h3>
                  <p className="mt-3 max-w-[22rem] text-[0.98rem] leading-relaxed text-ink-soft">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
