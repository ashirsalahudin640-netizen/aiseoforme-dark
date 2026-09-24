"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady, store } from "@/lib/store";
import { hasFinePointer } from "@/lib/device";

const BASE = { wght: 620, wdth: 88 };
const PEAK = { wght: 800, wdth: 100 };
const RADIUS = 260; // px of influence around the cursor

/**
 * Display headline whose letters swell toward the cursor using the variable
 * font's weight and width axes. Letters rise out of a mask on load and the
 * words scatter upward as the hero scrolls away.
 */
export function MagneticHeadline({
  lines,
  className,
  scrollTrigger,
}: {
  lines: string[];
  className?: string;
  /** Section element whose scroll drives the exit. */
  scrollTrigger?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const h = ref.current!;
      const chars = gsap.utils.toArray<HTMLElement>(".char", h);
      const words = gsap.utils.toArray<HTMLElement>(".word", h);
      const setVar = (el: HTMLElement, k: number) => {
        const w = BASE.wght + (PEAK.wght - BASE.wght) * k;
        const d = BASE.wdth + (PEAK.wdth - BASE.wdth) * k;
        el.style.fontVariationSettings = `"wght" ${w.toFixed(0)}, "wdth" ${d.toFixed(1)}, "opsz" 96`;
      };
      chars.forEach((c) => setVar(c, 0));
      if (store.reduced) return;

      // 1. Load: letters rise from alternating sides.
      const intro = gsap.fromTo(
        chars,
        { yPercent: (i: number) => (i % 2 ? -115 : 115), rotate: (i: number) => (i % 2 ? -10 : 10) },
        { yPercent: 0, rotate: 0, duration: 1.3, ease: "hop", stagger: 0.02, delay: 0.15, paused: true, immediateRender: true },
      );
      const stopReady = onReady(() => intro.play());

      // 2. Scroll: words scatter upward at different speeds.
      if (scrollTrigger?.current) {
        gsap.to(words, {
          y: (i: number) => -120 - (i % 3) * 90,
          rotate: (i: number) => (i % 2 ? -6 : 6),
          opacity: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: scrollTrigger.current, start: "top top", end: "70% top", scrub: 0.6 },
        });
      }

      // 3. Pointer: letters swell toward the cursor (lerped per letter).
      if (!hasFinePointer()) return stopReady;
      const level = chars.map(() => 0);
      let mx = -9999;
      let my = -9999;
      const onMove = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY;
      };
      const onLeave = () => {
        mx = my = -9999;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      let centers: { x: number; y: number }[] = [];
      const measure = () => {
        const hb = h.getBoundingClientRect();
        centers = chars.map((c) => {
          const r = c.getBoundingClientRect();
          return { x: r.left - hb.left + r.width / 2, y: r.top - hb.top + r.height / 2 };
        });
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(h);
      document.fonts?.ready.then(measure);

      const tick = () => {
        const hb = h.getBoundingClientRect();
        if (hb.bottom < 0) return;
        for (let i = 0; i < chars.length; i++) {
          const c = centers[i];
          if (!c) continue;
          const d = Math.hypot(mx - (hb.left + c.x), my - (hb.top + c.y));
          const target = Math.max(0, 1 - d / RADIUS) ** 1.6;
          const next = level[i] + (target - level[i]) * 0.12;
          if (Math.abs(next - level[i]) > 0.002) {
            level[i] = next;
            setVar(chars[i], next);
          }
        }
      };
      gsap.ticker.add(tick);

      return () => {
        stopReady();
        gsap.ticker.remove(tick);
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="line-mask" aria-hidden="true">
          <span className="line-inner whitespace-nowrap">
            {line.split(" ").map((word, wi, arr) => (
              <span key={wi} className="word inline-block">
                {Array.from(word).map((c, ci) => (
                  <span key={ci} className="char">
                    {c}
                  </span>
                ))}
                {wi < arr.length - 1 && <span className="char w-[0.24em]">&nbsp;</span>}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
