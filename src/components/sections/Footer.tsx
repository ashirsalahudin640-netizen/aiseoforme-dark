"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, nav } from "@/content/site";
import { scrollToId, store } from "@/lib/store";
import { RollText } from "@/components/ui/RollText";

type Status = "idle" | "error" | "done";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  // The giant wordmark rises out of the floor as the footer arrives.
  useGSAP(
    () => {
      if (store.reduced) return;
      gsap.fromTo(
        ".wordmark-char",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom bottom", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setStatus(ok ? "done" : "error");
    if (ok) setEmail("");
  };

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden bg-pearl pt-20 text-roast md:pt-28">
      <div className="frame grid gap-14 md:grid-cols-12">
        <p className="display max-w-[14ch] text-[clamp(2rem,3.4vw,3.4rem)] text-orange md:col-span-5">
          AI-powered SEO for the next generation of search.
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-4">
          <div>
            <p className="mb-4 text-[0.95rem] font-semibold text-roast-soft">Say hello</p>
            <a href={`mailto:${contact.email}`} className="link-line font-medium">
              {contact.email}
            </a>
            <p className="mb-4 mt-9 text-[0.95rem] font-semibold text-roast-soft">Partnerships</p>
            <a href={`mailto:${contact.business}`} className="link-line font-medium">
              {contact.business}
            </a>
          </div>
          <div>
            <p className="mb-4 text-[0.95rem] font-semibold text-roast-soft">Explore</p>
            <ul className="flex flex-col gap-1.5">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.id);
                    }}
                    className="roll-host font-medium"
                  >
                    <RollText text={n.label} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-9 text-[0.95rem] font-semibold text-roast-soft">Social</p>
            <ul className="flex flex-col gap-1.5">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="roll-host font-medium">
                    <RollText text={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="md:col-span-3">
          <label htmlFor="newsletter" className="mb-4 block text-[0.95rem] font-semibold text-roast-soft">
            Search notes, once a month
          </label>
          <div className="flex items-center gap-2 border-b-2 border-roast/20 pb-2 focus-within:border-orange">
            <input
              id="newsletter"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby="newsletter-help"
              className="w-full bg-transparent py-2 text-base text-roast outline-none placeholder:text-roast/35"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange text-pearl"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </button>
          </div>
          <p
            id="newsletter-help"
            aria-live="polite"
            className={`note mt-3 ${status === "error" ? "font-semibold text-orange-hot" : "text-roast-soft"}`}
          >
            {status === "error"
              ? "That email is missing something. Check the @ and the domain."
              : status === "done"
                ? "You're on the list. The first note lands next month."
                : "One email a month about where search is heading."}
          </p>
        </form>
      </div>

      <div className="frame mt-20 flex flex-col gap-3 text-[0.9rem] text-roast-soft md:mt-28 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} AI SEO For Me</p>
        <p>{contact.address}</p>
        <button type="button" onClick={() => scrollToId("top")} className="roll-host w-fit font-semibold text-roast">
          <RollText text="Back to top" />
        </button>
      </div>

      {/* Full-bleed wordmark */}
      <p
        aria-hidden="true"
        className="display mt-8 flex select-none justify-between overflow-hidden px-[1vw] text-[17.6vw] !leading-[0.78] text-orange"
      >
        {Array.from("AI SEO FOR ME").map((c, i) => (
          <span key={i} className="wordmark-char inline-block">
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
    </footer>
  );
}
