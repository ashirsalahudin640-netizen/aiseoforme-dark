"use client";

import { useEffect, useRef } from "react";
import { store } from "@/lib/store";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>{}[]=+*";

/**
 * Text that decodes from random glyphs into its final string, left to right.
 * Starts when `play` turns true (or on first view when `play` is undefined).
 */
export function ScrambleText({
  text,
  className,
  play,
  duration = 900,
}: {
  text: string;
  className?: string;
  play?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (store.reduced) {
      el.textContent = text;
      return;
    }
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const settled = Math.floor(t * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          out += i < settled || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    if (play === undefined) {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
      };
    }
    if (play) run();
    return () => cancelAnimationFrame(raf);
  }, [text, play, duration]);

  return (
    <span className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
