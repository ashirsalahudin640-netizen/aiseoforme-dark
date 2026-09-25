"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Check, CircleNotch, Sparkle } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onReady, store } from "@/lib/store";
import WrapButton from "@/components/ui/wrap-button";
import { HeroStage } from "./HeroStage";
import { NanoField } from "./NanoField";
import { HudReticle } from "./HudReticle";

const QUESTION = "Who is the best AI SEO agency for my brand?";

const CHAPTERS = [
  {
    lead: "Someone ",
    accent: "asks.",
    tail: "",
    body: "Your next customer types a question into ChatGPT, Perplexity or Google instead of scrolling a list.",
  },
  {
    lead: "One answer ",
    accent: "comes back.",
    tail: "",
    body: "The engine writes a reply and names a handful of sources. Most brands are not one of them.",
  },
  {
    lead: "We make you the ",
    accent: "source.",
    tail: "",
    body: "Pages, facts and mentions shaped so engines trust you, quote you, and keep quoting you.",
  },
  {
    lead: "Every engine, ",
    accent: "every prompt.",
    tail: "",
    body: "We track where you are cited and where rivals are, then close the gaps every week.",
  },
  {
    lead: "",
    accent: "It starts",
    tail: " with an audit.",
    body: "We ask the engines about your brand and send back one honest picture, free.",
  },
];

type Phase = "wait" | "typing" | "thinking" | "answered";

