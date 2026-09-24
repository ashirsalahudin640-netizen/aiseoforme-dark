"use client";

import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/store";

const SECTIONS = [
  { id: "top", label: "Intro" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

/**
 * Right-edge index of the page. The fill tracks overall scroll; the current
 * section's name slides out beside its tick. Desktop only.
 */
export function ScrollRail() {
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const triggers = SECTIONS.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    const total = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      total.kill();
    };
  });

  return (
    <nav
      aria-label="Page sections"
      className="scroll-rail fixed right-5 top-1/2 z-[50] hidden -translate-y-1/2 lg:block"
    >
      <span aria-hidden="true" className="absolute right-[5px] top-0 h-full w-[2px] rounded-full bg-current opacity-20" />
      <span
        ref={fill}
        aria-hidden="true"
        className="absolute right-[5px] top-0 h-full w-[2px] origin-top scale-y-0 rounded-full bg-current"
      />
      <ul className="relative flex flex-col gap-5">
        {SECTIONS.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => scrollToId(s.id)}
                aria-current={on ? "true" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={`text-[0.85rem] font-semibold transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                    on ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-3 w-3 rounded-full border-2 border-current transition-[transform,background-color] duration-500 ease-[var(--ease-out)] ${
                    on ? "scale-100 bg-current" : "scale-75 bg-transparent"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <style>{`
        .scroll-rail { color: var(--orange-hot); transition: color 300ms ease; }
        html.tone-orange .scroll-rail { color: var(--pearl); }
      `}</style>
    </nav>
  );
}
