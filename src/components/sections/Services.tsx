"use client";

import { useRef, useState } from "react";
import { setActiveService } from "@/lib/store";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { useOrangeTone } from "@/lib/useOrangeTone";
import { marquee, services } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";
import { Marquee } from "@/components/ui/Marquee";

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  useSectionProgress(ref, "services", "top 65%", "bottom 35%");
  useSectionProgress(ref, "servicesBg", "top 80%", "bottom 50%");
  useOrangeTone(ref);

  const select = (i: number) => {
    setActiveService(i);
    setActive(i);
  };

  return (
    <section
      ref={ref}
      id="services"
      data-bg="orange"
      aria-labelledby="services-title"
      className="relative pb-28 pt-24 text-pearl md:pb-44 md:pt-32"
    >
      <Marquee
        items={marquee}
        className="display mb-20 text-[clamp(3.5rem,11vw,11rem)] text-pearl/95 md:mb-32"
      />

      <div className="frame grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <RevealLines
            id="services-title"
            lines={["Six ways", "to be found."]}
            className="display text-[clamp(3rem,8.5vw,8.5rem)]"
          />

          <ul
            className="mt-14 border-t border-pearl/35 md:mt-20"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            {services.map((s, i) => {
              const isActive = active === i;
              const dim = hovering && !isActive;
              return (
                <li key={s.title} className="border-b border-pearl/35">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`svc-${i}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    className="group flex w-full items-center gap-6 py-5 text-left md:py-6"
                  >
                    <span
                      className={`display text-[clamp(1.9rem,4.4vw,4.4rem)] !leading-[0.95] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                        isActive ? "translate-x-3 md:translate-x-5" : ""
                      } ${dim ? "opacity-40" : "opacity-100"}`}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-out)] ${
                        isActive ? "rotate-0 bg-pearl text-orange-hot" : "-rotate-45 bg-pearl/15 text-pearl"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`svc-${i}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out)] ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-5 pb-8 md:grid-cols-[1.4fr_1fr] md:pl-5">
                        <p className="max-w-[44ch] text-[1.05rem] leading-relaxed">{s.body}</p>
                        <ul className="flex flex-wrap content-start gap-2">
                          {s.points.map((p) => (
                            <li key={p} className="rounded-full border border-pearl/50 px-3 py-1.5 text-[0.85rem] font-medium">
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {/* The WebGL formation for the active service fills this column. */}
        <div className="hidden md:col-span-5 md:block" aria-hidden="true" />
      </div>
    </section>
  );
}
