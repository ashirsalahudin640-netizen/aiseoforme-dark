"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { markReady } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/device";
import { Logo } from "@/components/ui/Logo";

const SEEN_KEY = "aisfm:intro-seen";
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/**
 * First-visit intro on bright orange: three digit columns roll up to 100,
 * then the whole panel wipes away with the "hop" ease to uncover the hero.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

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

    document.documentElement.style.overflow = "hidden";
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const cols = el.querySelectorAll<HTMLElement>(".digit-col");
    const [hundreds, tens, ones] = Array.from(cols);
    const step = (col: HTMLElement, n: number) => ({ yPercent: (-100 / col.children.length) * n });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "hop" } });
    tl.to(".loader-bar", { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0)
      .to(ones, { ...step(ones, 20), duration: 2.2, ease: "power2.inOut" }, 0)
      .to(tens, { ...step(tens, 10), duration: 2.2, ease: "power2.inOut" }, 0)
      .to(hundreds, { ...step(hundreds, 1), duration: 0.6 }, 1.6)
      .to(".loader-logo", { yPercent: -120, duration: 0.8 }, 2.3)
      .to(".loader-count", { yPercent: -120, duration: 0.8 }, 2.35)
      .add(() => {
        markReady();
        document.documentElement.style.overflow = "";
      }, 2.7)
      .to(el, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1.2 }, 2.6)
      .add(() => {
        el.style.display = "none";
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      });

    // Hold just before the wipe until the page has actually loaded.
    let isLoaded = false;
    loaded.then(() => (isLoaded = true));
    tl.add(() => {
      if (isLoaded) return;
      tl.pause();
      loaded.then(() => tl.play());
    }, 2.2);
    tl.play();

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[90] bg-orange text-pearl"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="frame absolute inset-x-0 top-6 overflow-hidden">
        <div className="loader-logo">
          <Logo tone="pearl" />
        </div>
      </div>
      <div className="frame absolute inset-x-0 bottom-6 flex items-end justify-between gap-6 overflow-hidden md:bottom-8">
        <p className="loader-count note max-w-[22ch] text-pearl/85">
          Getting you found — by people and by AI.
        </p>
        <div className="loader-count display flex h-[0.86em] overflow-hidden text-[30vw] leading-[0.86] md:text-[16rem]">
          <DigitColumn digits={[0, 1]} />
          <DigitColumn digits={[...DIGITS, 0]} />
          <DigitColumn digits={[...DIGITS, ...DIGITS, 0]} />
        </div>
      </div>
      <div className="loader-bar absolute inset-x-0 bottom-0 h-[6px] origin-left scale-x-0 bg-pearl" />
    </div>
  );
}

function DigitColumn({ digits }: { digits: number[] }) {
  return (
    <div className="h-[0.86em] overflow-hidden">
      <div className="digit-col flex flex-col">
        {digits.map((d, i) => (
          <span key={i} className="block h-[0.86em]">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
