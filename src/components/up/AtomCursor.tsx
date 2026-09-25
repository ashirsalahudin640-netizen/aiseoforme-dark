"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * An atom for a cursor: an orange nucleus that tracks the pointer exactly,
 * with three electron orbits trailing a frame behind. Over anything
 * clickable the orbits open up; over text fields the native caret returns.
 * Only on fine pointers. Touch and keyboard use is untouched.
 */
export function AtomCursor() {
  const nucleus = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !nucleus.current || !shell.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) svg.current?.pauseAnimations();

    document.documentElement.classList.add("atom-cursor");
    const nx = gsap.quickSetter(nucleus.current, "x", "px");
    const ny = gsap.quickSetter(nucleus.current, "y", "px");
    const sx = gsap.quickTo(shell.current, "x", { duration: 0.16, ease: "power3.out" });
    const sy = gsap.quickTo(shell.current, "y", { duration: 0.16, ease: "power3.out" });
    const root = document.documentElement;
    let shown = false;

    const move = (e: PointerEvent) => {
      nx(e.clientX);
      ny(e.clientY);
      sx(e.clientX);
      sy(e.clientY);
      if (!shown) {
        shown = true;
        root.dataset.atom = "on";
      }
      const t = e.target as Element | null;
      const field = t?.closest("input, textarea, select, [contenteditable]");
      const hot = !field && t?.closest("a, button, [role='tab'], label, summary");
      root.dataset.atom = field ? "text" : hot ? "hot" : "on";

      // Spotlight borders: cards with .spot light up where the pointer is.
      const card = t?.closest<HTMLElement>(".spot");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    const leave = () => {
      shown = false;
      root.dataset.atom = "off";
    };
    const down = () => root.classList.add("atom-press");
    const up = () => root.classList.remove("atom-press");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      root.classList.remove("atom-cursor", "atom-press");
      delete root.dataset.atom;
    };
  }, []);

  // One orbit path: an ellipse centred on the nucleus.
  const orbit = "M-17,0 a17,6.2 0 1,0 34,0 a17,6.2 0 1,0 -34,0";

  return (
    <div className="atom pointer-events-none fixed left-0 top-0 z-[100] hidden" aria-hidden="true">
      <div ref={shell} className="absolute left-0 top-0">
        <div className="atom-shell">
          <svg ref={svg} width="56" height="56" viewBox="-28 -28 56 56" className="atom-spin overflow-visible">
            {[0, 60, 120].map((deg, i) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <path d={orbit} fill="none" stroke="#7b77e8" strokeOpacity="0.9" strokeWidth="1" />
                <circle r="2" fill={i === 0 ? "#ff7d00" : "#ffffff"} stroke="#2b27a3" strokeWidth="0.8">
                  <animateMotion dur={`${1.1 + i * 0.35}s`} repeatCount="indefinite" path={orbit} />
                </circle>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div ref={nucleus} className="absolute left-0 top-0">
        <div className="atom-nucleus" />
      </div>
    </div>
  );
}
