"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { store } from "@/lib/store";
import { detectTier, prefersReducedMotion } from "@/lib/device";

/**
 * Boots the shared runtime once: device tier, reduced-motion flag, Lenis
 * smooth scroll driven by the GSAP ticker (one RAF loop), and pointer tracking.
 */
export function Runtime() {
  useEffect(() => {
    store.tier = detectTier();
    store.reduced = prefersReducedMotion();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    // Touch keeps native scrolling; wheel input gets a light, responsive lerp.
    if (!store.reduced) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: 0 } });
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
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Fonts and images can shift layout after first paint; re-measure then.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("load", onLoad);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      store.lenis = null;
    };
  }, []);

  return null;
}
