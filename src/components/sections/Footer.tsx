"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, nav } from "@/content/site";
import { scrollToId, store } from "@/lib/store";
import { Logo } from "@/components/ui/Logo";
import { RollText } from "@/components/ui/RollText";

type Status = "idle" | "error" | "done";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  // The wordmark rises out of the floor as the footer arrives.
  useGSAP(
    () => {
      if (store.reduced) return;
      gsap.fromTo(
        ".wordmark-char",
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom bottom", scrub: 1 },
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
    <footer ref={ref} data-tone="dark" className="relative overflow-hidden bg-navy pt-20 text-paper md:pt-28">
      <div className="frame grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="dark" />
          <p className="mt-8 max-w-[26ch] text-[clamp(1.6rem,2.4vw,2.2rem)] font-light leading-[1.15] tracking-[-0.03em]">
            AI-powered SEO for the next generation of search.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-4">
          <div>
            <p className="mb-4 text-[0.9rem] text-paper/55">Say hello</p>
            <a href={`mailto:${contact.email}`} className="link-line">
              {contact.email}
            </a>
            <p className="mb-4 mt-9 text-[0.9rem] text-paper/55">Partnerships</p>
            <a href={`mailto:${contact.business}`} className="link-line">
              {contact.business}
            </a>
          </div>
          <div>
            <p className="mb-4 text-[0.9rem] text-paper/55">Explore</p>
            <ul className="flex flex-col gap-1.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.href.slice(1));
                    }}
                    className="roll-host"
                  >
                    <RollText text={n.label} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-9 text-[0.9rem] text-paper/55">Social</p>
            <ul className="flex flex-col gap-1.5">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="roll-host">
                    <RollText text={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="md:col-span-3">
          <label htmlFor="newsletter" className="mb-4 block text-[0.9rem] text-paper/55">
            Search notes, once a month
          </label>
          <div className="flex items-center gap-2 border-b border-paper/25 pb-2 focus-within:border-paper">
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
              className="w-full bg-transparent py-2 text-base text-paper outline-none placeholder:text-paper/35"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
          <p
            id="newsletter-help"
            aria-live="polite"
            className={`mt-3 text-[0.85rem] ${status === "error" ? "text-orange" : "text-paper/55"}`}
          >
            {status === "error"
              ? "That email is missing something. Check the @ and the domain."
              : status === "done"
                ? "You're on the list. The first note lands next month."
                : "One email a month about where search is heading."}
          </p>
        </form>
      </div>

      <div className="frame mt-20 flex flex-col gap-3 pb-8 text-[0.85rem] text-paper/55 md:mt-28 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} AI SEO For Me</p>
        <p>{contact.address}</p>
      </div>

      <p
        aria-hidden="true"
        className="display text-crystal flex select-none justify-between overflow-hidden px-[1vw] pb-[1vw] text-[15.5vw] !leading-[0.85]"
      >
        {Array.from("AI SEO For Me").map((c, i) => (
          <span key={i} className="wordmark-char inline-block">
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
      {/* Leave room for the floating dock */}
      <div className="h-24" aria-hidden="true" />
    </footer>
  );
}
