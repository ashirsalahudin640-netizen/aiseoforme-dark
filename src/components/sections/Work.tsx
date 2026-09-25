"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer } from "@/lib/device";
import { work } from "@/content/site";

/** Case-study index with a photo that follows the pointer (desktop) or sits inline (touch). */
export function Work() {
  const list = useRef<HTMLUListElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = list.current;
    const f = follower.current;
    const s = strip.current;
    if (!el || !f || !s || !hasFinePointer()) return;

    const xTo = gsap.quickTo(f, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(f, "y", { duration: 0.5, ease: "power3.out" });
    gsap.set(f, { xPercent: -50, yPercent: -50, scale: 0.8, autoAlpha: 0 });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));
    const enters = rows.map((row, i) => {
      const fn = () => {
        gsap.to(s, { yPercent: -100 * i, duration: 0.55, ease: "power3.out", overwrite: true });
      };
      row.addEventListener("pointerenter", fn);
      return () => row.removeEventListener("pointerenter", fn);
    });
    const show = (e: PointerEvent) => {
      gsap.set(f, { x: e.clientX, y: e.clientY });
      gsap.to(f, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    };
    const hide = () => gsap.to(f, { autoAlpha: 0, scale: 0.8, duration: 0.2, ease: "power2.out", overwrite: "auto" });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", show);
    el.addEventListener("pointerleave", hide);
    return () => {
      enters.forEach((off) => off());
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", show);
      el.removeEventListener("pointerleave", hide);
    };
  }, []);

  return (
    <section id="work" className="relative z-10 bg-white py-24 md:py-36">
      <div className="frame">
        <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12">
          <h2 className="display text-[clamp(2.1rem,4.6vw,4.2rem)] md:col-span-7">Brands the engines now quote.</h2>
          <p className="lede md:col-span-4 md:col-start-9 md:self-end">
            Four recent engagements, from a furniture maker to a travel marketplace with nine thousand pages.
          </p>
        </div>

        <ul ref={list} className="border-t border-line">
          {work.map((w) => (
            <li
              key={w.id}
              data-row
              className="group grid gap-4 border-b border-line py-8 transition-colors duration-200 md:grid-cols-12 md:items-center md:gap-6 md:py-10 md:hover:bg-pearl/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:hidden">
                <Image src={w.image} alt={w.alt} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="md:col-span-3 md:pl-4">
                <p className="text-[1.05rem] font-medium text-ink">{w.client}</p>
                <p className="text-sm text-ink-faint">{w.sector}</p>
              </div>
              <h3 className="display text-[clamp(1.3rem,2.2vw,1.9rem)] md:col-span-5">{w.title}</h3>
              <p className="flex items-center gap-3 text-[0.98rem] text-ink-soft md:col-span-4 md:justify-end md:pr-4 md:text-right">
                <span className="size-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
                {w.result}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={follower}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[260px] w-[360px] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(22,23,27,0.4)] md:block"
        style={{ visibility: "hidden" }}
      >
        <div ref={strip} className="h-full w-full">
          {work.map((w) => (
            <div key={w.id} className="relative h-full w-full">
              <Image src={w.image} alt="" fill sizes="360px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
