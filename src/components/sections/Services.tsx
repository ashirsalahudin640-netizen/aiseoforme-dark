"use client";

import { useRef, useState } from "react";
import { setActiveService } from "@/lib/store";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { services } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  useSectionProgress(ref, "services", "top 65%", "bottom 35%");

  const select = (i: number) => {
    setActiveService(i);
    setActive(i);
  };

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-title"
      className="frame relative py-28 md:py-44"
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="meta mb-6 text-navy/50">(06) Services</p>
          <RevealLines
            id="services-title"
            lines={["Six ways", "to be found."]}
            className="display text-[clamp(3rem,8.5vw,8.5rem)] text-navy"
          />

          <ul
            className="mt-16 border-t border-navy/15 md:mt-24"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            {services.map((s, i) => {
              const isActive = active === i;
              const dim = hovering && !isActive;
              return (
                <li key={s.n} className="border-b border-navy/15">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`svc-${s.n}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                    className="group flex w-full items-baseline gap-4 py-5 text-left md:gap-8 md:py-6"
                  >
                    <span
                      className={`meta w-8 shrink-0 transition-colors duration-300 ${isActive ? "text-orange" : "text-navy/40"}`}
                    >
                      {s.n}
                    </span>
                    <span
                      className={`text-[clamp(1.7rem,4.2vw,4.1rem)] font-medium leading-none tracking-[-0.045em] transition-[opacity,transform,color] duration-500 ease-[var(--ease-out)] ${
                        isActive ? "translate-x-2 text-navy md:translate-x-4" : "text-navy"
                      } ${dim ? "opacity-25" : "opacity-100"}`}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`ml-auto h-3 w-3 shrink-0 self-center rounded-full transition-[transform,background-color] duration-500 ease-[var(--ease-out)] ${
                        isActive ? "scale-100 bg-orange" : "scale-50 bg-navy/20"
                      }`}
                    />
                  </button>
                  <div
                    id={`svc-${s.n}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out)] ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-5 pb-7 pl-12 md:grid-cols-[1.4fr_1fr] md:pl-16">
                        <p className="max-w-[46ch] text-[0.98rem] leading-relaxed text-navy/75">{s.body}</p>
                        <ul className="flex flex-col gap-1.5">
                          {s.points.map((p) => (
                            <li key={p} className="meta flex items-center gap-2 text-navy">
                              <span className="h-1 w-1 rounded-full bg-orange" />
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

        {/* The 3D formation for the active service sits in this column. */}
        <div className="pointer-events-none relative hidden md:col-span-5 md:block" aria-hidden="true">
          <div className="sticky top-[20vh] flex h-[60vh] items-end justify-end">
            <p className="meta text-right text-navy/50">
              <span className="text-orange">{services[active].n}</span> / 06
              <br />
              {services[active].short}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
