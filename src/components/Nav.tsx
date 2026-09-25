"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { ScrollTrigger } from "@/lib/gsap";
import { nav } from "@/content/site";
import { scrollToId } from "@/lib/store";
import { Logo } from "./ui/Logo";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
        const el = bar.current;
        if (!el) return;
        // Hide while reading down, return the moment the reader scrolls up.
        const hide = self.direction === 1 && self.scroll() > 160;
        el.dataset.hidden = hide ? "true" : "false";
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollToId(href.slice(1));
  };

  return (
    <header
      ref={bar}
      data-hidden="false"
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[var(--ease-out)] data-[hidden=true]:-translate-y-full"
    >
      <div className="frame">
        <div className="mt-3 flex h-14 items-center justify-between rounded-full border border-white/70 bg-white/70 pl-5 pr-2 shadow-[0_10px_30px_-18px_rgba(22,23,27,0.25)] backdrop-blur-md">
          <a href="#top" onClick={(e) => { e.preventDefault(); go("#top"); }} aria-label="AI SEO For Me, back to top">
            <Logo />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); go(item.href); }}
                className="link-line text-[0.93rem] text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); go("#contact"); }}
              className="press inline-flex h-10 items-center rounded-full bg-ink px-5 text-[0.9rem] font-medium text-white transition-colors duration-200 hover:bg-orange"
            >
              Book a call
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="press grid size-10 place-items-center rounded-full border border-line bg-white md:hidden"
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          data-open={open}
          className="mt-2 origin-top rounded-3xl border border-line bg-white p-3 opacity-0 shadow-xl transition-[opacity,transform] duration-200 ease-[var(--ease-out)] [transform:scale(0.97)_translateY(-6px)] pointer-events-none data-[open=true]:pointer-events-auto data-[open=true]:opacity-100 data-[open=true]:[transform:none] md:hidden"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={(e) => { e.preventDefault(); go(item.href); }}
              className="block rounded-2xl px-4 py-3.5 text-lg text-ink active:bg-pearl"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 h-[2px]">
        <div ref={progress} className="h-full origin-left scale-x-0 bg-orange" />
      </div>
    </header>
  );
}
