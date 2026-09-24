import type Lenis from "lenis";

export type SectionKey = "hero" | "services" | "servicesBg" | "journey" | "philosophy" | "cta";

/**
 * Shared, mutable runtime state. Written by DOM (scroll, pointer, hover) and
 * read inside the WebGL frame loop, so it deliberately lives outside React to
 * avoid re-rendering on every frame.
 */
export const store = {
  ready: false,
  reduced: false,
  tier: "high" as "high" | "low",
  lenis: null as Lenis | null,
  /** Pointer in normalized device coords (-1..1), plus a decaying velocity. */
  pointer: { x: 0, y: 0, vx: 0, vy: 0, active: false },
  progress: {
    hero: 0,
    services: 0,
    servicesBg: 0,
    journey: 0,
    philosophy: 0,
    cta: 0,
  } as Record<SectionKey, number>,
  activeService: 0,
  scrollVelocity: 0,
};

export const READY_EVENT = "app:ready";

export function markReady() {
  if (store.ready) return;
  store.ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** Runs `fn` once the loader has finished (immediately if it already has). */
export function onReady(fn: () => void) {
  if (store.ready) {
    fn();
    return () => {};
  }
  window.addEventListener(READY_EVENT, fn, { once: true });
  return () => window.removeEventListener(READY_EVENT, fn);
}

export function setActiveService(i: number) {
  store.activeService = i;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (store.lenis) store.lenis.scrollTo(el, { duration: 1.2 });
  else el.scrollIntoView({ behavior: store.reduced ? "auto" : "smooth" });
}
