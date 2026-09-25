"use client";

import { useEffect, useRef } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

const ENGINES = ["ChatGPT", "Perplexity", "Gemini", "Copilot", "AI Overviews"];

/**
 * The answer engines circling the answer. Chips travel an ellipse; the far
 * side of the orbit shrinks and dims so the ring reads in depth.
 */
export function EngineOrbit({ rx = 360, ry = 250 }: { rx?: number; ry?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const place = (t: number) => {
      chips.current.forEach((c, i) => {
        if (!c) return;
        const a = t * 0.22 + (i / ENGINES.length) * Math.PI * 2;
        const depth = (Math.sin(a) + 1) / 2; // 0 far, 1 near
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry * 0.42 + (depth - 0.5) * 30;
        c.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${0.78 + depth * 0.3})`;
        c.style.opacity = String(0.45 + depth * 0.55);
      });
    };
    place(0.6);
    if (reduce) return () => io.disconnect();
    const tick = (time: number) => {
      if (visible) place(time);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, [rx, ry]);

  return (
    <div ref={root} className="pointer-events-none absolute left-1/2 top-1/2 size-0" aria-hidden="true">
      <svg
        className="absolute -translate-x-1/2 -translate-y-1/2 overflow-visible"
        width={rx * 2}
        height={ry}
        viewBox={`${-rx} ${-ry / 2} ${rx * 2} ${ry}`}
      >
        <ellipse cx="0" cy="0" rx={rx} ry={ry * 0.42} fill="none" stroke="rgba(201,198,255,0.35)" strokeDasharray="2 7" />
        <ellipse cx="0" cy="0" rx={rx * 0.78} ry={ry * 0.3} fill="none" stroke="rgba(255,138,31,0.25)" />
      </svg>
      {ENGINES.map((e, i) => (
        <div
          key={e}
          ref={(el) => {
            chips.current[i] = el;
          }}
          className="absolute left-0 top-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-[#0c0940]/55 px-3 py-1.5 text-[0.8rem] font-medium text-white shadow-[0_8px_24px_-10px_rgba(0,0,0,0.5)] backdrop-blur-md will-change-transform"
        >
          <Sparkle size={11} weight="fill" className="text-orange" /> {e}
        </div>
      ))}
    </div>
  );
}
