"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIdle } from "@/lib/useIdle";
import { prefersReducedMotion } from "@/lib/device";
import { services } from "@/content/site";
import { IsoArt } from "@/components/illustrations/Iso";

const STICK = 96; // px from the top where each card settles

/** Sticky stacked cards: each new service slides over and gently pushes the last one back. */
export function Services() {
  const root = useRef<HTMLElement>(null);
  useIdle(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector("[data-card-body]"), {
          scale: 0.93,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: `top ${STICK + (i + 1) * 14}px`,
            scrub: true,
          },
        });
        gsap.to(card.querySelector("[data-card-shade]"), {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 60%",
            end: `top ${STICK + (i + 1) * 14}px`,
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="services"
      ref={root}
      className="relative z-10 rounded-t-[2.5rem] bg-pearl pb-[12vh] pt-24 shadow-[0_-30px_60px_-40px_rgba(22,23,27,0.25)] md:pt-32"
    >
      <div className="frame">
        <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12">
          <h2 className="display text-[clamp(2.1rem,4.6vw,4.2rem)] md:col-span-7">
            Five ways we get you quoted.
          </h2>
          <p className="lede md:col-span-4 md:col-start-9 md:self-end">
            Most agencies still sell rankings. We work on the whole path an engine takes, from crawling your
            site to deciding your name belongs in the answer.
          </p>
        </div>

        <div className="relative">
          {services.map((s, i) => (
            <article
              key={s.title}
              data-card
              className="sticky mb-8 last:mb-0"
              style={{ top: STICK + i * 14 }}
            >
              <div
                data-card-body
                className="relative origin-top overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_60px_-35px_rgba(22,23,27,0.35)] will-change-transform"
              >
                <div className="grid md:min-h-[min(68vh,560px)] md:grid-cols-2">
                  <div className="flex flex-col justify-between gap-10 p-7 md:p-12">
                    <div>
                      <p className="text-sm text-ink-faint">
                        {String(i + 1).padStart(2, "0")} of {String(services.length).padStart(2, "0")}
                      </p>
                      <h3 className="display mt-4 text-[clamp(1.7rem,3vw,2.8rem)]">{s.title}</h3>
                      <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {s.points.map((p) => (
                        <li
                          key={p}
                          className="rounded-full border border-line bg-pearl px-4 py-2 text-[0.88rem] text-ink"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative m-2 overflow-hidden rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_70%_20%,#ffe6d6_0%,#f6efe9_38%,#eceef1_100%)] md:m-3">
                    <IsoArt art={s.art} className="mx-auto h-full max-h-[440px] w-full max-w-[520px] p-4" />
                  </div>
                </div>
                <div
                  data-card-shade
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-pearl-deep/60 opacity-0"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
