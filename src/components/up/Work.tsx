"use client";

import Image from "next/image";
import { useRef } from "react";
import { TrendUp } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { work } from "@/content/site";
import { cn } from "@/lib/utils";
import { RiseText } from "./RiseText";

/** Alternating panel widths keep the pan from feeling like a conveyor belt. */
const WIDTHS = ["lg:w-[46vw]", "lg:w-[34vw]", "lg:w-[40vw]", "lg:w-[34vw]"];

export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        // Vertical scroll pans the case studies sideways; each photo drifts
        // slightly slower than its frame for depth.
        const pan = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-img]", el).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: img, containerAnimation: pan, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="overflow-hidden bg-pearl">
      <div className="flex min-h-[100dvh] flex-col justify-center py-24 lg:py-0">
        <div
          ref={track}
          className="frame flex flex-col gap-16 lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:pr-[8vw]"
        >
          <div className="lg:w-[30vw] lg:shrink-0">
            <h2 className="display text-[clamp(2.4rem,4.6vw,4.6rem)] font-medium text-navy">
              <RiseText text="Brands that became the answer." />
            </h2>
            <p className="mt-6 max-w-[24rem] text-[1.05rem] leading-relaxed text-ink-soft">
              Four clients in four categories. Each started invisible in AI answers, and none of them bought more ads
              to get there.
            </p>
          </div>

          {work.map((c, i) => (
            <article key={c.id} className={cn("group w-full lg:shrink-0", WIDTHS[i % WIDTHS.length])}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-pearl-deep lg:aspect-auto lg:h-[62vh]">
                <div data-img className="absolute inset-y-0 -left-[8%] -right-[8%]">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(11,7,110,0.4),transparent_45%)]" />
                <div className="ui-card absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 pr-4 sm:right-auto sm:max-w-[22rem]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-haze text-orange-deep">
                    <TrendUp size={18} weight="bold" aria-hidden="true" />
                  </span>
                  <span className="text-[0.9rem] font-medium leading-snug text-ink">{c.result}</span>
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <h3 className="max-w-[26ch] text-[1.3rem] font-medium leading-snug tracking-tight text-ink">{c.title}</h3>
                <p className="shrink-0 pt-1 text-right text-[0.9rem] text-ink-faint">
                  {c.client}
                  <span className="block">{c.sector}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
