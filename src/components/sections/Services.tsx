"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { services } from "@/content/site";
import { FluidMorphBg } from "@/components/ui/fluid-morph-bg";
import { BorderBeam } from "@/components/ui/border-beam";

/**
 * Pinned horizontal gallery (animmaster "scroll hijack"): vertical scroll pans
 * the six services sideways. Scrub is smoothed so the track glides, never snaps.
 * Phones and reduced motion get a plain vertical stack.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        if (store.reduced) return;
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        // Each card's image drifts against the pan for depth.
        gsap.utils.toArray<HTMLElement>(".svc-img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, {
            xPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".svc-card"),
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        });
        return () => ScrollTrigger.refresh();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="services" aria-labelledby="services-title" className="relative overflow-hidden">
      {/* Warm liquid backdrop in the logo colours; the cards are crystal glass over it. */}
      <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden="true">
        <FluidMorphBg
          duration={9}
          backgroundColor="#fff3e6"
          colors={["#ffe2c4", "#ffc58f", "#ff9a3c", "#ff7d00", "#ffb266", "#2a27a8", "#0b076e"]}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-white/35" aria-hidden="true" />
      <div className="flex min-h-[100dvh] flex-col justify-center py-24 min-[900px]:py-0">
        <div
          ref={track}
          className="flex flex-col gap-6 px-[var(--gutter)] min-[900px]:w-max min-[900px]:flex-row min-[900px]:items-stretch min-[900px]:gap-8"
        >
          <div className="flex flex-col justify-between gap-10 min-[900px]:w-[34vw] min-[900px]:py-4 min-[900px]:pr-10">
            <div>
              <p className="eyebrow mb-5 text-ink">What we do</p>
              <h2 id="services-title" className="display text-[clamp(3rem,6vw,6.5rem)] text-ink">
                Six ways to be <span className="text-crystal">found.</span>
              </h2>
            </div>
            <p className="max-w-[34ch] text-[1.05rem] leading-relaxed text-ink">
              One team for every surface where search now happens — from the crawl to the citation.
              Scroll to move through them.
            </p>
          </div>

          {services.map((s, i) => (
            <article
              key={s.title}
              className="svc-card crystal group relative flex flex-col overflow-hidden rounded-3xl min-[900px]:h-[76vh] min-[900px]:w-[min(38vw,560px)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden min-[900px]:aspect-auto min-[900px]:h-[48%]">
                <div className="svc-img absolute inset-y-0 -left-[10%] -right-[10%]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 900px) 40vw, 92vw"
                    loading="eager"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <BorderBeam size={260} duration={9 + i} colorFrom="#ff7d00" colorTo="#0b076e" borderWidth={1.5} />
              <div className="flex flex-1 flex-col justify-between gap-6 p-7 md:p-9">
                <div>
                  <p className="font-mono text-[0.8rem] text-orange">
                    {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.6rem,2.3vw,2.3rem)] font-light leading-[1.05] tracking-[-0.03em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">{s.body}</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="rounded-full border border-line px-3 py-1 text-[0.8rem] text-ink-soft">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <div className="hidden w-[6vw] shrink-0 min-[900px]:block" aria-hidden="true" />
        </div>

        <div className="frame absolute inset-x-0 bottom-8 hidden min-[900px]:block" aria-hidden="true">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-line">
            <span ref={bar} className="block h-full origin-left scale-x-0 bg-gradient-to-r from-orange to-navy" />
          </div>
        </div>
      </div>
    </section>
  );
}
