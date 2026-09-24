import type Lenis from "lenis";

/**
 * Shared, mutable runtime state. Written by the DOM (scroll, pointer) and read
 * inside animation frames, so it lives outside React to avoid re-renders.
 */
export const store = {
  ready: false,
  reduced: false,
  tier: "high" as "high" | "low",
  lenis: null as Lenis | null,
  /** Pointer in normalized device coords (-1..1). */
  pointer: { x: 0, y: 0 },
  /** 0..1 progress of the hero scrolling out of view. */
  heroProgress: 0,
  scrollVelocity: 0,
};

export const READY_EVENT = "app:ready";

export function markReady() {
  if (store.ready) return;
  store.ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** Runs `fn` once the intro has finished (immediately if it already has). */
export function onReady(fn: () => void) {
  if (store.ready) {
    fn();
    return () => {};
  }
  window.addEventListener(READY_EVENT, fn, { once: true });
  return () => window.removeEventListener(READY_EVENT, fn);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (store.lenis) store.lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: store.reduced ? "auto" : "smooth" });
}
