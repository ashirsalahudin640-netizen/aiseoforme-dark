"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CaretDown,
  CheckCircle,
  Circle,
  CloudArrowUp,
  MagnifyingGlass,
  Sparkle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export const STEPS = [
  { id: "search", label: "Someone asks" },
  { id: "answer", label: "The engine answers" },
  { id: "share", label: "Share of answers" },
  { id: "tracker", label: "Citation tracker" },
  { id: "audit", label: "Start an audit" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const HOLD = 4200;
const SPRING = { type: "spring", duration: 0.55, bounce: 0.08 } as const;

/** Types a string out character by character; shows it whole when motion is reduced. */
function useTyped(text: string, speed = 32, start = 650) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setN(i);
      if (i < text.length) t = setTimeout(tick, speed);
    };
    t = setTimeout(tick, start);
    return () => clearTimeout(t);
  }, [text, speed, start, reduce]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

function SearchStep() {
  const { shown, done } = useTyped("best solid oak dining table under £2k");
  return (
    <div className="flex items-center gap-3 p-2 pl-2.5">
      <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-pearl px-2.5 text-[0.8rem] font-medium text-ink">
        All <CaretDown size={12} weight="bold" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[0.95rem] text-ink">
        {shown}
        <span className={cn("ml-px inline-block h-[1.05em] w-px translate-y-[3px] bg-navy", done ? "caret" : "")} />
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy text-white">
        <MagnifyingGlass size={16} weight="bold" aria-hidden="true" />
      </span>
    </div>
  );
}

