"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { markReady, store } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/device";
import { SCENE_EVENT } from "./SceneLayer";
import { Logo } from "./ui/Logo";

/**
 * A short first-load curtain: counts while the 3D scene compiles, then wipes
 * upward. Capped so a slow GPU never holds the page hostage.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    store.lenis?.stop();

    if (prefersReducedMotion()) {
      el.style.display = "none";
      store.lenis?.start();
      markReady();
      return;
    }

    const counter = { v: 0 };
    let sceneReady = false;
    let done = false;
    const onScene = () => {
      sceneReady = true;
    };
    window.addEventListener(SCENE_EVENT, onScene, { once: true });

    // Count to 90 quickly, then wait for the scene (max 1.6s more) before finishing.
    const count = gsap.to(counter, {
      v: 90,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => render(counter.v),
      onComplete: () => waitForScene(),
    });

    function render(v: number) {
      if (num.current) num.current.textContent = String(Math.round(v)).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
    }

    let waited = 0;
    function waitForScene() {
      const tick = () => {
        waited += gsap.ticker.deltaRatio(60) / 60;
        if (sceneReady || waited > 1.6) {
          gsap.ticker.remove(tick);
          finish();
        }
      };
      gsap.ticker.add(tick);
    }

    function finish() {
      if (done) return;
      done = true;
      gsap
        .timeline({
          onComplete: () => {
            if (el) el.style.display = "none";
          },
        })
        .to(counter, { v: 100, duration: 0.25, ease: "power2.out", onUpdate: () => render(counter.v) })
        .add(() => {
          store.lenis?.start();
          markReady();
        })
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "hop" }, "+=0.05");
    }

    return () => {
      count.kill();
      window.removeEventListener(SCENE_EVENT, onScene);
    };
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-white frame py-6 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <Logo withWordmark />
      <div>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-[18rem] text-sm leading-relaxed text-ink-soft">
            Asking the engines who they trust.
          </p>
          <span
            ref={num}
            className="display text-[clamp(4rem,14vw,11rem)] leading-[0.8] text-ink tabular-nums"
          >
            00
          </span>
        </div>
        <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-pearl-deep">
          <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-orange" />
        </div>
      </div>
    </div>
  );
}
