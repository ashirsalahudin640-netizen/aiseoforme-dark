"use client";

import { useRef } from "react";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { useOrangeTone } from "@/lib/useOrangeTone";
import { contact, cta } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  useSectionProgress(ref, "cta", "top bottom", "bottom bottom");
  useOrangeTone(ref, "top 40%", "bottom 64px");

  return (
    <section
      ref={ref}
      id="contact"
      data-bg="orange"
      aria-labelledby="cta-title"
      className="relative h-[240vh]"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 text-center text-pearl">
        <RevealLines
          as="h2"
          id="cta-title"
          lines={cta.lines}
          stagger={0.1}
          start="top 45%"
          className="display text-[clamp(3.2rem,10vw,11rem)]"
        />
        <div className="mt-12 md:mt-14">
          <Magnetic strength={0.4}>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("New project")}`}
              data-cursor="Open"
              className="roll-host press group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-pearl text-orange-hot md:h-48 md:w-48"
            >
              <span className="absolute inset-0 origin-bottom scale-0 rounded-full bg-roast transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-100" />
              <span className="relative text-[1.05rem] font-bold transition-colors duration-500 group-hover:text-pearl">
                <RollText text={cta.button} />
              </span>
            </a>
          </Magnetic>
        </div>
        <a href={`mailto:${contact.email}`} className="link-line mt-10 text-[1.05rem] font-semibold">
          {contact.email}
        </a>
      </div>
    </section>
  );
}
