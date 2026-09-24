"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { useSectionProgress } from "@/lib/useSectionProgress";
import { philosophy } from "@/content/site";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const read = useRef<HTMLParagraphElement>(null);
  useSectionProgress(ref, "philosophy");

  useGSAP(
    () => {
      const [l1, l2] = gsap.utils.toArray<HTMLElement>(".phil-line");
      const stats = gsap.utils.toArray<HTMLElement>(".phil-stat-value");

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

      // Scroll-read: each word lights up as the reader reaches it.
      const words = gsap.utils.toArray<HTMLElement>(".read-word", read.current);
      words.forEach((w) => (w.style.opacity = "0.14"));
      const readST = ScrollTrigger.create({
        trigger: read.current,
        start: "top 80%",
        end: "bottom 45%",
        scrub: true,
        onUpdate: (self) => {
          const n = words.length;
          words.forEach((w, i) => {
            const local = gsap.utils.clamp(0, 1, self.progress * n - i);
            w.style.opacity = String(0.14 + local * 0.86);
          });
        },
      });

      // The two lines drift apart as the section passes.
      gsap.fromTo(l1, { xPercent: 4 }, {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center top", scrub: true },
      });
      gsap.fromTo(l2, { xPercent: -4 }, {
        xPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center top", scrub: true },
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
      return () => {
        st.kill();
        readST.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="about"
      aria-labelledby="about-title"
      className="relative overflow-hidden pb-[40vh] pt-32 md:pt-52"
    >
      <h2 id="about-title" className="display text-[clamp(4.2rem,18vw,20rem)] text-orange">
        <span className="phil-line block whitespace-nowrap pl-[var(--gutter)]">{philosophy.lines[0]}</span>
        <span className="phil-line outline-type block whitespace-nowrap pr-[var(--gutter)] text-right">
          {philosophy.lines[1]}
        </span>
      </h2>

      <div className="frame mt-24 grid gap-10 md:mt-36 md:grid-cols-12">
        <p className="text-[1.05rem] font-semibold text-orange-hot md:col-span-3">About the studio</p>
        <p
          ref={read}
          className="text-[clamp(1.6rem,3vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-roast md:col-span-9"
        >
          {philosophy.body.split(" ").map((w, i) => (
            <span key={i} className="read-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <dl className="frame mt-24 grid grid-cols-1 gap-10 sm:grid-cols-3 md:mt-32">
        {philosophy.stats.map((s) => (
          <div key={s.label} className="border-t-2 border-orange pt-5">
            <dt className="text-[1rem] font-semibold text-roast-soft">{s.label}</dt>
            <dd
              className="phil-stat-value display mt-3 text-[clamp(3.4rem,7vw,7rem)] text-orange"
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
