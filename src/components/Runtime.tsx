"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { store } from "@/lib/store";
import { detectTier, prefersReducedMotion } from "@/lib/device";

/**
 * Boots the shared runtime once: device tier, reduced-motion flag, Lenis
 * smooth scroll driven by the GSAP ticker, and global pointer tracking.
 */
export function Runtime() {
  useEffect(() => {
    store.tier = detectTier();
    store.reduced = prefersReducedMotion();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    // Touch devices keep native scrolling; Lenis only smooths wheel input,
    // with a high lerp so it never feels behind the user's hand.
    if (!store.reduced) {
      lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, syncTouch: false });
      store.lenis = lenis;
      lenis.on("scroll", (l: Lenis) => {
        store.scrollVelocity = l.velocity;
        ScrollTrigger.update();
      });
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      store.pointer.vx = x - store.pointer.x;
      store.pointer.vy = y - store.pointer.y;
      store.pointer.x = x;
      store.pointer.y = y;
      store.pointer.active = true;
    };
    const onLeave = () => {
      store.pointer.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Fonts can shift layout after first paint; re-measure triggers then.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      store.lenis = null;
    };
  }, []);

  return null;
}
