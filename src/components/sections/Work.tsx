"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { hasFinePointer } from "@/lib/device";
import { contact, work, type CaseStudy } from "@/content/site";
import { RevealLines } from "@/components/ui/RevealLines";

function Card({ item, index }: { item: CaseStudy; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const media = useRef<HTMLDivElement>(null);

  // Gentle 3D tilt toward the pointer.
  useEffect(() => {
    const el = ref.current!;
    const m = media.current!;
    if (!hasFinePointer() || store.reduced) return;
    const rx = gsap.quickTo(m, "rotationX", { duration: 0.8, ease: "power3.out" });
    const ry = gsap.quickTo(m, "rotationY", { duration: 0.8, ease: "power3.out" });
    gsap.set(m, { transformPerspective: 1200 });
    const move = (e: PointerEvent) => {
      const r = m.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const tall = index % 2 === 1;
  return (
    <a
      ref={ref}
      href={`mailto:${contact.email}?subject=${encodeURIComponent(`Case study: ${item.client}`)}`}
      data-cursor="View"
      className="work-card group block"
      aria-label={`${item.client} — ${item.title}. Request the full case study.`}
    >
      <div
        ref={media}
        className={`work-media relative overflow-hidden rounded-[1.25rem] bg-pearl-deep ${tall ? "aspect-[4/5]" : "aspect-[5/4]"}`}
      >
        <div className="work-parallax absolute inset-[-8%_0]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 768px) 46vw, 92vw"
            className="object-cover transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover:scale-[1.07]"
          />
        </div>
        <div className="absolute inset-0 bg-orange opacity-0 mix-blend-multiply transition-opacity duration-500 ease-[var(--ease-out)] group-hover:opacity-40" />
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 md:inset-x-5 md:bottom-5">
          {item.tags.map((t) => (
            <span key={t} className="meta rounded-full bg-pearl/90 px-3 py-1.5 text-navy backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>
        <div className="absolute right-4 top-4 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-navy text-pearl opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 md:right-5 md:top-5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <p className="meta text-navy/50">
            {item.client} — {item.year}
          </p>
          <h3 className="mt-2 max-w-[24ch] text-[clamp(1.35rem,2.1vw,2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-navy transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">
            {item.title}
          </h3>
        </div>
        <p className="meta mt-1 max-w-[18ch] text-right text-orange">{item.result}</p>
      </div>
    </a>
  );
}

export function Work() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (store.reduced) return;
      gsap.utils.toArray<HTMLElement>(".work-media").forEach((m) => {
        gsap.fromTo(
          m,
          { clipPath: "inset(100% 0% 0% 0% round 20px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: m, start: "top 88%", once: true },
          },
        );
        gsap.fromTo(
          m.querySelector(".work-parallax"),
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="frame relative py-28 md:py-44">
      <div className="mb-16 grid gap-8 md:mb-28 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="meta mb-6 text-navy/50">(0{work.length}) Selected projects</p>
          <RevealLines
            id="work-title"
            lines={["Featured", "work"]}
            className="display text-[clamp(3.4rem,11vw,11rem)] text-navy"
          />
        </div>
        <p className="self-end text-[0.95rem] leading-relaxed text-navy/70 md:col-span-4">
          A few of the brands we&apos;ve helped get found — by search engines, by
          answer engines, and by the people using both.
        </p>
      </div>

      <div className="grid gap-16 md:grid-cols-2 md:gap-x-[6vw] md:gap-y-32">
        {work.map((item, i) => (
          <div key={item.client} className={i % 2 === 1 ? "md:mt-40" : ""}>
            <Card item={item} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
