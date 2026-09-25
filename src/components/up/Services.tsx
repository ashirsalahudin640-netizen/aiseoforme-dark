"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { services } from "@/content/site";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FilmFrame } from "./FilmFrame";
import { SERVICE_CARDS } from "./ServiceCards";
import { RiseText } from "./RiseText";

export function Services() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const n = services.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // One pinned stage; scroll progress picks the service, like chapters.
        trigger.current = ScrollTrigger.create({
          trigger: pin.current,
          pin: true,
          start: "top top",
          end: () => "+=" + window.innerHeight * (n - 1) * 0.8,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
            const a = Math.min(n - 1, Math.floor(self.progress * n));
            if (a !== activeRef.current) {
              activeRef.current = a;
              setActive(a);
            }
          },
        });
        return () => {
          trigger.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const choose = (i: number) => {
    const st = trigger.current;
    if (st) {
      const y = st.start + ((i + 0.5) / n) * (st.end - st.start);
      if (store.lenis) store.lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: "smooth" });
      return;
    }
    activeRef.current = i;
    setActive(i);
  };

  const Card = SERVICE_CARDS[services[active].art];

  return (
    <section ref={root} id="services" className="bg-pearl">
      <div ref={pin} className="frame flex min-h-[100dvh] items-center py-20 lg:py-6">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="display max-w-[17ch] text-[clamp(2.2rem,3.8vw,3.4rem)] font-medium text-navy">
              <RiseText text="Five disciplines with one outcome: you get quoted." />
            </h2>

            <div className="relative mt-10 pl-5">
              <div className="absolute inset-y-0 left-0 w-px bg-line" aria-hidden="true">
                <div ref={bar} className="h-full w-full origin-top bg-orange" style={{ transform: "scaleY(0)" }} />
              </div>
              <ul className="space-y-1">
                {services.map((s, i) => {
                  const on = i === active;
                  return (
                    <li key={s.title}>
                      <button
                        type="button"
                        onClick={() => choose(i)}
                        aria-expanded={on}
                        className="group w-full py-2.5 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              "size-2 rounded-full transition-[background-color,transform] duration-200 ease-[var(--ease-out)]",
                              on ? "scale-100 bg-orange" : "scale-75 bg-ink/15",
                            )}
                          />
                          <span
                            className={cn(
                              "text-[1.3rem] font-medium tracking-tight transition-colors duration-200 md:text-[1.5rem]",
                              on ? "text-ink" : "text-ink/35 group-hover:text-ink/60",
                            )}
                          >
                            {s.title}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out)]",
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <span className="overflow-hidden pl-5">
                            <span className="block max-w-[34rem] pt-2 text-[0.98rem] leading-relaxed text-ink-soft">{s.body}</span>
                            <span className="flex flex-wrap gap-x-4 gap-y-1 pb-2 pt-3">
                              {s.points.map((p) => (
                                <span key={p} className="inline-flex items-center gap-1.5 text-[0.85rem] text-ink">
                                  <Check size={13} weight="bold" className="text-orange-deep" aria-hidden="true" /> {p}
                                </span>
                              ))}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <FilmFrame
            name="earth"
            className="grid min-h-[30rem] place-items-center p-5 lg:min-h-[min(82dvh,46rem)]"
            overlay="bg-[radial-gradient(ellipse_at_center,rgba(7,5,31,0)_30%,rgba(7,5,31,0.55)_100%)]"
          >
            <motion.div
              layout
              transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
              style={{ borderRadius: 20 }}
              className="ui-card spot w-[min(360px,100%)] overflow-hidden"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  layout="position"
                  initial={{ opacity: 0, transform: "translateY(10px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.14 } }}
                  transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Card />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <p className="absolute bottom-5 left-6 text-[0.9rem] font-medium text-white/85">{services[active].title}</p>
          </FilmFrame>
        </div>
      </div>
    </section>
  );
}
