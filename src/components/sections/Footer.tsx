"use client";

import { useState, type FormEvent } from "react";
import { contact, nav } from "@/content/site";
import { scrollToId } from "@/lib/store";
import { Logo } from "@/components/ui/Logo";

type Status = "idle" | "error" | "done";

export function Footer() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setStatus(ok ? "done" : "error");
    if (ok) setEmail("");
  };

  return (
    <footer className="frame relative z-10 bg-navy pb-8 pt-20 text-pearl md:pt-28">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="dark" className="text-[1.6rem]" withWordmark={false} />
          <p className="mt-8 max-w-[30ch] text-[1.35rem] font-medium leading-[1.2] tracking-[-0.025em]">
            AI-powered SEO for the next generation of search.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-5">
          <div>
            <p className="meta mb-5 text-pearl/50">General</p>
            <a href={`mailto:${contact.email}`} className="link-line">
              {contact.email}
            </a>
            <p className="meta mb-5 mt-10 text-pearl/50">Partnerships</p>
            <a href={`mailto:${contact.business}`} className="link-line">
              {contact.business}
            </a>
          </div>
          <div>
            <p className="meta mb-5 text-pearl/50">Explore</p>
            <ul className="flex flex-col gap-2">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.id);
                    }}
                    className="link-line"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="meta mb-5 mt-10 text-pearl/50">Social</p>
            <ul className="flex flex-col gap-2">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-line">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="md:col-span-3">
          <label htmlFor="newsletter" className="meta mb-5 block text-pearl/50">
            Search notes, monthly
          </label>
          <div className="flex items-center gap-2 border-b border-pearl/30 pb-2 focus-within:border-orange">
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
              className="w-full bg-transparent py-2 text-base text-pearl outline-none placeholder:text-pearl/35"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-pearl"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
          <p
            id="newsletter-help"
            aria-live="polite"
            className={`meta mt-3 ${status === "error" ? "text-orange" : "text-pearl/50"}`}
          >
            {status === "error"
              ? "That email doesn't look right."
              : status === "done"
                ? "You're on the list. First note lands next month."
                : "One email a month. No filler."}
          </p>
        </form>
      </div>

      <div className="mt-24 flex flex-col gap-3 border-t border-pearl/15 pt-6 md:mt-32 md:flex-row md:items-center md:justify-between">
        <p className="meta text-pearl/50">© {new Date().getFullYear()} AI SEO For Me</p>
        <p className="meta text-pearl/50">{contact.address}</p>
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="meta link-line w-fit text-pearl/80"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
