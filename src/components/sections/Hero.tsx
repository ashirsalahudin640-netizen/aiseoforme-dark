"use client";

import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { SplitText } from "gsap/SplitText";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady, scrollToId } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/device";
import { hero, queries } from "@/content/site";
import WrapButton from "@/components/ui/wrap-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

gsap.registerPlugin(SplitText);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = root.current?.querySelector("h1");
      if (!title) return;
      const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "line-mask-inner" });
      gsap.set(split.lines, { yPercent: 110 });
      gsap.set("[data-intro]", { autoAlpha: 0, y: 18 });
      gsap.set(title, { autoAlpha: 1 });

      if (prefersReducedMotion()) {
        gsap.set(split.lines, { yPercent: 0 });
        gsap.set("[data-intro]", { autoAlpha: 1, y: 0 });
        return;
      }

      return onReady(() => {
        gsap
          .timeline({ delay: 0.15 })
          .to(split.lines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 })
          .to("[data-intro]", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }, 0.35);
      });
    },
    { scope: root },
  );

  const loop = [...queries, ...queries];

  return (
    <section
      id="hero"
      ref={root}
      className="relative z-10 flex min-h-[100dvh] flex-col justify-end pt-28"
    >
      <div className="frame grid grid-cols-1 gap-10 pb-10 md:grid-cols-12 md:pb-14">
        <div className="mt-[34vh] md:col-span-7 md:mt-0">
          <p
            data-intro
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1.5 pl-2.5 pr-3.5 text-[0.82rem] text-ink-soft backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-orange/60" />
              <span className="relative size-2 rounded-full bg-orange" />
            </span>
            Watching 1,284 buyer questions across five AI engines
          </p>
          <h1
            className="display invisible text-[clamp(2.6rem,6.6vw,6.4rem)] text-ink"
            aria-label={hero.title.join(" ")}
          >
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p data-intro className="lede mt-7">
            {hero.intro}
          </p>
          <div data-intro className="mt-9 flex flex-wrap items-center gap-4">
            <WrapButton href="#contact">Check my AI visibility</WrapButton>
            <InteractiveHoverButton
              type="button"
              onClick={() => scrollToId("work")}
              className="press h-[60px] border-line bg-white px-7 text-[0.95rem] font-medium text-ink"
            >
              See the results
            </InteractiveHoverButton>
          </div>
        </div>
      </div>

      {/* Questions people are asking right now, and who the engine cited. */}
      <div data-intro className="marquee relative border-y border-line bg-white/55 backdrop-blur-sm">
        <div className="marquee-track flex w-max">
          {loop.map((item, i) => (
            <div
              key={i}
              aria-hidden={i >= queries.length}
              className="flex shrink-0 items-center gap-3 border-r border-line px-7 py-4 text-[0.92rem]"
            >
              <span className="text-ink-soft">“{item.q}”</span>
              <ArrowUpRight aria-hidden="true" size={14} className="text-ink-faint" />
              <span className="font-medium text-ink">
                Cited: <span className="text-orange-deep">{item.cited}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
