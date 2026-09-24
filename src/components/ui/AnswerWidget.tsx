"use client";

import { useEffect, useRef, useState } from "react";
import { heroQueries } from "@/content/site";
import { onReady, store } from "@/lib/store";

type Phase = "typing" | "thinking" | "answer";

/**
 * A tiny AI-search moment: a query types itself, the engine "thinks", then an
 * answer lands citing a client. Cycles on its own; the button skips ahead.
 */
export function AnswerWidget({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const [started, setStarted] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => onReady(() => setTimeout(() => setStarted(true), 1400)), []);

  useEffect(() => {
    if (!started) return;
    const item = heroQueries[index];
    const clear = () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
    clear();
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

    if (store.reduced) {
      later(() => {
        setTyped(item.q);
        setPhase("answer");
      }, 0);
    } else {
      later(() => {
        setTyped("");
        setPhase("typing");
      }, 0);
      Array.from(item.q).forEach((_, i) => later(() => setTyped(item.q.slice(0, i + 1)), 40 + i * 42));
      const typedAt = 40 + item.q.length * 42;
      later(() => setPhase("thinking"), typedAt + 250);
      later(() => setPhase("answer"), typedAt + 1100);
    }
    later(() => setIndex((i) => (i + 1) % heroQueries.length), (store.reduced ? 0 : 40 + item.q.length * 42) + 6500);
    return clear;
  }, [index, started]);

  const item = heroQueries[index];

  return (
    <div
      className={`w-full md:w-[400px] rounded-[1.4rem] border border-orange/25 bg-pearl/85 p-4 shadow-[0_24px_60px_-30px_rgba(255,98,0,0.55)] backdrop-blur-md ${className ?? ""}`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-full bg-pearl-warm px-4 py-2.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-orange">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p className="min-h-[1.4em] flex-1 truncate text-[0.95rem] font-medium text-roast">
          {typed}
          {phase === "typing" && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-orange" />}
        </p>
      </div>

      <div className="relative mt-3 min-h-[6.5rem] px-1">
        {phase === "thinking" && (
          <div className="flex items-center gap-2 pt-3 text-[0.9rem] text-roast-soft">
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange"
                  style={{ animationDelay: `${d * 120}ms` }}
                />
              ))}
            </span>
            Reading 214 sources
          </div>
        )}
        {phase === "answer" && (
          <div key={index} className="answer-in">
            <p className="text-[0.95rem] leading-snug text-roast">{item.a}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange px-3 py-1 text-[0.8rem] font-semibold text-pearl">
                Cited: {item.source}
              </span>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % heroQueries.length)}
                className="press text-[0.85rem] font-semibold text-orange-hot underline-offset-4 hover:underline"
              >
                Ask another
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes answer-in { from { opacity: 0; transform: translateY(8px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
        .answer-in { animation: answer-in 500ms var(--ease-out) both; }
      `}</style>
    </div>
  );
}
