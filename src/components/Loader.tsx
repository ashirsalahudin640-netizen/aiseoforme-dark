"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/device";

const SEEN_KEY = "aisfm:intro-seen";

/**
 * First-visit intro: a quiet counter on pearl, then an orange panel sweeps up
 * and away to uncover the hero. Skipped on repeat visits and reduced motion.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}

    if (seen || prefersReducedMotion()) {
      el.style.display = "none";
      markReady();
      return;
    }

    store_lock(true);
    const counter = { v: 0 };
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const tl = gsap.timeline({ paused: true });
    tl.to(counter, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(counter.v);
        count.current!.textContent = String(v).padStart(3, "0");
        bar.current!.style.transform = `scaleX(${counter.v / 100})`;
      },
    })
      .to([count.current, bar.current], { opacity: 0, duration: 0.3, ease: "power2.out" })
      .fromTo(
        panel.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" },
        "<",
      )
      .add(() => {
        el.style.background = "transparent";
        markReady();
        store_lock(false);
      })
      .to(panel.current, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "expo.inOut",
      })
      .add(() => {
        el.style.display = "none";
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      });

    // Let the counter run, but hold near the end until the page has loaded.
    let isLoaded = false;
    loaded.then(() => {
      isLoaded = true;
    });
    tl.add(() => {
      if (isLoaded) return;
      tl.pause();
      loaded.then(() => tl.play());
    }, 1.2);
    tl.play();

    return () => {
      tl.kill();
      store_lock(false);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[90] bg-pearl"
    >
      <div className="frame absolute inset-x-0 bottom-10 flex items-end justify-between">
        <span className="meta text-navy/60">AI SEO For Me — loading</span>
        <span ref={count} className="display text-[18vw] leading-none text-navy md:text-[9rem]">
          000
        </span>
      </div>
      <div
        ref={bar}
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-orange"
      />
      <div
        ref={panel}
        className="absolute inset-0 bg-orange"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      />
    </div>
  );
}

function store_lock(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
