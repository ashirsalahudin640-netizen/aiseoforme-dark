"use client";

import { useRef } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { queries } from "@/content/site";
import { AnswerCore } from "./AnswerCore";

const STATEMENT =
  "Search used to be ten blue links. Now it is one answer, written by a machine that quotes a handful of sources. Our job is to make sure one of them is you.";

const ENGINES = ["ChatGPT", "Perplexity", "Gemini", "AI Overviews", "Copilot", "ChatGPT"];

function QueryCard({ q, cited, engine }: { q: string; cited: string; engine: string }) {
  return (
    <li className="ui-card spot w-[19rem] shrink-0 p-4 md:w-[22rem]">
      <p className="text-[0.95rem] leading-snug text-ink">“{q}”</p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[0.8rem]">
        <span className="inline-flex items-center gap-1.5 text-ink-soft">
          <Sparkle size={12} weight="fill" className="text-navy" aria-hidden="true" /> {engine}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-orange-deep">
          <span className="size-1.5 rounded-full bg-orange" /> {cited}
        </span>
      </div>
    </li>
  );
}

function Row({ reverse }: { reverse?: boolean }) {
  const list = reverse ? [...queries].reverse() : queries;
  // Two copies side by side; the track slides by exactly one copy and loops.
  return (
    <div className="marquee overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className="marquee-track flex w-max gap-4 motion-reduce:animate-none"
        style={{ animationDuration: reverse ? "70s" : "58s", animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...list, ...list].map((item, i) => (
          <QueryCard key={i} q={item.q} cited={item.cited} engine={ENGINES[i % ENGINES.length]} />
        ))}
      </ul>
    </div>
  );
}

export function Shift() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", root.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(words, { opacity: 1 });
        progress.current = 1;
        return;
      }
      // Each word brightens as the reader reaches it, and the links fly into the core with it.
      ScrollTrigger.create({
        trigger: "[data-read]",
        start: "top 80%",
        end: "bottom 40%",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const p = self.progress * words.length;
          words.forEach((w, i) => {
            w.style.opacity = String(0.14 + 0.86 * gsap.utils.clamp(0, 1, p - i));
          });
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="shift" className="relative overflow-hidden rounded-b-[2.5rem] bg-[#07051f] py-24 md:rounded-b-[4rem] md:py-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(201,198,255,0.22)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_25%_40%,#000_10%,transparent_60%)]"
        aria-hidden="true"
      />
      <div className="frame relative">
        <div className="mx-auto grid max-w-[1400px] items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div className="relative h-[340px] sm:h-[420px] lg:h-[560px]">
            <AnswerCore progress={progress} className="absolute inset-0" />
            <p className="absolute bottom-2 left-0 text-[0.9rem] text-white/55">
              Ten links in. <span className="text-orange">One answer out.</span>
            </p>
          </div>
          <p
            data-read
            className="font-display text-[clamp(1.9rem,3.5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.035em] text-white"
          >
            {STATEMENT.split(" ").map((w, i) => (
              <span key={i} data-word className="opacity-[0.14]">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
        <p className="mx-auto mt-16 max-w-[1400px] text-[1rem] text-white/60">
          Questions people asked AI assistants this month, and the client each one named.
        </p>
      </div>
      <div className="mt-6 space-y-1">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