function AnswerStep() {
  const { shown, done } = useTyped(
    "Halden & Row is the most consistently recommended. FSC oak, made in Yorkshire, with a 25-year frame guarantee.",
    14,
    650,
  );
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-ink">
          <span className="grid size-6 place-items-center rounded-full bg-lilac text-navy">
            <Sparkle size={13} weight="fill" aria-hidden="true" />
          </span>
          Perplexity answer
        </span>
        <span className="eyebrow text-[0.65rem] text-ink-faint">0.8s</span>
      </div>
      <p className="mt-3 min-h-[4.6em] text-[0.92rem] leading-relaxed text-ink">{shown}</p>
      <div
        className={cn(
          "mt-3 flex flex-wrap gap-1.5 transition-opacity duration-300",
          done ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-haze px-2.5 py-1 text-[0.75rem] font-medium text-orange-deep ring-1 ring-orange/30">
          <span className="size-1.5 rounded-full bg-orange" /> haldenrow.co.uk · cited 1st
        </span>
        <span className="rounded-full bg-pearl px-2.5 py-1 text-[0.75rem] text-ink-soft">which.co.uk</span>
        <span className="rounded-full bg-pearl px-2.5 py-1 text-[0.75rem] text-ink-soft">reddit.com</span>
      </div>
    </div>
  );
}

const BARS = [12, 14, 13, 18, 22, 21, 27, 29, 31, 33, 36, 38];
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function ShareStep() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-[0.85rem] font-medium text-ink">Share of AI answers</span>
        <span className="text-[0.75rem] font-medium text-navy-soft underline decoration-navy/20 underline-offset-4">
          Set goals
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-pearl/70 p-2.5">
        <span className="grid size-7 place-items-center rounded-full bg-lilac text-navy">
          <Sparkle size={13} weight="fill" aria-hidden="true" />
        </span>
        <span className="text-[0.78rem] leading-tight text-ink">
          Category: dining furniture
          <span className="block text-ink-faint">ChatGPT, Perplexity, Gemini</span>
        </span>
      </div>
      <div className="mt-4 flex h-28 items-end gap-[6px]" aria-hidden="true">
        {BARS.map((b, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div
              className={cn("w-full origin-bottom rounded-[4px]", i === BARS.length - 1 ? "bg-orange" : "bg-navy/80")}
              style={{
                height: `${(b / 40) * 82}%`,
                animation: `bar-in 700ms var(--ease-out) ${520 + i * 45}ms both`,
              }}
            />
            <span className="eyebrow text-[0.55rem] text-ink-faint">{MONTHS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <p className="tabular text-[1.35rem] font-semibold leading-none tracking-tight text-ink">
          38.4<span className="text-[0.85rem] font-medium text-ink-soft">%</span>
        </p>
        <p className="text-[0.75rem] font-medium text-emerald-700">+21.7 pts since audit</p>
      </div>
    </div>
  );
}

const ROWS = [
  { engine: "ChatGPT", prompt: "solid oak table uk", pos: "1st", ok: true },
  { engine: "Perplexity", prompt: "best oak dining brand", pos: "1st", ok: true },
  { engine: "Gemini", prompt: "oak table 25 yr warranty", pos: "2nd", ok: true },
  { engine: "AI Overviews", prompt: "fsc oak furniture", pos: "none", ok: false },
];

function TrackerStep() {
  return (
    <div className="p-3">
      <div className="mb-2 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[0.8rem] text-ink-faint">
        <MagnifyingGlass size={14} aria-hidden="true" /> Filter prompts
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1fr_1.4fr_0.6fr_0.8fr] gap-2 bg-navy px-3 py-2 text-[0.68rem] font-medium text-white/85">
          <span>Engine</span>
          <span>Prompt</span>
          <span>Rank</span>
          <span>Status</span>
        </div>
        {ROWS.map((r, i) => (
          <motion.div
            key={r.engine}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "grid grid-cols-[1fr_1.4fr_0.6fr_0.8fr] items-center gap-2 border-t border-line px-3 py-2.5 text-[0.75rem]",
              i === 1 && "bg-pearl/70",
            )}
          >
            <span className="font-medium text-ink">{r.engine}</span>
            <span className="truncate text-ink-soft">{r.prompt}</span>
            <span className="tabular text-ink">{r.pos}</span>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[0.68rem] font-medium",
                r.ok ? "bg-emerald-50 text-emerald-700" : "bg-haze text-orange-deep",
              )}
            >
              {r.ok ? "Cited" : "Gap"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const ENGINES = [
  { name: "ChatGPT", on: true },
  { name: "Perplexity", on: true },
  { name: "Gemini", on: true },
  { name: "AI Overviews", on: false },
];

function AuditStep() {
  return (
    <div className="p-5">
      <p className="text-[0.95rem] font-medium text-ink">Start an AI visibility audit</p>
      <div className="mt-3 rounded-xl border border-line px-3 py-2">
        <span className="block text-[0.65rem] text-ink-faint">Brand</span>
        <span className="flex items-center justify-between text-[0.85rem] text-ink">
          Halden &amp; Row <CaretDown size={12} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-[0.78rem] font-medium text-ink">Engines to check</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {ENGINES.map((e) => (
          <span
            key={e.name}
            className={cn(
              "flex items-center justify-between rounded-lg border px-2.5 py-2 text-[0.75rem]",
              e.on ? "border-navy/25 bg-lilac/60 text-navy" : "border-line text-ink-soft",
            )}
          >
            {e.name}
            {e.on ? (
              <CheckCircle size={15} weight="fill" aria-hidden="true" />
            ) : (
              <Circle size={15} aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-navy/25 py-2.5 text-[0.75rem] text-ink-soft">
        <CloudArrowUp size={15} aria-hidden="true" /> Upload sitemap <span className="text-ink-faint">or paste URL</span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[0.78rem] text-ink-soft">Cancel</span>
        <span className="rounded-lg bg-orange px-3.5 py-2 text-[0.78rem] font-medium text-white">Run audit</span>
      </div>
    </div>
  );
}

const VIEWS: Record<StepId, { el: () => React.ReactNode; w: string }> = {
  search: { el: () => <SearchStep />, w: "w-[min(420px,calc(100vw-3.5rem))]" },
  answer: { el: () => <AnswerStep />, w: "w-[min(380px,calc(100vw-3.5rem))]" },
  share: { el: () => <ShareStep />, w: "w-[min(340px,calc(100vw-3.5rem))]" },
  tracker: { el: () => <TrackerStep />, w: "w-[min(440px,calc(100vw-3.5rem))]" },
  audit: { el: () => <AuditStep />, w: "w-[min(360px,calc(100vw-3.5rem))]" },
};

/**
 * One white product surface floating over the scene. Following the Upstream
 * reel, a change happens in three beats: the content fades to white, the
 * empty card (briefly frosted) reshapes itself, then the new content settles in.
 *
 * Pass `index` to drive it from scroll; without it the card advances on a timer.
 */
const OUT_MS = 170;
const MORPH_MS = 380;

export function HeroStage({
  className,
  index,
  onSelect,
  showDots = true,
}: {
  className?: string;
  index?: number;
  onSelect?: (i: number) => void;
  showDots?: boolean;
}) {
  const [own, setOwn] = useState(0);
  const [shown, setShown] = useState(index ?? 0);
  const [morphing, setMorphing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const controlled = index !== undefined;
  const target = controlled ? index : own;
  // Derived, not stored: while the target differs from what is shown, the content is leaving.
  const leaving = target !== shown;

  useEffect(() => {
    if (!leaving) return;
    const t1 = setTimeout(
      () => {
        setShown(target);
        setMorphing(true);
      },
      reduce ? 0 : OUT_MS,
    );
    return () => clearTimeout(t1);
  }, [leaving, target, reduce]);

  useEffect(() => {
    if (!morphing) return;
    const t = setTimeout(() => setMorphing(false), reduce ? 0 : MORPH_MS);
    return () => clearTimeout(t);
  }, [morphing, shown, reduce]);

  useEffect(() => {
    const el = root.current;
    if (!el || controlled) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [controlled]);

  useEffect(() => {
    if (controlled || paused || !visible || reduce) return;
    const t = setTimeout(() => setOwn((n) => (n + 1) % STEPS.length), HOLD);
    return () => clearTimeout(t);
  }, [own, paused, visible, reduce, controlled]);

  const select = (n: number) => (onSelect ? onSelect(n) : setOwn(n));
  const step = STEPS[shown];
  const view = VIEWS[step.id];
  const hidden = leaving || morphing;

  return (
    <div
      ref={root}
      className={cn("flex flex-col items-center", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div
        layout
        transition={SPRING}
        style={{ borderRadius: 20 }}
        data-morph={morphing}
        className={cn(
          "ui-card spot relative overflow-hidden transition-[background-color,backdrop-filter] duration-300",
          "data-[morph=true]:bg-white/60 data-[morph=true]:backdrop-blur-xl",
          view.w,
        )}
        aria-live="polite"
        aria-label={`Product preview: ${step.label}`}
      >
        <motion.div
          key={step.id}
          layout="position"
          initial={{ opacity: 0, transform: "translateY(6px)" }}
          animate={
            hidden
              ? { opacity: 0, transform: "translateY(0px)", transition: { duration: OUT_MS / 1000, ease: "easeOut" } }
              : { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } }
          }
        >
          {view.el()}
        </motion.div>
      </motion.div>

      {showDots && (
        <div className="mt-5 flex items-center gap-1.5 rounded-full bg-white/15 p-1.5 backdrop-blur-md" role="tablist" aria-label="Preview steps">
          {STEPS.map((s, n) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={n === target}
              aria-label={s.label}
              onClick={() => select(n)}
              className="press relative grid h-6 place-items-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)]",
                  n === target ? "w-6 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
