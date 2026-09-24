"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { contact, cta } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";
import { Magnetic } from "@/components/ui/Magnetic";

export function Cta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = document.documentElement;
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => {
        store.progress.cta = self.progress;
        root.classList.toggle("tone-dark", self.progress > 0.36);
      },
      onRefresh: (self) => {
        store.progress.cta = self.progress;
        root.classList.toggle("tone-dark", self.progress > 0.36);
      },
    });
    return () => {
      st.kill();
      root.classList.remove("tone-dark");
    };
  });

  return (
    <section
      ref={ref}
      id="contact"
      aria-labelledby="cta-title"
      className="cta-section relative h-[240vh]"
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden text-center">
        <p className="meta mb-8 text-orange">(Let&apos;s talk)</p>
        <RevealLines
          as="h2"
          id="cta-title"
          lines={cta.lines}
          stagger={0.1}
          start="top 45%"
          className="display cta-title px-4 text-[clamp(3rem,9.5vw,10rem)] text-pearl"
        />
        <div className="mt-12 md:mt-16">
          <Magnetic strength={0.4}>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("New project")}`}
              data-cursor="Open"
              className="press group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-orange text-pearl md:h-48 md:w-48"
            >
              <span className="absolute inset-0 origin-bottom scale-0 rounded-full bg-pearl transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-100" />
              <span className="relative meta !text-[0.8rem] font-semibold transition-colors duration-500 group-hover:text-navy">
                {cta.button}
              </span>
            </a>
          </Magnetic>
        </div>
        <a
          href={`mailto:${contact.email}`}
          className="link-line meta mt-10 text-pearl/80"
        >
          {contact.email}
        </a>
      </div>
    </section>
  );
}