const PIN_SCREENS = 6;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reticle = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const shape = useRef(0);
  const intro = useRef(0);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const chapterRef = useRef(0);
  const phaseRef = useRef<Phase>("wait");
  const userAsked = useRef(false);
  const [chapter, setChapter] = useState(0);
  const [phase, setPhaseState] = useState<Phase>("wait");
  const [query, setQuery] = useState(QUESTION);
  const [asked, setAsked] = useState(QUESTION);
  const [shock, setShock] = useState(0);
  const reduce = useReducedMotion();

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  // The answer forms: the galaxy collapses into the mark with a shockwave.
  const answer = (fast = false) => {
    if (phaseRef.current === "answered") return;
    setPhase("answered");
    if (input.current && !userAsked.current) input.current.value = QUESTION;
    setShock((k) => k + 1);
    gsap.to(intro, { current: 1, duration: fast ? 0.9 : 1.7, ease: "power2.inOut", overwrite: true });
    moveReticle(1, fast ? 0.9 : 1.6);
  };

  const moveReticle = (m: number, duration: number) => {
    if (!reticle.current || chapterRef.current > 0) return;
    gsap.to(reticle.current, { left: `${50 + 21 * m}%`, top: `${45 + 4 * m}%`, duration, ease: "power3.inOut", overwrite: true });
  };

  // Opening sequence, once the intro cover has lifted.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const off = onReady(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        intro.current = 1;
        setPhase("answered");
        return;
      }
      timers.push(
        setTimeout(() => {
          if (phaseRef.current !== "wait") return;
          setPhase("typing");
          let i = 0;
          const step = () => {
            if (phaseRef.current !== "typing") return;
            i += 1;
            if (input.current) input.current.value = QUESTION.slice(0, i);
            if (i < QUESTION.length) timers.push(setTimeout(step, 20 + Math.random() * 18));
            else {
              timers.push(setTimeout(() => phaseRef.current === "typing" && setPhase("thinking"), 200));
              timers.push(setTimeout(() => answer(), 650));
            }
          };
          step();
        }, 300),
      );
    });
    return () => {
      off();
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        pin: true,
        start: "top top",
        end: () => "+=" + window.innerHeight * PIN_SCREENS,
        onUpdate: (self) => {
          // Scrolling before the answer lands simply lands it, faster.
          if (self.progress > 0.01 && phaseRef.current !== "answered") answer(true);
          const raw = self.progress * CHAPTERS.length;
          const k = Math.floor(raw);
          const eased = Math.min(CHAPTERS.length, k + smooth(0.35, 0.9, raw - k));
          shape.current = eased;
          bars.current.forEach((b, i) => {
            if (b) b.style.transform = `scaleX(${clamp(eased - i)})`;
          });
          const m = Math.max(clamp(eased), intro.current);
          if (reticle.current && self.progress > 0.001) {
            reticle.current.style.left = `${50 + 21 * m}%`;
            reticle.current.style.top = `${45 + 4 * m}%`;
          }
          const c = Math.round(eased);
          if (c !== chapterRef.current) {
            chapterRef.current = c;
            setChapter(c);
          }
        },
      });
      return () => {
        trigger.current = null;
      };
    },
    { scope: root },
  );

  // Ask your own question: the answer dissolves back into the web and re-forms.
  const ask = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || phaseRef.current !== "answered") return;
    input.current?.blur();
    userAsked.current = true;
    setAsked(q);
    setPhase("thinking");
    gsap
      .timeline()
      .to(intro, { current: 0, duration: 0.7, ease: "power2.in", overwrite: true })
      .add(() => moveReticle(0, 0.7), 0)
      .add(() => {
        phaseRef.current = "thinking";
        answer();
      }, "+=0.35");
  };

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((i + 0.95) / CHAPTERS.length) * (st.end - st.start);
    if (store.lenis) store.lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const active = reduce ? 0 : chapter;
  const card = Math.max(0, active - 1);
  const shown = phase === "answered";
  const busy = phase === "typing" || phase === "thinking";

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className="relative h-[100dvh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_45%,#231d86_0%,#100c4d_42%,#07051f_100%)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(201,198,255,0.22)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_50%_45%,#000_10%,transparent_70%)]"
        aria-hidden="true"
      />
      <NanoField state={shape} intro={intro} className="absolute inset-0" />
      <HudReticle ref={reticle} />

      {/* The shockwave when the answer forms. */}
      <div className="pointer-events-none absolute left-1/2 top-[43%] size-0 lg:top-[45%]" aria-hidden="true">
        {shock > 0 && (
          <div key={shock}>
            <span className="shock" />
            <span className="shock" />
          </div>
        )}
      </div>

      {/* The question, asked live. */}
      <div
        className={`absolute inset-x-0 top-[92px] z-10 flex justify-center px-4 lg:inset-x-auto lg:bottom-[9vh] lg:right-[var(--gutter)] lg:top-auto lg:px-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
          active === 0 ? "opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="w-full max-w-[600px] lg:w-[min(520px,40vw)]">
          <form
            onSubmit={ask}
            data-state={phase}
            className={`ask-bar reveal relative flex items-center gap-2 overflow-hidden rounded-2xl border border-white/12 bg-[#0d0a3a]/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl ${
              phase === "wait" ? "" : "!opacity-100 ![transform:none]"
            }`}
          >
            <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-white/[0.08] px-3 py-2 text-[0.8rem] font-medium text-white/80 sm:inline-flex">
              <Sparkle size={13} weight="fill" className="text-orange" aria-hidden="true" />
              All engines
            </span>
            <label htmlFor="hero-ask" className="sr-only">
              Ask an AI engine a question
            </label>
            <input
              ref={input}
              id="hero-ask"
              defaultValue=""
              readOnly={!shown}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your category"
              autoComplete="off"
              className="min-w-0 flex-1 truncate bg-transparent px-2 text-[0.92rem] text-white outline-none placeholder:text-white/40 sm:text-[0.95rem]"
            />
            <button
              type="submit"
              aria-label="Ask"
              disabled={!shown}
              className="press grid size-9 shrink-0 place-items-center rounded-xl bg-orange text-white transition-colors duration-200 hover:bg-orange-deep disabled:opacity-90"
            >
              {busy ? (
                <CircleNotch size={15} weight="bold" className="think" aria-hidden="true" />
              ) : (
                <ArrowUp size={15} weight="bold" aria-hidden="true" />
              )}
            </button>
            {/* A scan line runs along the bottom edge while the engines read. */}
            <span className="ask-scan" aria-hidden="true" />
          </form>

          {/* Once answered: each engine ticks in, then the cited source. */}
          <div
            data-shown={shown}
            className="mt-3 flex flex-wrap items-center justify-center gap-1.5 lg:justify-end"
            aria-live="polite"
          >
            <span className="sr-only">{shown ? `Answered for ${asked}. Cited source: aiseoforme.com.` : ""}</span>
            {["ChatGPT", "Perplexity", "Gemini"].map((e, i) => (
              <span
                key={e}
                className={`reveal items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.75rem] text-white/75 inline-flex`}
                style={{ ["--d" as string]: `${500 + i * 90}ms` }}
                aria-hidden="true"
              >
                <Check size={11} weight="bold" className="text-orange" />
                {e}
              </span>
            ))}
            <span
              className="reveal inline-flex items-center gap-1.5 rounded-full bg-orange px-2.5 py-1 text-[0.75rem] font-medium text-white"
              style={{ ["--d" as string]: "800ms" }}
              aria-hidden="true"
            >
              aiseoforme.com cited 1st
            </span>
          </div>
        </div>
      </div>

      <div className="frame relative grid h-full grid-rows-[1fr_auto] pb-7 pt-24 md:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-1">
        {/* Copy: the answer first, then one chapter at a time. */}
        <div className="row-start-2 flex flex-col justify-end lg:row-start-1">
          <div className="relative min-h-[15rem] md:min-h-[19rem]" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {active === 0 ? (
                <motion.div
                  key="intro"
                  data-shown={shown}
                  exit={{ opacity: 0, transform: "translateY(-14px)", transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
                >
                  <p className="reveal inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/10 px-3 py-1.5 text-[0.82rem] text-white/85 [--d:200ms]">
                    <Sparkle size={12} weight="fill" className="text-orange" aria-hidden="true" />
                    The answer
                  </p>
                  <h1 className="mt-5 font-display text-[clamp(3rem,6.3vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
                    <span className="block overflow-hidden pb-[0.05em]">
                      <span className="line-up [--d:320ms]">Be the answer</span>
                    </span>
                    <span className="block overflow-hidden pb-[0.05em]">
                      <span className="line-up text-orange [--d:430ms]">AI gives.</span>
                    </span>
                  </h1>
                  <p className="reveal mt-6 max-w-[30rem] text-[1.05rem] leading-relaxed text-white/70 [--d:600ms]">
                    We get brands found on Google and cited by ChatGPT, Perplexity, Gemini and AI Overviews, at the
                    moment someone asks who to trust.
                  </p>
                  <div className="reveal mt-8 [--d:720ms]">
                    <WrapButton href="#contact" className="border-white/15 bg-white/[0.08] backdrop-blur-md">
                      Get your AI audit
                    </WrapButton>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, transform: "translateY(22px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0, transform: "translateY(-14px)", transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
                  transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-x-0 bottom-0 will-change-transform"
                >
                  <p className="font-display text-[1rem] tabular text-orange">
                    {active} / {CHAPTERS.length}
                  </p>
                  <h2 className="mt-3 font-display text-[clamp(2.4rem,5.6vw,5.4rem)] font-semibold leading-[0.93] tracking-[-0.04em]">
                    {CHAPTERS[active - 1].lead}
                    <span className="text-orange">{CHAPTERS[active - 1].accent}</span>
                    {CHAPTERS[active - 1].tail}
                  </h2>
                  <p className="mt-5 max-w-[28rem] text-[1.05rem] leading-relaxed text-white/70">{CHAPTERS[active - 1].body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`reveal mt-8 flex items-center gap-2 motion-reduce:hidden [--d:850ms]`} data-shown={shown}>
            {CHAPTERS.map((c, i) => (
              <button
                key={c.accent}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to chapter ${i + 1}: ${c.lead}${c.accent}${c.tail}`}
                className="group py-3"
              >
                <span className="relative block h-[3px] w-9 overflow-hidden rounded-full bg-white/15 transition-colors duration-200 group-hover:bg-white/30 md:w-14">
                  <span
                    ref={(el) => {
                      bars.current[i] = el;
                    }}
                    className="absolute inset-0 origin-left rounded-full bg-orange"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* The product card joins once the story starts, floating over the swarm. */}
        <div
          className={`row-start-1 flex items-start justify-center pt-[8vh] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] lg:items-end lg:justify-end lg:pb-[9vh] lg:pt-0 ${
            reduce || active >= 1 ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <HeroStage index={reduce ? undefined : card} showDots={!!reduce} />
        </div>
      </div>
    </section>
  );
}
