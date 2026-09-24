"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";

/**
 * Bends every `[data-skew]` element with scroll speed, then lets it settle.
 * One ticker callback for the whole page. Put `data-skew` on a wrapper that
 * has no transform of its own, since this owns its `transform`.
 */
export function VelocitySkew() {
  useGSAP(() => {
    if (store.reduced) return;
    let els = Array.from(document.querySelectorAll<HTMLElement>("[data-skew]"));
    let current = 0;
    const refresh = () => (els = Array.from(document.querySelectorAll<HTMLElement>("[data-skew]")));
    window.addEventListener("resize", refresh);
    const tick = () => {
      const target = gsap.utils.clamp(-5, 5, store.scrollVelocity * -0.12);
      current += (target - current) * 0.12;
      if (Math.abs(current) < 0.01 && Math.abs(target) < 0.01) {
        if (current !== 0) {
          current = 0;
          els.forEach((el) => (el.style.transform = ""));
        }
        return;
      }
      const v = `skewY(${current.toFixed(2)}deg) scale(${(1 + Math.abs(current) * 0.004).toFixed(4)})`;
      els.forEach((el) => (el.style.transform = v));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", refresh);
    };
  });
  return null;
}
