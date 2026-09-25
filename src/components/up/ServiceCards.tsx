"use client";

import { Bell, CheckCircle, FileText, Lightning, Sparkle } from "@phosphor-icons/react";
import type { Service } from "@/content/site";
import { cn } from "@/lib/utils";

function Head({ icon, title, meta }: { icon: React.ReactNode; title: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-ink">
        <span className="grid size-7 place-items-center rounded-full bg-lilac text-navy">{icon}</span>
        {title}
      </span>
      {meta && <span className="eyebrow text-[0.62rem] text-ink-faint">{meta}</span>}
    </div>
  );
}

function Answers() {
  return (
    <div className="p-5">
      <Head icon={<FileText size={14} weight="fill" />} title="Answer-ready page" meta="/oak-dining-tables" />
      <div className="mt-4 space-y-2" aria-hidden="true">
        <div className="h-2.5 w-3/4 rounded-full bg-ink/80" />
        <div className="h-2 w-full rounded-full bg-pearl-deep" />
        <div className="h-2 w-11/12 rounded-full bg-pearl-deep" />
      </div>
      <div className="mt-4 rounded-xl border-l-[3px] border-orange bg-haze/70 p-3">
        <p className="text-[0.8rem] leading-relaxed text-ink">
          Every table is built from FSC-certified English oak and carries a 25-year frame guarantee.
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-[0.7rem] font-medium text-orange-deep">
          <Sparkle size={11} weight="fill" aria-hidden="true" /> Quoted by 3 engines
        </span>
      </div>
      <div className="mt-3 space-y-2" aria-hidden="true">
        <div className="h-2 w-full rounded-full bg-pearl-deep" />
        <div className="h-2 w-2/3 rounded-full bg-pearl-deep" />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["FAQ schema", "Product schema", "Author entity"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-medium text-emerald-700">
            <CheckCircle size={11} weight="fill" aria-hidden="true" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const COVER = [
  { e: "ChatGPT", v: 82 },
  { e: "Perplexity", v: 74 },
  { e: "Gemini", v: 61 },
  { e: "AI Overviews", v: 55 },
  { e: "Copilot", v: 47 },
];

function Engines() {
  return (
    <div className="p-5">
      <Head icon={<Sparkle size={14} weight="fill" />} title="Engine coverage" meta="120 prompts" />
      <ul className="mt-4 space-y-3">
        {COVER.map((c, i) => (
          <li key={c.e}>
            <div className="flex justify-between text-[0.75rem]">
              <span className="text-ink">{c.e}</span>
              <span className="tabular text-ink-soft">{c.v}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-pearl-deep">
              <div
                className={cn("h-full origin-left rounded-full", i === 0 ? "bg-orange" : "bg-navy")}
                style={{ width: `${c.v}%`, animation: `grow-x 800ms var(--ease-out) ${i * 60}ms both` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Crawl() {
  const score = 96;
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="p-5">
      <Head icon={<Lightning size={14} weight="fill" />} title="Site health" meta="Crawled 2h ago" />
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="size-24 shrink-0 -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--pearl-deep)" strokeWidth="7" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--navy)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - score / 100)}
            style={{ animation: "ring-in 1s var(--ease-out) both", ["--c" as string]: c }}
          />
        </svg>
        <div>
          <p className="display tabular text-[2.2rem] font-medium leading-none text-ink">{score}</p>
          <p className="mt-1 text-[0.75rem] text-ink-soft">Technical score, up from 61</p>
        </div>
      </div>
      <dl className="mt-4 divide-y divide-line border-t border-line text-[0.75rem]">
        {[
          ["Pages indexed", "9,412 / 9,418"],
          ["Largest contentful paint", "1.8s"],
          ["Schema errors", "0"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2">
            <dt className="text-ink-soft">{k}</dt>
            <dd className="tabular font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const QUESTIONS = [
  "is oak better than walnut",
  "how long does solid oak last",
  "oak table for 8 people",
  "oil or lacquer finish",
  "fsc oak meaning",
];

function Content() {
  return (
    <div className="p-5">
      <Head icon={<FileText size={14} weight="fill" />} title="Question map" meta="Dining · 64 topics" />
      <div className="mt-5 flex justify-center">
        <span className="rounded-full bg-navy px-3.5 py-1.5 text-[0.8rem] font-medium text-white">oak dining tables</span>
      </div>
      <div className="mx-auto mt-2 h-4 w-px bg-navy/25" aria-hidden="true" />
      <div className="flex flex-wrap justify-center gap-1.5">
        {QUESTIONS.map((q, i) => (
          <span
            key={q}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[0.72rem]",
              i === 1 ? "border-orange/40 bg-haze text-orange-deep" : "border-line bg-white text-ink-soft",
            )}
            style={{ animation: `rise 500ms var(--ease-out) ${120 + i * 50}ms both` }}
          >
            {q}
          </span>
        ))}
      </div>
      <p className="mt-4 border-t border-line pt-3 text-[0.72rem] text-ink-soft">
        Next brief: <span className="font-medium text-ink">“How long does solid oak last?”</span>
      </p>
    </div>
  );
}

const ALERTS = [
  { t: "Perplexity started citing /pricing", when: "4 min", tone: "bg-emerald-500" },
  { t: "Schema repaired on 38 product pages", when: "1 h", tone: "bg-navy" },
  { t: "Competitor entered ChatGPT answers for “oak table uk”", when: "3 h", tone: "bg-orange" },
];

function Automation() {
  return (
    <div className="p-5">
      <Head icon={<Bell size={14} weight="fill" />} title="Overnight alerts" meta="Auto" />
      <ul className="mt-4 space-y-2">
        {ALERTS.map((a, i) => (
          <li
            key={a.t}
            className="flex items-start gap-3 rounded-xl border border-line p-3"
            style={{ animation: `rise 500ms var(--ease-out) ${i * 80}ms both` }}
          >
            <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", a.tone, i === 0 && "breathe")} />
            <span className="flex-1 text-[0.78rem] leading-snug text-ink">{a.t}</span>
            <span className="eyebrow shrink-0 text-[0.6rem] text-ink-faint">{a.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const SERVICE_CARDS: Record<Service["art"], () => React.ReactNode> = {
  answers: () => <Answers />,
  engines: () => <Engines />,
  crawl: () => <Crawl />,
  content: () => <Content />,
  automation: () => <Automation />,
};
