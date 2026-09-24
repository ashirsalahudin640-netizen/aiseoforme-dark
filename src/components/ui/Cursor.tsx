"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer } from "@/lib/device";

/**
 * Orange dot that tracks the pointer 1:1, plus a trailing ring that grows and
 * shows a label over any element with `data-cursor="LABEL"`.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasFinePointer()) return;
    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;
    document.documentElement.classList.add("has-cursor");

    const ringX = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3.out" });
    let current: string | null = null;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      d.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ringX(e.clientX);
      ringY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.2 });
      }
    };

    const setState = (text: string | null, interactive: boolean) => {
      if (text === current && interactive === r.classList.contains("is-hover")) return;
      current = text;
      r.classList.toggle("is-hover", interactive && !text);
      r.classList.toggle("is-label", !!text);
      d.classList.toggle("is-hidden", !!text);
      if (text) l.textContent = text;
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      wrap.current?.classList.toggle("on-dark", !!target?.closest('[data-tone="dark"], footer'));
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setState(labelled.dataset.cursor || null, true);
        return;
      }
      const interactive = target?.closest("a, button, [role='button'], label");
      setState(null, !!interactive);
    };

    const onDown = () => gsap.to(r, { scale: 0.85, duration: 0.15, ease: "power2.out" });
    const onUp = () => gsap.to(r, { scale: 1, duration: 0.3, ease: "power3.out" });
    const onLeave = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="cursor-wrap pointer-events-none fixed inset-0 z-[80] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div
        ref={ring}
        className="cursor-ring absolute left-0 top-0 opacity-0"
      >
        <span ref={label} className="cursor-label" />
      </div>
      <div
        ref={dot}
        className="cursor-dot absolute left-0 top-0 -ml-[4px] -mt-[4px] h-2 w-2 rounded-full bg-orange opacity-0"
      />
      <style>{`
        .cursor-ring {
          width: 0; height: 0;
        }
        .cursor-ring::before {
          content: "";
          position: absolute;
          left: -18px; top: -18px;
          width: 36px; height: 36px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--orange) 55%, transparent);
          transition: transform 450ms var(--ease-out), background-color 300ms ease, border-color 300ms ease;
        }
        .cursor-ring.is-hover::before {
          transform: scale(1.6);
          background: color-mix(in srgb, var(--ink) 8%, transparent);
          border-color: transparent;
        }
        .cursor-ring.is-label::before {
          transform: scale(2.6);
          background: var(--orange);
          border-color: transparent;
        }
        .cursor-wrap.on-dark .cursor-dot { background: var(--paper); }
        .cursor-wrap.on-dark .cursor-ring::before { border-color: color-mix(in srgb, var(--paper) 50%, transparent); }
        .cursor-wrap.on-dark .cursor-ring.is-label::before { background: var(--paper); }
        .cursor-wrap.on-dark .cursor-label { color: var(--ink); }
        .cursor-label {
          font-size: 0.8rem;
          letter-spacing: -0.01em;
          position: absolute;
          left: 0; top: 0;
          transform: translate(-50%, -50%) scale(0.6);
          color: var(--paper);
          opacity: 0;
          white-space: nowrap;
          font-weight: 600;
          transition: opacity 200ms ease, transform 450ms var(--ease-out);
        }
        .cursor-ring.is-label .cursor-label {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .cursor-dot { transition: opacity 200ms ease, transform 0ms; }
        .cursor-dot.is-hidden { opacity: 0 !important; }
      `}</style>
    </div>
  );
}
