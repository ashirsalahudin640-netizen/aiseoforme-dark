"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";

/**
 * Endless type band. Drifts slowly, surges with scroll speed and follows the
 * scroll direction. Lerped in the GSAP ticker, so there's one RAF loop.
 */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (store.reduced) return;
    const el = track.current!;
    let x = 0;
    let speed = 0;
    let dir = -1;
    const tick = (_t: number, dt: number) => {
      const v = store.scrollVelocity;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      const target = 0.6 + Math.min(Math.abs(v) * 0.9, 14);
      speed += (target - speed) * 0.08;
      x += dir * speed * (dt / 16.67);
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  const row = (copy: number) =>
    items.map((w, i) => (
      <span key={`${copy}-${i}`} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
        <span className="px-[0.35em]">{w}</span>
        <svg viewBox="0 0 10 10" className="h-[0.28em] w-[0.28em] shrink-0" aria-hidden="true">
          <rect x="1" y="1" width="8" height="8" rx="1.6" fill="currentColor" transform="rotate(45 5 5)" />
        </svg>
      </span>
    ));

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}
