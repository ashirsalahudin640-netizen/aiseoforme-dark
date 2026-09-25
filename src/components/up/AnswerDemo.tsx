"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Sparkle } from "@phosphor-icons/react";
import { demo } from "@/content/site";
import { cn } from "@/lib/utils";
import { EngineOrbit } from "./EngineOrbit";
import { RiseText } from "./RiseText";
import { FilmFrame } from "./FilmFrame";

/** Streams the answer word by word once the card is on screen. */
function Streamed({ text, run }: { text: string; run: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  // The parent remounts this per question, so the count always starts at zero.
  const [count, setN] = useState(0);
  const n = reduce ? words.length : count;
  useEffect(() => {
    if (!run || reduce) return;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= words.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [text, run, reduce, words.length]);
  const done = n >= words.length;
  return (
    <p className="min-h-[7.5em] text-[0.98rem] leading-relaxed text-ink">
      {words.slice(0, n).join(" ")}
      {!done && <span className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-navy" />}
    </p>
  );
}

export function AnswerDemo() {
  const [q, setQ] = useState(0);
  const [seen, setSeen] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const item = demo[q];

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="demo" className="px-2 py-3 md:px-3">
      <FilmFrame
        name="lattice"
        className="min-h-[100dvh]"
        overlay="bg-[linear-gradient(90deg,rgba(14,10,50,0.85)_0%,rgba(14,10,50,0.45)_45%,rgba(14,10,50,0.1)_100%)]"
      >
        <div className="grid min-h-[inherit] items-center gap-12 px-5 py-24 md:px-10 lg:grid-cols-[1fr_1.05fr] lg:px-14">
          <div>
            <h2 className="display max-w-[13ch] text-[clamp(2.3rem,4.6vw,4.2rem)] font-medium text-white">
              <RiseText text="Ask the question your customers ask." />
            </h2>
            <p className="mt-6 max-w-[30rem] text-[1.05rem] leading-relaxed text-white/75">
              These are real prompt patterns from our clients’ categories. Pick one and watch who the engine
              recommends, and which sources it trusts to say so.
            </p>
            <div className="mt-9 flex flex-col gap-2" role="tablist" aria-label="Example questions">
              {demo.map((d, i) => (
                <button
                  key={d.q}
                  type="button"
                  role="tab"
                  aria-selected={i === q}
                  onClick={() => setQ(i)}
                  className={cn(
                    "press max-w-[30rem] rounded-2xl border px-4 py-3 text-left text-[0.92rem] transition-colors duration-200",
                    i === q
                      ? "border-white/40 bg-white text-ink"
                      : "border-white/15 bg-white/[0.06] text-white/80 backdrop-blur-md hover:bg-white/[0.12]",
                  )}
                >
                  {d.q}
                </button>
              ))}
            </div>
          </div>

          <div ref={card} className="relative flex justify-center lg:justify-end lg:pr-16">
            <div className="absolute inset-y-0 right-16 hidden w-full max-w-[34rem] lg:block">
              <EngineOrbit rx={330} ry={300} />
            </div>
            <motion.div layout style={{ borderRadius: 24 }} className="ui-card spot relative w-full max-w-[34rem] overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-ink">
                  <span className="grid size-7 place-items-center rounded-full bg-navy text-white">
                    <Sparkle size={13} weight="fill" aria-hidden="true" />
                  </span>
                  Answer engine
                </span>
                <span className="inline-flex items-center gap-1.5 text-[0.72rem] text-ink-soft">
                  <span className="breathe size-1.5 rounded-full bg-emerald-500" /> Live example
                </span>
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={q}
                  initial={{ opacity: 0, transform: "translateY(6px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="p-5"
                >
                  <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-pearl px-4 py-2.5 text-[0.9rem] text-ink">
                    {item.q}
                  </div>
                  <div className="mt-5">
                    <Streamed text={item.answer} run={seen} />
                  </div>
                  <p className="eyebrow mt-4 text-[0.62rem] text-ink-faint">Sources</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.sources.map((s, i) => (
                      <span
                        key={s.name}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem]",
                          s.ours ? "bg-haze font-medium text-orange-deep ring-1 ring-orange/30" : "bg-pearl text-ink-soft",
                        )}
                      >
                        <span className="tabular text-[0.65rem] opacity-70">{i + 1}</span>
                        {s.name}
                        {s.ours && <span className="rounded-full bg-orange px-1.5 text-[0.6rem] text-white">Client</span>}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="m-3 mt-1 flex items-center gap-3 rounded-2xl border border-line py-2 pl-4 pr-2 text-[0.85rem] text-ink-faint">
                <span className="flex-1">Ask a follow-up…</span>
                <span className="grid size-8 place-items-center rounded-xl bg-orange text-white">
                  <ArrowUp size={14} weight="bold" aria-hidden="true" />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </FilmFrame>
    </section>
  );
}
