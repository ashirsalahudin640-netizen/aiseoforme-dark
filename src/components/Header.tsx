"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onReady, scrollToId, store } from "@/lib/store";
import { contact, nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";

export function Header() {
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Intro + hide on scroll down / show on scroll up.
  useGSAP(() => {
    const el = bar.current!;
    gsap.set(el, { yPercent: -120 });
    const stopReady = onReady(() =>
      gsap.to(el, { yPercent: 0, duration: 1, delay: 0.5, ease: "expo.out" }),
    );
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const shouldHide = self.direction === 1 && self.scroll() > 160;
        if (shouldHide !== hidden && store.ready) {
          hidden = shouldHide;
          gsap.to(el, {
            yPercent: shouldHide ? -120 : 0,
            duration: shouldHide ? 0.4 : 0.6,
            ease: shouldHide ? "power2.in" : "expo.out",
            overwrite: true,
          });
        }
      },
    });
    return () => {
      stopReady();
      st.kill();
    };
  });

  // Menu overlay timeline.
  useGSAP(() => {
    const o = overlay.current!;
    const links = o.querySelectorAll(".menu-link");
    const extras = o.querySelectorAll(".menu-extra");
    tl.current = gsap
      .timeline({ paused: true })
      .set(o, { visibility: "visible" })
      .fromTo(
        o,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" },
      )
      .fromTo(
        links,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" },
        "-=0.35",
      )
      .fromTo(extras, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.05 }, "-=0.6");
  });

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    document.documentElement.classList.toggle("menu-open", open);
    if (open) {
      store.lenis?.stop();
      t.timeScale(1).play();
      const first = overlay.current?.querySelector<HTMLElement>(".menu-link");
      setTimeout(() => first?.focus(), 400);
    } else {
      t.timeScale(1.6).reverse();
      store.lenis?.start();
    }
  }, [open]);

  // Escape closes, Tab stays inside the overlay while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === "Tab" && overlay.current) {
        const items = [
          menuBtn.current,
          ...overlay.current.querySelectorAll<HTMLElement>("a, button"),
        ].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 350 : 0);
  };

  return (
    <>
      <header
        ref={bar}
        className="site-header frame fixed inset-x-0 top-0 z-[60] flex items-center justify-between py-5 text-navy"
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
          className="press"
          aria-label="AI SEO For Me — back to top"
        >
          <Logo />
        </a>

        <div className="flex items-center gap-2">
          <Magnetic strength={0.25} className="hidden sm:inline-block">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("contact");
              }}
              className="press meta group relative flex h-11 items-center overflow-hidden rounded-full bg-orange px-5 !text-[0.7rem] font-semibold text-pearl"
            >
              <span className="relative z-10">Let&apos;s talk</span>
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-navy transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-y-100" />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="menu-btn press relative flex h-11 w-11 items-center justify-center rounded-full bg-navy text-pearl transition-colors duration-300"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out)] ${open ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-[var(--ease-out)] ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <div
        ref={overlay}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className="frame invisible fixed inset-0 z-[55] flex flex-col justify-between bg-pearl pb-8 pt-28"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.id} className="line-mask border-b border-navy/10">
                <a
                  href={`#${item.id}`}
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  className="menu-link group flex items-baseline justify-between py-2 text-navy"
                >
                  <span className="display text-[16vw] transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-4 group-hover:text-orange md:text-[8.5vw]">
                    {item.label}
                  </span>
                  <span className="meta text-navy/50">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-6 pt-8 text-navy md:grid-cols-3">
          <a
            href={`mailto:${contact.email}`}
            tabIndex={open ? 0 : -1}
            className="menu-extra link-line w-fit text-lg"
          >
            {contact.email}
          </a>
          <p className="menu-extra meta self-center text-navy/60">{contact.address}</p>
          <ul className="menu-extra flex gap-5 md:justify-end">
            {contact.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={open ? 0 : -1}
                  className="meta link-line"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
