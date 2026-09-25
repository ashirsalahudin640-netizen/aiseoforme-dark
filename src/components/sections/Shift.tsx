"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { shift } from "@/content/site";

/**
 * The "why now" chapter. The section is tall; its inner frame is CSS-sticky
 * (cheaper than a GSAP pin). Scroll progress picks the active step here and
 * drives the particle morph in the 3D layer behind it.
 */
export function Shift() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = queryAll(root.current, "[data-step]");
      const ticks = queryAll(root.current, "[data-tick]");
      let current = -1;
      const set = (idx: number) => {
        if (idx === current) return;
        current = idx;
        steps.forEach((el, i) => (el.dataset.active = String(i === idx)));
        ticks.forEach((el, i) => (el.dataset.active = String(i <= idx)));
      };
      set(0);
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          set(p < 0.4 ? 0 : p < 0.66 ? 1 : 2);
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section id="shift" ref={root} className="relative z-10 h-[340vh]" aria-label="Why search changed">
      <div className="sticky top-0 flex h-[100dvh] items-end md:items-center">
        <div className="frame w-full pb-12 md:pb-0">
          <div className="max-w-[34rem]">
            <div className="mb-8 flex gap-1.5" aria-hidden="true">
              {shift.steps.map((_, i) => (
                <span
                  key={i}
                  data-tick
                  className="h-[3px] w-10 rounded-full bg-ink/15 transition-colors duration-300 data-[active=true]:bg-orange"
                />
              ))}
            </div>
            <div className="grid">
              {shift.steps.map((step, i) => (
                <div
                  key={step.title}
                  data-step
                  data-active={i === 0}
                  className="[grid-area:1/1] translate-y-4 opacity-0 blur-[3px] transition-[opacity,transform,filter] duration-500 ease-[var(--ease-out)] data-[active=true]:translate-y-0 data-[active=true]:opacity-100 data-[active=true]:blur-0"
                >
                  <h2 className="display text-[clamp(2rem,4.4vw,4rem)] text-ink">{step.title}</h2>
                  <p className="lede mt-5">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function queryAll(scope: HTMLElement | null, selector: string) {
  return scope ? Array.from(scope.querySelectorAll<HTMLElement>(selector)) : [];
}
