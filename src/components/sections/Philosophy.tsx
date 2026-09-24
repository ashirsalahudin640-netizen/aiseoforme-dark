"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { philosophy } from "@/content/site";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  useSectionProgress(ref, "philosophy");

  useGSAP(
    () => {
      const [l1, l2] = gsap.utils.toArray<HTMLElement>(".phil-line");
      const stats = gsap.utils.toArray<HTMLElement>(".phil-stat-value");

      // Count stats up once they come into view.
      stats.forEach((el) => {
        const target = Number(el.dataset.value);
        const decimals = el.dataset.value?.includes(".") ? 1 : 0;
        const suffix = el.dataset.suffix ?? "";
        if (store.reduced) {
          el.textContent = target.toFixed(decimals) + suffix;
          return;
        }
        const o = { v: 0 };
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = o.v.toFixed(decimals) + suffix;
          },
        });
      });

      if (store.reduced) return;

      // The two lines drift apart as the section passes.
      gsap.fromTo(l1, { xPercent: 6 }, {
        xPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(l2, { xPercent: -6 }, {
        xPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Scroll speed skews the type, then it settles.
      const skew1 = gsap.quickTo(l1, "skewX", { duration: 0.6, ease: "power3.out" });
      const skew2 = gsap.quickTo(l2, "skewX", { duration: 0.6, ease: "power3.out" });
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -350);
          skew1(v);
          skew2(v);
        },
        onLeave: () => (skew1(0), skew2(0)),
        onLeaveBack: () => (skew1(0), skew2(0)),
      });
      return () => st.kill();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-hidden pb-[45vh] pt-32 md:pt-56"
    >
      <h2 id="about-title" className="display text-[clamp(4rem,17vw,19rem)] text-navy">
        <span className="phil-line block whitespace-nowrap pl-[var(--gutter)]">{philosophy.lines[0]}</span>
        <span className="phil-line block whitespace-nowrap pr-[var(--gutter)] text-right">
          <span className="text-orange">beyond</span> search.
        </span>
      </h2>

      <div className="frame mt-20 grid gap-14 md:mt-32 md:grid-cols-12">
        <p className="meta text-navy/50 md:col-span-3">(About the studio)</p>
        <p className="text-[clamp(1.25rem,2vw,1.9rem)] font-medium leading-[1.25] tracking-[-0.025em] text-navy md:col-span-8 md:col-start-5">
          {philosophy.body}
        </p>
      </div>

      <dl className="frame mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3 md:mt-28">
        {philosophy.stats.map((s) => (
          <div key={s.label} className="border-t border-navy/15 pt-5">
            <dt className="meta text-navy/50">{s.label}</dt>
            <dd
              className="phil-stat-value display mt-4 text-[clamp(3rem,6vw,6rem)] text-navy"
              data-value={s.value}
              data-suffix={s.suffix}
            >
              0{s.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
