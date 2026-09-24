"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { contact, work } from "@/content/site";
import { ImageRevealList } from "@/components/ui/image-reveal-list";

export function Work() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (store.reduced) return;
      gsap.utils.toArray<HTMLElement>(".case").forEach((row) => {
        const media = row.querySelector(".case-media");
        const img = row.querySelector(".case-img");
        const text = row.querySelectorAll(".case-text > *");
        // Mask reveal (animmaster): the frame opens from its lower edge.
        gsap.fromTo(
          media,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.4,
            ease: "hop",
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          },
        );
        gsap.fromTo(img, { scale: 1.25 }, {
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 80%", once: true },
        });
        // Gentle inner parallax while the row crosses the viewport.
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.fromTo(text, { y: 30, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 70%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="frame relative py-28 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-5">Selected work, 2024–2026</p>
          <h2 id="work-title" className="display text-[clamp(3rem,8vw,8rem)] text-ink">
            Brands we made <span className="text-crystal">findable.</span>
          </h2>
        </div>
        <div className="md:col-span-5">
          <ImageRevealList
            className="max-w-none"
            items={work.map((w, i) => ({
              id: w.id,
              number: String(i + 1).padStart(2, "0"),
              title: w.client,
              subtitle: w.sector,
              image: w.image,
              href: `#case-${w.id}`,
            }))}
          />
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-28 md:mt-36 md:gap-44">
        {work.map((w, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={w.id} id={`case-${w.id}`} className="case grid scroll-mt-24 items-center gap-8 md:grid-cols-12 md:gap-10">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(`Case study: ${w.client}`)}`}
                data-cursor="View"
                aria-label={`Request the ${w.client} case study`}
                className={`case-media group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-mist md:col-span-7 ${
                  flip ? "md:order-2 md:col-start-6" : ""
                }`}
              >
                <div className="case-img absolute inset-[-7%]">
                  <Image
                    src={w.image}
                    alt={w.alt}
                    fill
                    sizes="(min-width: 768px) 58vw, 92vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
                  />
                </div>
                <span className="crystal absolute left-5 top-5 rounded-full px-3 py-1.5 text-[0.8rem] font-medium text-ink">
                  {w.client}
                </span>
              </a>
              <div className={`case-text md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                <p className="eyebrow">
                  {w.sector}, {w.year}
                </p>
                <h3 className="mt-4 text-[clamp(1.7rem,2.6vw,2.6rem)] font-light leading-[1.08] tracking-[-0.03em] text-ink">
                  {w.title}
                </h3>
                <p className="mt-5 text-[1rem] leading-relaxed text-ink-soft">{w.detail}</p>
                <p className="mt-6 border-t border-line pt-5 text-[1.05rem] font-medium text-ink">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-orange align-middle" aria-hidden="true" />
                  {w.result}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {w.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.8rem] text-ink-soft">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
