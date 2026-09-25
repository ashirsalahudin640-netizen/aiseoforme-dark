"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo";
import { markReady, store } from "@/lib/store";
import { NANO_READY } from "./NanoField";

/**
 * Covers the page while the particle engine boots, so the first thing anyone
 * sees is deliberate: the mark draws itself, a hairline tracks real readiness,
 * then the cover wipes upward onto a hero that is already running.
 * Full length on the first visit of a session, short on reloads.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let first = true;
    try {
      first = !sessionStorage.getItem("aib-intro");
      sessionStorage.setItem("aib-intro", "1");
    } catch {}
    const minMs = reduce ? 0 : first ? 1150 : 550;
    el.dataset.short = first ? "false" : "true";

    html.classList.add("intro-lock");
    store.lenis?.stop();

    let ready = false;
    let done = false;
    let prog = 0;
    const t0 = performance.now();
    const onReady = () => (ready = true);
    window.addEventListener(NANO_READY, onReady);
    const fallback = setTimeout(onReady, 4000);

    const release = () => {
      html.classList.remove("intro-lock");
      store.lenis?.start();
    };

    const finish = () => {
      gsap.ticker.remove(tick);
      if (reduce) {
        gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: release });
        markReady();
        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            el.style.display = "none";
            release();
          },
        })
        .to(mark.current, { scale: 0.92, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
        .call(markReady, [], 0.3)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "hop" }, 0.25);
    };

    const tick = () => {
      // Creep toward 82% while booting, then run home once the engine is ready.
      prog += ((ready ? 1 : 0.82) - prog) * (ready ? 0.14 : 0.035);
      if (bar.current) bar.current.style.transform = `scaleX(${prog})`;
      if (!done && ready && prog > 0.985 && performance.now() - t0 > minMs) {
        done = true;
        finish();
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener(NANO_READY, onReady);
      clearTimeout(fallback);
      release();
    };
  }, []);

  return (
    <div
      ref={root}
      className="intro fixed inset-0 z-[95] grid place-items-center bg-[#07051f]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div ref={mark} className="flex flex-col items-center gap-8">
        <svg viewBox={LOGO_VIEWBOX} className="intro-mark w-[min(46vw,220px)] overflow-visible">
          <path d={LOGO_PATHS.base} pathLength={1} className="intro-path" stroke="#c9c6ff" />
          <path d={LOGO_PATHS.arc} pathLength={1} className="intro-path intro-accent" stroke="#ff7d00" />
          <path d={LOGO_PATHS.stem} pathLength={1} className="intro-path intro-accent" stroke="#ff7d00" />
          <path d={LOGO_PATHS.dot} pathLength={1} className="intro-path intro-accent" stroke="#ff7d00" />
        </svg>
        <div className="h-px w-[min(46vw,220px)] overflow-hidden bg-white/10">
          <div ref={bar} className="h-full origin-left bg-orange" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
