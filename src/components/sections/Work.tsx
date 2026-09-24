"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { contact, work, type CaseStudy } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";

function Card({ item, index }: { item: CaseStudy; index: number }) {
  return (
    <a
      href={`mailto:${contact.email}?subject=${encodeURIComponent(`Case study: ${item.client}`)}`}
      data-cursor="View"
      aria-label={`${item.client}: ${item.title}. Request the full case study.`}
      className="work-card group absolute left-1/2 top-1/2 block aspect-[4/5] w-[min(88vw,1000px)] sm:max-h-[68vh] overflow-hidden rounded-[1.75rem] bg-orange shadow-[0_40px_80px_-40px_rgba(122,50,0,0.45)] sm:aspect-[16/9]"
      style={{ zIndex: work.length - index }}
    >
      <div data-skew className="absolute inset-[-4%]">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 768px) 1080px, 88vw"
          priority={index === 0}
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.05]"
        />
      </div>
      {/* Warm scrim keeps pearl type legible on any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-hot/85 via-orange/20 to-transparent" />
      <div className="absolute inset-x-5 bottom-5 grid gap-4 text-pearl md:inset-x-9 md:bottom-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[1rem] font-semibold opacity-90">
            {item.client}, {item.year}
          </p>
          <h3 className="display mt-2 max-w-[18ch] text-[clamp(1.9rem,4.2vw,4.2rem)] !leading-[0.92]">
            {item.title}
          </h3>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="max-w-[26ch] text-[1rem] font-medium leading-snug md:text-right">{item.result}</p>
          <ul className="flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full bg-pearl px-3 py-1 text-[0.8rem] font-semibold text-orange-hot">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </a>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      const n = cards.length;
      gsap.set(cards, { xPercent: -50, yPercent: -50, transformPerspective: 1000, transformOrigin: "50% 0%" });
      if (store.reduced) return;

      // One progress value drives the whole stack.
      const render = (p: number) => {
        const t = p * (n - 1);
        cards.forEach((card, i) => {
          const d = i - t;
          if (d < 0) {
            const k = Math.min(1, -d);
            gsap.set(card, { yPercent: -50 - 135 * k, rotationX: 38 * k, scale: 1 - 0.08 * k, autoAlpha: 1 - k * 0.2 });
          } else {
            gsap.set(card, { yPercent: -50 - 6 * d, rotationX: 0, scale: 1 - 0.07 * d, autoAlpha: d > 2.5 ? 0 : 1 });
          }
        });
        const idx = Math.min(n, Math.floor(t + 0.5) + 1);
        if (counter.current) counter.current.textContent = String(idx).padStart(2, "0");
      };
      render(0);

      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: () => "+=" + window.innerHeight * n * 0.9,
        pin: ".work-stage",
        scrub: 1,
        onUpdate: (self) => render(self.progress),
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="relative">
      <div className="work-stage relative h-[100dvh] overflow-hidden">
        <div className="frame absolute inset-x-0 top-24 z-20 flex items-start justify-between gap-6 md:top-28">
          <RevealLines
            id="work-title"
            lines={["Featured work"]}
            className="display text-[clamp(2.4rem,5vw,5rem)] text-orange"
          />
          <p className="pt-2 text-[1.05rem] font-semibold tabular-nums text-roast">
            <span ref={counter}>01</span>
            <span className="text-roast-soft"> / {String(work.length).padStart(2, "0")}</span>
          </p>
        </div>
        <div className="absolute inset-0 top-[14vh]">
          {work.map((item, i) => (
            <Card key={item.client} item={item} index={i} />
          ))}
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #work .work-stage { height: auto; padding: 9rem 0 4rem; }
          #work .work-stage > div:last-child { position: static; display: grid; gap: 2rem; justify-items: center; }
          #work .work-card { position: relative; left: auto; top: auto; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
