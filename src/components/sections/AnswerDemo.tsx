"use client";

import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Sparkle, ArrowUp, LinkSimple } from "@phosphor-icons/react";
import { demo, work } from "@/content/site";

type Phase = "typing" | "thinking" | "streaming" | "cited";

/** Brand names we highlight when the answer lands. */
const BRANDS = work.map((w) => w.client);

function highlight(text: string, on: boolean) {
  const brand = BRANDS.find((b) => text.includes(b));
  if (!brand) return text;
  const [before, after] = text.split(brand);
  return (
    <>
      {before}
      <span
        className="rounded-md px-1 transition-[background-color,color] duration-500 ease-[var(--ease-out)]"
        style={{ backgroundColor: on ? "#ffe6d6" : "transparent", color: on ? "#b33505" : undefined }}
      >
        {brand}
        {on && <sup className="ml-0.5 text-[0.7em] font-semibold text-orange">1</sup>}
      </span>
      {after}
    </>
  );
}

/** The looping assistant conversation. Isolated so its ticks never re-render the page. */
const Conversation = memo(function Conversation() {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [chars, setChars] = useState(0);
  const [words, setWords] = useState(0);

  const item = demo[idx];
  const answerWords = item.answer.split(" ");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setChars(item.q.length);
      setWords(answerWords.length);
      setPhase("cited");
      const t = setTimeout(() => setIdx((i) => (i + 1) % demo.length), 7000);
      return () => clearTimeout(t);
    }
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (chars < item.q.length) t = setTimeout(() => setChars((c) => c + 1), 26 + Math.random() * 30);
      else t = setTimeout(() => setPhase("thinking"), 350);
    } else if (phase === "thinking") {
      t = setTimeout(() => setPhase("streaming"), 900);
    } else if (phase === "streaming") {
      if (words < answerWords.length) t = setTimeout(() => setWords((w) => w + 1), 42);
      else t = setTimeout(() => setPhase("cited"), 250);
    } else {
      t = setTimeout(() => {
        setIdx((i) => (i + 1) % demo.length);
        setChars(0);
        setWords(0);
        setPhase("typing");
      }, 4200);
    }
    return () => clearTimeout(t);
  }, [inView, reduce, phase, chars, words, item.q.length, answerWords.length]);

  const cited = phase === "cited";
  const showAnswer = phase === "streaming" || cited;

  return (
    <div
      ref={box}
      className="relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_40px_80px_-40px_rgba(22,23,27,0.35)]"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <div className="flex items-center gap-2.5 text-[0.9rem] font-medium">
          <span className="grid size-7 place-items-center rounded-full bg-ink text-white">
            <Sparkle size={14} weight="fill" />
          </span>
          Answer engine
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {demo.map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i === idx ? "#ff5b14" : "rgba(22,23,27,0.12)" }}
            />
          ))}
        </div>
      </div>

      <div className="min-h-[420px] space-y-6 px-6 py-7 md:min-h-[440px] md:px-8">
        {/* Question */}
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-2xl rounded-br-md bg-pearl px-4 py-3 text-[0.98rem] text-ink">
            {item.q.slice(0, chars)}
            {phase === "typing" && <span className="caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-orange" />}
          </p>
        </div>

        {/* Thinking shimmer */}
        <AnimatePresence mode="popLayout">
          {phase === "thinking" && (
            <motion.div
              key="think"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {[92, 78, 60].map((w) => (
                <div
                  key={w}
                  className="h-3 animate-pulse rounded-full bg-gradient-to-r from-pearl-deep via-haze to-pearl-deep"
                  style={{ width: `${w}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer */}
        {showAnswer && (
          <div className="text-[1.02rem] leading-relaxed text-ink">
            {cited ? highlight(item.answer, true) : answerWords.slice(0, words).join(" ")}
          </div>
        )}

        {/* Sources */}
        <AnimatePresence>
          {cited && (
            <motion.ol
              key={`src-${idx}`}
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-wrap gap-2 pt-1"
              aria-label="Sources"
            >
              {item.sources.map((s, i) => (
                <li
                  key={s.name}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.82rem] ${
                    s.ours ? "border-orange/40 bg-haze text-orange-deep" : "border-line bg-white text-ink-soft"
                  }`}
                >
                  <span className="font-semibold">{i + 1}</span>
                  <LinkSimple size={12} aria-hidden="true" />
                  {s.name}
                </li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-4 mb-4 flex items-center justify-between rounded-full border border-line bg-pearl py-2 pl-5 pr-2 text-[0.92rem] text-ink-faint md:mx-6 md:mb-6">
        Ask anything
        <span className="grid size-9 place-items-center rounded-full bg-orange text-white" aria-hidden="true">
          <ArrowUp size={16} weight="bold" />
        </span>
      </div>
    </div>
  );
});

export function AnswerDemo() {
  return (
    <section id="answer" className="relative z-10 bg-pearl py-24 md:py-36">
      <div className="frame grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display text-[clamp(2.1rem,4.4vw,4rem)]">This is the new first page.</h2>
          <p className="lede mt-6">
            Your next customer asks one question and reads one answer. We engineer the sources behind it, so
            the name in that answer, and the link underneath it, is yours.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10">
            <div>
              <dt className="text-sm text-ink-soft">Share of AI answers, average client</dt>
              <dd className="display mt-2 text-[2.6rem] tabular-nums text-ink">31.4%</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Time to first citation</dt>
              <dd className="display mt-2 text-[2.6rem] tabular-nums text-ink">47 days</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Conversation />
        </div>
      </div>
    </section>
  );
}
