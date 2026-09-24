"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { store } from "@/lib/store";
import { hasFinePointer } from "@/lib/device";
import { useOrangeTone } from "@/lib/useOrangeTone";
import { contact } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { ScrambleText } from "@/components/ui/ScrambleText";

type Phase = "ask" | "scanning" | "answer";

const DOMAIN = /^(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?:\/.*)?$/i;

/** What the console reports while the audit request is being prepared. */
const consoleLines = (d: string) => [
  { t: `resolve ${d}`, r: "ok" },
  { t: "queue visibility audit", r: "queued" },
  { t: "engines  chatgpt  perplexity  gemini  ai-overviews", r: "4/4" },
  { t: "checks   crawl  entities  schema  citations", r: "4/4" },
  { t: "assign analyst", r: "done" },
  { t: "report eta", r: "48h" },
];
const SCAN_MS = 3200;

/**
 * Closing call to action as an answer-engine scanner: the visitor enters a
 * domain, a console prepares the audit, and the answer is a pre-filled request.
 */
export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const answerHeading = useRef<HTMLHeadingElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<Phase>("ask");
  const [domain, setDomain] = useState("");
  const [shown, setShown] = useState(0);
  const [pct, setPct] = useState(0);
  useOrangeTone(ref, "top 30%", "bottom 64px");

  // Panel grows from a rounded card to full bleed, smoothed with scrub: 1.
  useGSAP(
    () => {
      if (store.reduced) return;
      const st = { trigger: ref.current, start: "top bottom", end: "top top", scrub: 1 };
      gsap.fromTo(
        panel.current,
        { clipPath: "inset(10% 7% 10% 7% round 48px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: st },
      );
      gsap.fromTo(".cta-inner", { yPercent: 10, scale: 0.95 }, { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { ...st } });

      if (!hasFinePointer()) return;
      const gx = gsap.quickTo(glow.current, "x", { duration: 1, ease: "power3.out" });
      const gy = gsap.quickTo(glow.current, "y", { duration: 1, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = panel.current!.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        gx(x);
        gy(y);
        if (coords.current) coords.current.textContent = `x ${String(Math.round(x)).padStart(4, "0")}  y ${String(Math.round(y)).padStart(4, "0")}`;
      };
      panel.current!.addEventListener("pointermove", move);
      return () => panel.current?.removeEventListener("pointermove", move);
    },
    { scope: ref },
  );

  // Live UTC clock for the HUD.
  useEffect(() => {
    const tick = () => {
      if (clock.current) clock.current.textContent = new Date().toISOString().slice(11, 19) + " UTC";
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scan sequence: stream console lines and fill the progress bar.
  useEffect(() => {
    if (phase !== "scanning") return;
    const lines = consoleLines(domain).length;
    const timers: number[] = [];
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const t = Math.min(1, (now - start) / SCAN_MS);
      setPct(Math.round(t * 100));
      setShown(Math.min(lines, Math.floor(t * (lines + 0.6))));
      if (t < 1) raf = requestAnimationFrame(loop);
      else timers.push(window.setTimeout(() => setPhase("answer"), 350));
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [phase, domain]);

  useEffect(() => {
    if (phase === "answer") answerHeading.current?.focus();
  }, [phase]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const m = value.trim().match(DOMAIN);
    if (!m) {
      setError("Type a domain like yourbrand.com so we know where to look.");
      input.current?.focus();
      return;
    }
    setError("");
    setDomain(m[1].toLowerCase());
    setShown(0);
    setPct(0);
    setPhase(store.reduced ? "answer" : "scanning");
  };

  const reset = () => {
    setPhase("ask");
    setValue("");
    setTimeout(() => input.current?.focus(), 50);
  };

  const mail = `mailto:${contact.email}?subject=${encodeURIComponent(`AI visibility audit: ${domain}`)}&body=${encodeURIComponent(
    `Hi AI SEO For Me,\n\nPlease check how AI search engines see ${domain} and send the walkthrough.\n\nThanks!`,
  )}`;

  return (
    <section ref={ref} id="contact" aria-labelledby="cta-title" className="relative">
      <div
        ref={panel}
        data-bg="orange"
        className="cta-panel relative flex min-h-[100dvh] items-center overflow-hidden bg-orange text-pearl"
      >
        {/* Instrument layer: grid, sweep beam, cursor light, HUD frame */}
        <div aria-hidden="true" className="cta-grid pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className={`cta-beam pointer-events-none absolute inset-x-0 top-0 h-[18vh] ${phase === "scanning" ? "is-fast" : ""}`} />
        <div
          ref={glow}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -ml-[30vmax] -mt-[30vmax] h-[60vmax] w-[60vmax] rounded-full opacity-60"
          style={{
            background: "radial-gradient(closest-side, rgba(255,214,160,0.55), rgba(255,160,58,0.2) 60%, transparent)",
            transform: "translate(50vw, 50vh)",
          }}
        />
        <div aria-hidden="true" className="hud pointer-events-none absolute font-mono text-[0.72rem] text-pearl/85" style={{ inset: "clamp(0.75rem, 2.4vw, 2rem)" }}>
          <span className="hud-corner left-0 top-0 border-l-2 border-t-2" />
          <span className="hud-corner right-0 top-0 border-r-2 border-t-2" />
          <span className="hud-corner bottom-0 left-0 border-b-2 border-l-2" />
          <span className="hud-corner bottom-0 right-0 border-b-2 border-r-2" />
          <span className="absolute left-6 top-4 hidden md:block">AISFM / visibility scanner v2.6</span>
          <span ref={clock} className="absolute right-6 top-4 tabular-nums" />
          <span ref={coords} className="absolute bottom-4 left-6 hidden tabular-nums md:block">
            x 0000  y 0000
          </span>
          <span className="absolute bottom-4 right-6 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full bg-pearl ${phase === "scanning" ? "animate-ping" : "animate-pulse"}`} />
            {phase === "scanning" ? "scanning" : phase === "answer" ? "request ready" : "standing by"}
          </span>
        </div>

        <div className="cta-inner frame relative w-full py-28">
          {/* 1. Ask */}
          <div className={`cta-state ${phase === "ask" ? "" : "is-away"}`} aria-hidden={phase !== "ask"}>
            <h2 id="cta-title" className="display text-[clamp(2.6rem,7vw,7.5rem)]">
              <ScrambleText text="Can AI find you?" duration={1100} />
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1.1rem] leading-snug text-pearl/90">
              Type your domain. We&apos;ll check how ChatGPT, Perplexity and Google&apos;s AI answers see it,
              and send you what we find.
            </p>

            <form onSubmit={submit} noValidate className="mt-12 md:mt-16">
              <label htmlFor="cta-domain" className="sr-only">
                Your website domain
              </label>
              <div className="cta-field relative flex items-end gap-4 border-b-[3px] border-pearl/50 pb-3 focus-within:border-pearl md:gap-8">
                <span aria-hidden="true" className="mb-3 hidden font-mono text-[1rem] text-pearl/80 md:block">
                  &gt;_
                </span>
                <input
                  ref={input}
                  id="cta-domain"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  spellCheck={false}
                  placeholder="yourbrand.com"
                  value={value}
                  tabIndex={phase === "ask" ? 0 : -1}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => {
                    if (value.trim() && !DOMAIN.test(value.trim()))
                      setError("That doesn't look like a domain yet. Try yourbrand.com.");
                  }}
                  aria-invalid={!!error}
                  aria-describedby="cta-domain-help"
                  className="display min-w-0 flex-1 bg-transparent text-[clamp(2.4rem,8vw,8.5rem)] text-pearl caret-pearl outline-none placeholder:text-pearl/35"
                />
                <Magnetic strength={0.35}>
                  <button
                    type="submit"
                    tabIndex={phase === "ask" ? 0 : -1}
                    data-cursor="Scan"
                    aria-label="Scan my brand"
                    className="press flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pearl text-orange-hot md:h-24 md:w-24"
                  >
                    <svg width="28" height="28" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                </Magnetic>
              </div>
              <p
                id="cta-domain-help"
                role={error ? "alert" : undefined}
                className="mt-4 min-h-[1.5em] text-[1rem] font-semibold"
              >
                {error || <span className="font-normal text-pearl/80">Free. No login. A real person replies within 48 hours.</span>}
              </p>
            </form>

            <p className="mt-8 text-[1rem] text-pearl/85">
              Rather just talk?{" "}
              <a href={`mailto:${contact.email}`} className="link-line font-semibold text-pearl">
                {contact.email}
              </a>
            </p>
          </div>

          {/* 2. Scanning console */}
          {phase === "scanning" && (
            <div className="cta-overlay flex items-center" role="status" aria-label={`Preparing the audit for ${domain}`}>
              <div className="w-full max-w-[860px] rounded-2xl border border-pearl/35 bg-orange-hot/35 p-5 font-mono text-[0.9rem] backdrop-blur-sm md:p-8 md:text-[1rem]">
                <div className="mb-5 flex items-center justify-between text-pearl/80">
                  <span>scan://{domain}</span>
                  <span className="tabular-nums">{String(pct).padStart(3, " ")}%</span>
                </div>
                <ul className="space-y-2">
                  {consoleLines(domain)
                    .slice(0, shown)
                    .map((l, i) => (
                      <li key={i} className="console-line flex justify-between gap-6">
                        <span className="truncate">
                          <span className="text-pearl/60">&gt; </span>
                          {l.t}
                        </span>
                        <span className="shrink-0 font-semibold">[{l.r}]</span>
                      </li>
                    ))}
                  {shown < consoleLines(domain).length && (
                    <li className="flex items-center gap-1 text-pearl/70">
                      &gt; <span className="inline-block h-[1.1em] w-[0.6em] animate-pulse bg-pearl" />
                    </li>
                  )}
                </ul>
                <div className="mt-6 h-[3px] overflow-hidden rounded-full bg-pearl/25">
                  <div className="h-full origin-left bg-pearl" style={{ transform: `scaleX(${pct / 100})` }} />
                </div>
              </div>
            </div>
          )}

          {/* 3. Answer */}
          {phase === "answer" && (
            <div className="cta-overlay flex flex-col justify-center">
              <p className="answer-rise mb-4 font-mono text-[0.85rem] text-pearl/85">scan://{domain} · request ready</p>
              <h2 ref={answerHeading} tabIndex={-1} className="display text-[clamp(2.6rem,7vw,7.5rem)] outline-none">
                <ScrambleText text={`Let's make ${domain} the answer.`} play duration={900} />
              </h2>
              <ol className="mt-10 grid max-w-[1100px] gap-6 md:grid-cols-3">
                {[
                  `We ask the answer engines about ${domain}'s market and log who gets cited.`,
                  "You get a short video walkthrough of what we found within 48 hours.",
                  "If there's a fit, we plan how to make you the source they quote.",
                ].map((t, i) => (
                  <li key={i} className="answer-rise border-t-2 border-pearl/40 pt-4" style={{ animationDelay: `${300 + i * 70}ms` }}>
                    <span className="font-mono text-[0.85rem] font-semibold">0{i + 1}</span>
                    <p className="mt-2 text-[1.05rem] leading-snug">{t}</p>
                  </li>
                ))}
              </ol>
              <div className="answer-rise mt-12 flex flex-wrap items-center gap-6" style={{ animationDelay: "520ms" }}>
                <Magnetic strength={0.3}>
                  <a
                    href={mail}
                    data-cursor="Send"
                    className="roll-host press flex h-16 items-center rounded-full bg-pearl px-9 text-[1.1rem] font-bold text-orange-hot"
                  >
                    <RollText text="Send my request" />
                  </a>
                </Magnetic>
                <button type="button" onClick={reset} className="link-line text-[1rem] font-semibold">
                  Scan another brand
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cta-grid {
          background-image:
            linear-gradient(to right, rgba(255,253,247,0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,253,247,0.14) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse at 50% 55%, black 30%, transparent 78%);
          animation: grid-drift 18s linear infinite;
        }
        @keyframes grid-drift { to { background-position: 64px 64px; } }
        .cta-beam {
          background: linear-gradient(to bottom, transparent, rgba(255,253,247,0.08) 75%, rgba(255,253,247,0.3) 99%, transparent);
          animation: sweep 6s var(--ease-in-out) infinite;
        }
        .cta-beam.is-fast { animation-duration: 1.4s; }
        @keyframes sweep { from { transform: translateY(-30vh); } to { transform: translateY(100dvh); } }
        .hud-corner { position: absolute; width: 22px; height: 22px; border-color: rgba(255,253,247,0.85); }
        .cta-state { transition: opacity 350ms var(--ease-out), transform 350ms var(--ease-out), filter 350ms var(--ease-out); }
        .cta-state.is-away { opacity: 0; transform: translateY(-16px); filter: blur(6px); pointer-events: none; }
        .cta-overlay { position: absolute; inset: 0; padding: 7rem var(--gutter); }
        @keyframes answer-rise { from { opacity: 0; transform: translateY(18px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
        .answer-rise, .cta-overlay[role="status"] { animation: answer-rise 550ms var(--ease-out) both; }
        @keyframes line-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
        .console-line { animation: line-in 250ms var(--ease-out) both; }
        @media (prefers-reduced-motion: reduce) { .cta-grid, .cta-beam { animation: none; } .cta-beam { display: none; } }
      `}</style>
    </section>
  );
}
