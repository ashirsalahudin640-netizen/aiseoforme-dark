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

    // Wheel gets a short, responsive lerp; touch keeps native scrolling.
    if (!store.reduced) {
      lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1.05, anchors: true });
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
